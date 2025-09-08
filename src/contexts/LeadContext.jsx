import React, { createContext, useContext, useState, useEffect } from 'react'

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

  // Sample lead data
  useEffect(() => {
    const sampleLeads = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@techcorp.com',
        company: 'TechCorp',
        score: 85,
        segment: 'Hot',
        lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        activities: [
          { type: 'email_open', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
          { type: 'website_visit', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() }
        ]
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@innovate.io',
        company: 'Innovate.io',
        score: 72,
        segment: 'Warm',
        lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        activities: [
          { type: 'email_open', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() }
        ]
      },
      {
        id: '3',
        name: 'Mike Chen',
        email: 'mike@startup.co',
        company: 'Startup Co',
        score: 45,
        segment: 'Cold',
        lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        activities: []
      },
      {
        id: '4',
        name: 'Emily Davis',
        email: 'emily@bigcorp.com',
        company: 'BigCorp',
        score: 91,
        segment: 'Hot',
        lastActivity: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        activities: [
          { type: 'email_click', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
          { type: 'website_visit', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() }
        ]
      }
    ]
    setLeads(sampleLeads)
  }, [])

  const addLead = (leadData) => {
    const newLead = {
      id: Date.now().toString(),
      ...leadData,
      score: calculateScore(leadData),
      segment: determineSegment(calculateScore(leadData)),
      lastActivity: new Date().toISOString(),
      activities: []
    }
    setLeads(prev => [...prev, newLead])
    return newLead
  }

  const updateLead = (id, updates) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, ...updates } : lead
    ))
  }

  const deleteLead = (id) => {
    setLeads(prev => prev.filter(lead => lead.id !== id))
  }

  const calculateScore = (leadData) => {
    // Simple scoring algorithm
    let score = 50 // Base score
    
    if (leadData.company && leadData.company.length > 0) score += 10
    if (leadData.email && leadData.email.includes('@')) score += 15
    if (leadData.activities && leadData.activities.length > 0) {
      score += leadData.activities.length * 5
    }
    
    return Math.min(100, Math.max(0, score))
  }

  const determineSegment = (score) => {
    if (score >= 80) return 'Hot'
    if (score >= 60) return 'Warm'
    if (score >= 40) return 'Cold'
    return 'Nurture'
  }

  const addActivity = (leadId, activity) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const newActivities = [...lead.activities, { ...activity, timestamp: new Date().toISOString() }]
        const newScore = calculateScore({ ...lead, activities: newActivities })
        return {
          ...lead,
          activities: newActivities,
          score: newScore,
          segment: determineSegment(newScore),
          lastActivity: new Date().toISOString()
        }
      }
      return lead
    }))
  }

  const getLeadsBySegment = (segment) => {
    return leads.filter(lead => lead.segment === segment)
  }

  const value = {
    leads,
    addLead,
    updateLead,
    deleteLead,
    addActivity,
    getLeadsBySegment,
    loading
  }

  return (
    <LeadContext.Provider value={value}>
      {children}
    </LeadContext.Provider>
  )
}