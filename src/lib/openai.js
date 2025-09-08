import OpenAI from 'openai'

const apiKey = import.meta.env.VITE_OPENAI_API_KEY

if (!apiKey) {
  console.warn('OpenAI API key not found. AI features will be disabled.')
}

export const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
}) : null

// Lead scoring using AI
export async function generateLeadScore(leadData) {
  if (!openai) {
    // Fallback scoring algorithm
    return calculateFallbackScore(leadData)
  }

  try {
    const prompt = `
    Analyze this lead and provide a score from 0-100 based on their likelihood to convert:
    
    Lead Data:
    - Name: ${leadData.name}
    - Email: ${leadData.email}
    - Company: ${leadData.company}
    - Title: ${leadData.title}
    - Source: ${leadData.source}
    - Last Activity: ${leadData.lastActivity}
    - Location: ${leadData.location}
    
    Consider factors like:
    - Email domain quality (business vs personal)
    - Job title seniority
    - Company size indicators
    - Recent activity
    - Source quality
    
    Respond with only a number between 0-100.
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 10,
      temperature: 0.3
    })

    const score = parseInt(response.choices[0].message.content.trim())
    return isNaN(score) ? calculateFallbackScore(leadData) : Math.min(100, Math.max(0, score))
  } catch (error) {
    console.error('Error generating AI lead score:', error)
    return calculateFallbackScore(leadData)
  }
}

// Fallback scoring algorithm
function calculateFallbackScore(leadData) {
  let score = 50 // Base score

  // Email domain scoring
  if (leadData.email) {
    const domain = leadData.email.split('@')[1]
    if (domain && !['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'].includes(domain)) {
      score += 20 // Business email
    }
  }

  // Title scoring
  if (leadData.title) {
    const title = leadData.title.toLowerCase()
    if (title.includes('ceo') || title.includes('founder') || title.includes('president')) {
      score += 25
    } else if (title.includes('director') || title.includes('vp') || title.includes('manager')) {
      score += 15
    } else if (title.includes('lead') || title.includes('senior')) {
      score += 10
    }
  }

  // Source scoring
  if (leadData.source) {
    const source = leadData.source.toLowerCase()
    if (source.includes('referral')) {
      score += 15
    } else if (source.includes('linkedin')) {
      score += 10
    } else if (source.includes('website')) {
      score += 5
    }
  }

  // Recent activity bonus
  if (leadData.lastActivity) {
    const daysSinceActivity = Math.floor((new Date() - new Date(leadData.lastActivity)) / (1000 * 60 * 60 * 24))
    if (daysSinceActivity <= 1) {
      score += 15
    } else if (daysSinceActivity <= 7) {
      score += 10
    } else if (daysSinceActivity <= 30) {
      score += 5
    }
  }

  return Math.min(100, Math.max(0, score))
}

// Generate email content using AI
export async function generateEmailContent(template, leadData, sequenceStep) {
  if (!openai) {
    return template // Return template as-is if no AI
  }

  try {
    const prompt = `
    Generate a personalized email for this lead based on the template:
    
    Template: ${template}
    
    Lead Information:
    - Name: ${leadData.name}
    - Company: ${leadData.company}
    - Title: ${leadData.title}
    - Industry: ${leadData.industry || 'Unknown'}
    
    Sequence Step: ${sequenceStep}
    
    Make it personal, professional, and engaging. Replace any placeholders with actual data.
    Keep the same tone and structure as the template.
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7
    })

    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error generating email content:', error)
    return template
  }
}

// Suggest lead segmentation
export async function suggestSegmentation(leads) {
  if (!openai || !leads.length) {
    return leads.map(lead => ({
      ...lead,
      segment: getSegmentFromScore(lead.score)
    }))
  }

  try {
    const leadsData = leads.map(lead => ({
      id: lead.leadId,
      score: lead.score,
      company: lead.company,
      title: lead.title,
      lastActivity: lead.lastActivity
    }))

    const prompt = `
    Analyze these leads and suggest optimal segmentation (Hot, Warm, Cold, Nurture):
    
    ${JSON.stringify(leadsData, null, 2)}
    
    Consider:
    - Lead scores
    - Job titles and seniority
    - Company types
    - Recent activity
    
    Respond with a JSON array of objects with id and suggested segment.
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.3
    })

    const suggestions = JSON.parse(response.choices[0].message.content.trim())
    
    return leads.map(lead => {
      const suggestion = suggestions.find(s => s.id === lead.leadId)
      return {
        ...lead,
        segment: suggestion?.segment || getSegmentFromScore(lead.score)
      }
    })
  } catch (error) {
    console.error('Error generating segmentation suggestions:', error)
    return leads.map(lead => ({
      ...lead,
      segment: getSegmentFromScore(lead.score)
    }))
  }
}

// Helper function to determine segment from score
function getSegmentFromScore(score) {
  if (score >= 80) return 'Hot'
  if (score >= 60) return 'Warm'
  if (score >= 40) return 'Cold'
  return 'Nurture'
}
