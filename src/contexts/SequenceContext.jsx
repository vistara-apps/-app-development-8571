import React, { createContext, useContext, useState, useEffect } from 'react'
import { sequenceService, sequenceStepService } from '../lib/database'
import { generateEmailContent } from '../lib/openai'
import { useAuth } from './AuthContext'

const SequenceContext = createContext()

export function useSequences() {
  const context = useContext(SequenceContext)
  if (!context) {
    throw new Error('useSequences must be used within a SequenceProvider')
  }
  return context
}

export function SequenceProvider({ children }) {
  const [sequences, setSequences] = useState([])
  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState({})
  const { user } = useAuth()

  // Load sequences when user changes
  useEffect(() => {
    if (user) {
      loadSequences()
    } else {
      setSequences([])
    }
  }, [user])

  const loadSequences = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const userSequences = await sequenceService.getSequencesByUserId(user.id)
      setSequences(userSequences)
    } catch (error) {
      console.error('Error loading sequences:', error)
      // Fallback to sample data if database fails
      const sampleSequences = [
        {
          id: '1',
          name: 'Welcome Series',
          is_active: true,
          trigger_conditions: { segment: 'Hot' },
          sequence_steps: [
            {
              id: '1',
              step_order: 1,
              step_type: 'email',
              content: {
                subject: 'Welcome to LeadFlow AI!',
                body: 'Hi {{name}}, welcome to our platform...'
              },
              delay_days: 0
            },
            {
              id: '2',
              step_order: 2,
              step_type: 'email',
              content: {
                subject: 'Getting Started Guide',
                body: 'Here are some tips to get you started...'
              },
              delay_days: 2
            }
          ],
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
        }
      ]
      setSequences(sampleSequences)
    } finally {
      setLoading(false)
    }
  }

  const createSequence = async (sequenceData) => {
    if (!user) throw new Error('User not authenticated')
    
    setLoading(true)
    try {
      const newSequence = await sequenceService.createSequence({
        ...sequenceData,
        userId: user.id
      })

      // Create sequence steps
      if (sequenceData.steps && sequenceData.steps.length > 0) {
        const steps = []
        for (const step of sequenceData.steps) {
          const newStep = await sequenceStepService.createSequenceStep({
            sequenceId: newSequence.id,
            order: step.order,
            type: step.type,
            content: step.content,
            delay: step.delay || 0
          })
          steps.push(newStep)
        }
        newSequence.sequence_steps = steps
      }

      setSequences(prev => [newSequence, ...prev])
      return newSequence
    } catch (error) {
      console.error('Error creating sequence:', error)
      // Fallback to local state
      const newSequence = {
        id: Date.now().toString(),
        ...sequenceData,
        sequence_steps: sequenceData.steps || [],
        created_at: new Date().toISOString()
      }
      setSequences(prev => [newSequence, ...prev])
      return newSequence
    } finally {
      setLoading(false)
    }
  }

  const updateSequence = async (sequenceId, updates) => {
    setLoading(true)
    try {
      const updatedSequence = await sequenceService.updateSequence(sequenceId, updates)
      setSequences(prev => prev.map(seq => 
        seq.id === sequenceId ? { ...seq, ...updatedSequence } : seq
      ))
      return updatedSequence
    } catch (error) {
      console.error('Error updating sequence:', error)
      // Fallback to local state update
      setSequences(prev => prev.map(seq => 
        seq.id === sequenceId ? { ...seq, ...updates } : seq
      ))
    } finally {
      setLoading(false)
    }
  }

  const deleteSequence = async (sequenceId) => {
    setLoading(true)
    try {
      await sequenceService.deleteSequence(sequenceId)
      setSequences(prev => prev.filter(seq => seq.id !== sequenceId))
    } catch (error) {
      console.error('Error deleting sequence:', error)
      // Fallback to local state update
      setSequences(prev => prev.filter(seq => seq.id !== sequenceId))
    } finally {
      setLoading(false)
    }
  }

  const addSequenceStep = async (sequenceId, stepData) => {
    setLoading(true)
    try {
      const newStep = await sequenceStepService.createSequenceStep({
        sequenceId,
        ...stepData
      })

      setSequences(prev => prev.map(seq => {
        if (seq.id === sequenceId) {
          return {
            ...seq,
            sequence_steps: [...(seq.sequence_steps || []), newStep]
          }
        }
        return seq
      }))

      return newStep
    } catch (error) {
      console.error('Error adding sequence step:', error)
      // Fallback to local state update
      const newStep = {
        id: Date.now().toString(),
        sequence_id: sequenceId,
        ...stepData,
        created_at: new Date().toISOString()
      }

      setSequences(prev => prev.map(seq => {
        if (seq.id === sequenceId) {
          return {
            ...seq,
            sequence_steps: [...(seq.sequence_steps || []), newStep]
          }
        }
        return seq
      }))

      return newStep
    } finally {
      setLoading(false)
    }
  }

  const updateSequenceStep = async (stepId, updates) => {
    setLoading(true)
    try {
      const updatedStep = await sequenceStepService.updateSequenceStep(stepId, updates)
      
      setSequences(prev => prev.map(seq => ({
        ...seq,
        sequence_steps: seq.sequence_steps?.map(step => 
          step.id === stepId ? { ...step, ...updatedStep } : step
        ) || []
      })))

      return updatedStep
    } catch (error) {
      console.error('Error updating sequence step:', error)
      // Fallback to local state update
      setSequences(prev => prev.map(seq => ({
        ...seq,
        sequence_steps: seq.sequence_steps?.map(step => 
          step.id === stepId ? { ...step, ...updates } : step
        ) || []
      })))
    } finally {
      setLoading(false)
    }
  }

  const deleteSequenceStep = async (stepId) => {
    setLoading(true)
    try {
      await sequenceStepService.deleteSequenceStep(stepId)
      
      setSequences(prev => prev.map(seq => ({
        ...seq,
        sequence_steps: seq.sequence_steps?.filter(step => step.id !== stepId) || []
      })))
    } catch (error) {
      console.error('Error deleting sequence step:', error)
      // Fallback to local state update
      setSequences(prev => prev.map(seq => ({
        ...seq,
        sequence_steps: seq.sequence_steps?.filter(step => step.id !== stepId) || []
      })))
    } finally {
      setLoading(false)
    }
  }

  const generateStepContent = async (template, leadData, stepNumber) => {
    try {
      return await generateEmailContent(template, leadData, stepNumber)
    } catch (error) {
      console.error('Error generating step content:', error)
      return template // Return original template if AI fails
    }
  }

  const getSequenceAnalytics = (sequenceId) => {
    // This would typically come from the database
    // For now, return mock analytics
    return {
      totalLeads: 45,
      completedLeads: 12,
      activeLeads: 23,
      pausedLeads: 10,
      openRate: 68,
      clickRate: 24,
      replyRate: 12,
      conversionRate: 8
    }
  }

  const stats = {
    total: sequences.length,
    active: sequences.filter(s => s.is_active).length,
    inactive: sequences.filter(s => !s.is_active).length,
    totalSteps: sequences.reduce((sum, s) => sum + (s.sequence_steps?.length || 0), 0)
  }

  const value = {
    sequences,
    loading,
    analytics,
    stats,
    createSequence,
    updateSequence,
    deleteSequence,
    addSequenceStep,
    updateSequenceStep,
    deleteSequenceStep,
    generateStepContent,
    getSequenceAnalytics,
    refreshSequences: loadSequences
  }

  return (
    <SequenceContext.Provider value={value}>
      {children}
    </SequenceContext.Provider>
  )
}
