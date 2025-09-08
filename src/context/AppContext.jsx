import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { mockLeads, mockSequences, mockActivities } from '../data/mockData'

const AppContext = createContext()

const initialState = {
  user: {
    userId: 'user_1',
    email: 'john@example.com',
    subscriptionPlan: 'Pro',
    createdAt: new Date().toISOString()
  },
  leads: mockLeads,
  sequences: mockSequences,
  activities: mockActivities,
  selectedLeadSegment: 'all',
  isLoading: false,
  error: null
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'UPDATE_LEAD':
      return {
        ...state,
        leads: state.leads.map(lead => 
          lead.leadId === action.payload.leadId 
            ? { ...lead, ...action.payload } 
            : lead
        )
      }
    case 'ADD_LEAD':
      return {
        ...state,
        leads: [...state.leads, action.payload]
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
    case 'DELETE_SEQUENCE':
      return {
        ...state,
        sequences: state.sequences.filter(seq => seq.sequenceId !== action.payload)
      }
    case 'SET_LEAD_SEGMENT':
      return { ...state, selectedLeadSegment: action.payload }
    case 'ADD_ACTIVITY':
      return {
        ...state,
        activities: [...state.activities, action.payload]
      }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Calculate lead scoring
  const calculateLeadScore = (lead) => {
    let score = 0
    
    // Email engagement (0-30 points)
    if (lead.lastActivity) {
      const daysSinceActivity = Math.floor((Date.now() - new Date(lead.lastActivity).getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceActivity <= 7) score += 30
      else if (daysSinceActivity <= 30) score += 20
      else if (daysSinceActivity <= 90) score += 10
    }
    
    // Company size (0-25 points)
    if (lead.company) {
      if (lead.company.includes('Enterprise') || lead.company.includes('Corp')) score += 25
      else if (lead.company.includes('Inc') || lead.company.includes('LLC')) score += 15
      else score += 10
    }
    
    // Email domain (0-20 points)
    if (lead.email) {
      const domain = lead.email.split('@')[1]
      if (domain && !['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'].includes(domain)) {
        score += 20
      }
    }
    
    // Title/Role (0-25 points)
    if (lead.title) {
      if (lead.title.toLowerCase().includes('ceo') || lead.title.toLowerCase().includes('founder')) score += 25
      else if (lead.title.toLowerCase().includes('director') || lead.title.toLowerCase().includes('vp')) score += 20
      else if (lead.title.toLowerCase().includes('manager')) score += 15
      else score += 10
    }
    
    return Math.min(score, 100)
  }

  // Auto-segment leads based on score
  const getLeadSegment = (score) => {
    if (score >= 80) return 'Hot'
    if (score >= 60) return 'Warm' 
    if (score >= 40) return 'Cold'
    return 'Nurture'
  }

  // Update lead scores on mount and when leads change
  useEffect(() => {
    const updatedLeads = state.leads.map(lead => {
      const score = calculateLeadScore(lead)
      const segment = getLeadSegment(score)
      return { ...lead, score, segment }
    })
    
    if (JSON.stringify(updatedLeads) !== JSON.stringify(state.leads)) {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const value = {
    ...state,
    dispatch,
    calculateLeadScore,
    getLeadSegment
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}