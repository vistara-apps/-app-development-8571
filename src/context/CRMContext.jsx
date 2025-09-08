import React, { createContext, useContext, useReducer, useEffect } from 'react'

const CRMContext = createContext()

const initialState = {
  user: {
    userId: 'user-1',
    email: 'founder@example.com',
    subscriptionPlan: 'pro',
    createdAt: new Date().toISOString()
  },
  leads: [
    {
      leadId: 'lead-1',
      name: 'John Smith',
      email: 'john@techcorp.com',
      company: 'TechCorp',
      score: 85,
      segment: 'Hot',
      lastActivity: new Date(Date.now() - 86400000).toISOString(),
      externalCRMId: null
    },
    {
      leadId: 'lead-2',
      name: 'Sarah Johnson',
      email: 'sarah@innovate.co',
      company: 'Innovate Co',
      score: 72,
      segment: 'Warm',
      lastActivity: new Date(Date.now() - 172800000).toISOString(),
      externalCRMId: null
    },
    {
      leadId: 'lead-3',
      name: 'Mike Chen',
      email: 'mike@startup.io',
      company: 'Startup.io',
      score: 45,
      segment: 'Cold',
      lastActivity: new Date(Date.now() - 604800000).toISOString(),
      externalCRMId: null
    },
    {
      leadId: 'lead-4',
      name: 'Emily Davis',
      email: 'emily@growth.com',
      company: 'Growth LLC',
      score: 90,
      segment: 'Hot',
      lastActivity: new Date(Date.now() - 43200000).toISOString(),
      externalCRMId: null
    }
  ],
  sequences: [
    {
      sequenceId: 'seq-1',
      userId: 'user-1',
      name: 'Welcome Series',
      steps: 3,
      triggerConditions: { segment: 'Hot' },
      isActive: true,
      createdAt: new Date(Date.now() - 604800000).toISOString()
    },
    {
      sequenceId: 'seq-2',
      userId: 'user-1',
      name: 'Nurture Campaign',
      steps: 5,
      triggerConditions: { segment: 'Warm' },
      isActive: true,
      createdAt: new Date(Date.now() - 1209600000).toISOString()
    }
  ],
  sequenceSteps: [
    {
      stepId: 'step-1',
      sequenceId: 'seq-1',
      order: 1,
      type: 'email',
      content: 'Welcome to our platform! Here\'s what you can expect...',
      delay: 0
    },
    {
      stepId: 'step-2',
      sequenceId: 'seq-1',
      order: 2,
      type: 'email',
      content: 'Have you had a chance to explore our features?',
      delay: 3
    },
    {
      stepId: 'step-3',
      sequenceId: 'seq-1',
      order: 3,
      type: 'email',
      content: 'Let\'s schedule a call to discuss your needs.',
      delay: 7
    }
  ],
  leadActivities: [
    {
      activityId: 'activity-1',
      leadId: 'lead-1',
      type: 'email_open',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      details: { sequenceId: 'seq-1', stepId: 'step-1' }
    },
    {
      activityId: 'activity-2',
      leadId: 'lead-2',
      type: 'website_visit',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      details: { page: '/pricing' }
    }
  ]
}

function crmReducer(state, action) {
  switch (action.type) {
    case 'ADD_LEAD':
      return {
        ...state,
        leads: [...state.leads, action.payload]
      }
    case 'UPDATE_LEAD':
      return {
        ...state,
        leads: state.leads.map(lead =>
          lead.leadId === action.payload.leadId
            ? { ...lead, ...action.payload }
            : lead
        )
      }
    case 'DELETE_LEAD':
      return {
        ...state,
        leads: state.leads.filter(lead => lead.leadId !== action.payload)
      }
    case 'ADD_SEQUENCE':
      return {
        ...state,
        sequences: [...state.sequences, action.payload]
      }
    case 'UPDATE_SEQUENCE':
      return {
        ...state,
        sequences: state.sequences.map(seq =>
          seq.sequenceId === action.payload.sequenceId
            ? { ...seq, ...action.payload }
            : seq
        )
      }
    case 'ADD_ACTIVITY':
      return {
        ...state,
        leadActivities: [...state.leadActivities, action.payload]
      }
    default:
      return state
  }
}

export function CRMProvider({ children }) {
  const [state, dispatch] = useReducer(crmReducer, initialState)

  // Auto-calculate lead scores based on activities
  useEffect(() => {
    const calculateScore = (lead) => {
      const activities = state.leadActivities.filter(a => a.leadId === lead.leadId)
      let score = 50 // Base score
      
      activities.forEach(activity => {
        switch (activity.type) {
          case 'email_open':
            score += 10
            break
          case 'email_click':
            score += 20
            break
          case 'website_visit':
            score += 15
            break
          case 'demo_request':
            score += 30
            break
        }
      })

      // Recency bonus
      const daysSinceLastActivity = Math.floor(
        (Date.now() - new Date(lead.lastActivity).getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSinceLastActivity < 1) score += 20
      else if (daysSinceLastActivity < 3) score += 10
      else if (daysSinceLastActivity > 7) score -= 10

      return Math.min(100, Math.max(0, score))
    }

    state.leads.forEach(lead => {
      const newScore = calculateScore(lead)
      let newSegment = 'Cold'
      
      if (newScore >= 80) newSegment = 'Hot'
      else if (newScore >= 60) newSegment = 'Warm'
      else if (newScore >= 40) newSegment = 'Nurture'

      if (lead.score !== newScore || lead.segment !== newSegment) {
        dispatch({
          type: 'UPDATE_LEAD',
          payload: { leadId: lead.leadId, score: newScore, segment: newSegment }
        })
      }
    })
  }, [state.leadActivities])

  const value = {
    ...state,
    dispatch,
    // Helper functions
    addLead: (lead) => dispatch({ type: 'ADD_LEAD', payload: lead }),
    updateLead: (lead) => dispatch({ type: 'UPDATE_LEAD', payload: lead }),
    deleteLead: (leadId) => dispatch({ type: 'DELETE_LEAD', payload: leadId }),
    addSequence: (sequence) => dispatch({ type: 'ADD_SEQUENCE', payload: sequence }),
    updateSequence: (sequence) => dispatch({ type: 'UPDATE_SEQUENCE', payload: sequence }),
    addActivity: (activity) => dispatch({ type: 'ADD_ACTIVITY', payload: activity })
  }

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>
}

export function useCRM() {
  const context = useContext(CRMContext)
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider')
  }
  return context
}