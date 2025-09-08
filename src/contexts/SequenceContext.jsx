import React, { createContext, useContext, useState, useEffect } from 'react'

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
  const [analytics, setAnalytics] = useState({})

  useEffect(() => {
    // Sample sequence data
    const sampleSequences = [
      {
        id: '1',
        name: 'Welcome Series',
        isActive: true,
        targetSegment: 'Hot',
        steps: [
          {
            id: '1',
            order: 1,
            type: 'email',
            subject: 'Welcome to LeadFlow AI!',
            content: 'Hi {{name}}, welcome to our platform...',
            delay: 0
          },
          {
            id: '2',
            order: 2,
            type: 'email',
            subject: 'Getting Started Guide',
            content: 'Here are some tips to get you started...',
            delay: 2
          }
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
      },
      {
        id: '2',
        name: 'Re-engagement Campaign',
        isActive: false,
        targetSegment: 'Cold',
        steps: [
          {
            id: '3',
            order: 1,
            type: 'email',
            subject: 'We miss you!',
            content: 'Hi {{name}}, we noticed you haven\'t been active...',
            delay: 0
          }
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
      }
    ]
    setSequences(sampleSequences)

    // Sample analytics data
    setAnalytics({
      '1': {
        sent: 45,
        opened: 32,
        clicked: 18,
        replied: 8,
        openRate: 71.1,
        clickRate: 40.0,
        replyRate: 17.8
      },
      '2': {
        sent: 23,
        opened: 12,
        clicked: 4,
        replied: 2,
        openRate: 52.2,
        clickRate: 17.4,
        replyRate: 8.7
      }
    })
  }, [])

  const createSequence = (sequenceData) => {
    const newSequence = {
      id: Date.now().toString(),
      ...sequenceData,
      createdAt: new Date().toISOString()
    }
    setSequences(prev => [...prev, newSequence])
    return newSequence
  }

  const updateSequence = (id, updates) => {
    setSequences(prev => prev.map(seq => 
      seq.id === id ? { ...seq, ...updates } : seq
    ))
  }

  const deleteSequence = (id) => {
    setSequences(prev => prev.filter(seq => seq.id !== id))
  }

  const toggleSequence = (id) => {
    setSequences(prev => prev.map(seq => 
      seq.id === id ? { ...seq, isActive: !seq.isActive } : seq
    ))
  }

  const getSequenceAnalytics = (id) => {
    return analytics[id] || {
      sent: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      openRate: 0,
      clickRate: 0,
      replyRate: 0
    }
  }

  const value = {
    sequences,
    analytics,
    createSequence,
    updateSequence,
    deleteSequence,
    toggleSequence,
    getSequenceAnalytics
  }

  return (
    <SequenceContext.Provider value={value}>
      {children}
    </SequenceContext.Provider>
  )
}