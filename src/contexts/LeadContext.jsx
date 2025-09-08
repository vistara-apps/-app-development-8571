import React, { createContext, useContext, useState, useEffect } from 'react'
import { leadService, leadActivityService } from '../lib/database'
import { generateLeadScore } from '../lib/openai'
import { useAuth } from './AuthContext'

const LeadContext = createContext()

export function useLeads() {
  const context = useContext(LeadContext)
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider')
  }
  return context
}

export function LeadProvider({ children }) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedSegment, setSelectedSegment] = useState('All')
  const { user } = useAuth()

  // Load leads when user changes
  useEffect(() => {
    if (user) {
      loadLeads()
    } else {
      setLeads([])
    }
  }, [user])

  const loadLeads = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const userLeads = await leadService.getLeadsByUserId(user.id)
      setLeads(userLeads)
    } catch (error) {
      console.error('Error loading leads:', error)
      // Fallback to sample data if database fails
      const sampleLeads = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john@techcorp.com',
          company: 'TechCorp',
          score: 85,
          segment: 'Hot',
          last_activity: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          status: 'New'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@innovate.io',
          company: 'Innovate.io',
          score: 72,
          segment: 'Warm',
          last_activity: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          status: 'Contacted'
        }
      ]
      setLeads(sampleLeads)
    } finally {
      setLoading(false)
    }
  }

  const addLead = async (leadData) => {
    if (!user) throw new Error('User not authenticated')
    
    setLoading(true)
    try {
      // Generate AI score for the lead
      const score = await generateLeadScore(leadData)
      const segment = getSegmentFromScore(score)
      
      const newLeadData = {
        ...leadData,
        userId: user.id,
        score,
        segment,
        status: 'New',
        lastActivity: new Date().toISOString()
      }

      const newLead = await leadService.createLead(newLeadData)
      
      // Log the lead creation activity
      await leadActivityService.createActivity({
        leadId: newLead.id,
        type: 'note_added',
        details: { note: 'Lead created' }
      })

      setLeads(prev => [newLead, ...prev])
      return newLead
    } catch (error) {
      console.error('Error adding lead:', error)
      // Fallback to local state if database fails
      const newLead = {
        id: Date.now().toString(),
        ...leadData,
        score: calculateFallbackScore(leadData),
        segment: getSegmentFromScore(calculateFallbackScore(leadData)),
        last_activity: new Date().toISOString(),
        status: 'New'
      }
      setLeads(prev => [newLead, ...prev])
      return newLead
    } finally {
      setLoading(false)
    }
  }

  const updateLead = async (leadId, updates) => {
    setLoading(true)
    try {
      const updatedLead = await leadService.updateLead(leadId, updates)
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? updatedLead : lead
      ))
      
      // Log the update activity
      await leadActivityService.createActivity({
        leadId,
        type: 'note_added',
        details: { note: 'Lead updated', changes: updates }
      })

      return updatedLead
    } catch (error) {
      console.error('Error updating lead:', error)
      // Fallback to local state update
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, ...updates } : lead
      ))
    } finally {
      setLoading(false)
    }
  }

  const deleteLead = async (leadId) => {
    setLoading(true)
    try {
      await leadService.deleteLead(leadId)
      setLeads(prev => prev.filter(lead => lead.id !== leadId))
    } catch (error) {
      console.error('Error deleting lead:', error)
      // Fallback to local state update
      setLeads(prev => prev.filter(lead => lead.id !== leadId))
    } finally {
      setLoading(false)
    }
  }

  const getLeadsBySegment = (segment) => {
    if (segment === 'All') return leads
    return leads.filter(lead => lead.segment === segment)
  }

  const rescoreAllLeads = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const updatedLeads = []
      
      for (const lead of leads) {
        const newScore = await generateLeadScore(lead)
        const newSegment = getSegmentFromScore(newScore)
        
        try {
          const updatedLead = await leadService.updateLead(lead.id, {
            score: newScore,
            segment: newSegment
          })
          updatedLeads.push(updatedLead)
        } catch (error) {
          // Fallback to local update
          updatedLeads.push({
            ...lead,
            score: newScore,
            segment: newSegment
          })
        }
      }
      
      setLeads(updatedLeads)
    } catch (error) {
      console.error('Error rescoring leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const addActivity = async (leadId, activity) => {
    try {
      await leadActivityService.createActivity({
        leadId,
        type: activity.type,
        details: activity.details || {}
      })
      
      // Update lead's last activity
      await updateLead(leadId, {
        last_activity: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error adding activity:', error)
    }
  }

  const filteredLeads = getLeadsBySegment(selectedSegment)

  const stats = {
    total: leads.length,
    hot: leads.filter(l => l.segment === 'Hot').length,
    warm: leads.filter(l => l.segment === 'Warm').length,
    cold: leads.filter(l => l.segment === 'Cold').length,
    nurture: leads.filter(l => l.segment === 'Nurture').length,
    averageScore: leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length) : 0
  }

  const value = {
    leads: filteredLeads,
    allLeads: leads,
    loading,
    selectedSegment,
    setSelectedSegment,
    addLead,
    updateLead,
    deleteLead,
    addActivity,
    getLeadsBySegment,
    rescoreAllLeads,
    refreshLeads: loadLeads,
    stats
  }

  return (
    <LeadContext.Provider value={value}>
      {children}
    </LeadContext.Provider>
  )
}

// Helper function to determine segment from score
function getSegmentFromScore(score) {
  if (score >= 80) return 'Hot'
  if (score >= 60) return 'Warm'
  if (score >= 40) return 'Cold'
  return 'Nurture'
}

// Fallback scoring algorithm
function calculateFallbackScore(leadData) {
  let score = 50 // Base score
  
  if (leadData.company && leadData.company.length > 0) score += 10
  if (leadData.email && leadData.email.includes('@')) score += 15
  if (leadData.title) {
    const title = leadData.title.toLowerCase()
    if (title.includes('ceo') || title.includes('founder')) score += 20
    else if (title.includes('director') || title.includes('manager')) score += 10
  }
  
  return Math.min(100, Math.max(0, score))
}
