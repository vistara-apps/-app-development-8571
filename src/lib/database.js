import { supabase, TABLES } from './supabase.js'

// User operations
export const userService = {
  async createUser(userData) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert([{
        id: userData.id,
        email: userData.email,
        name: userData.name,
        subscription_plan: userData.subscriptionPlan || 'free',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getUserById(userId) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },

  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Lead operations
export const leadService = {
  async createLead(leadData) {
    const { data, error } = await supabase
      .from(TABLES.LEADS)
      .insert([{
        user_id: leadData.userId,
        name: leadData.name,
        email: leadData.email,
        company: leadData.company,
        title: leadData.title,
        phone: leadData.phone,
        location: leadData.location,
        source: leadData.source,
        score: leadData.score || 0,
        segment: leadData.segment || 'Cold',
        status: leadData.status || 'New',
        last_activity: leadData.lastActivity || new Date().toISOString(),
        external_crm_id: leadData.externalCrmId,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getLeadsByUserId(userId) {
    const { data, error } = await supabase
      .from(TABLES.LEADS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async updateLead(leadId, updates) {
    const { data, error } = await supabase
      .from(TABLES.LEADS)
      .update(updates)
      .eq('id', leadId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteLead(leadId) {
    const { error } = await supabase
      .from(TABLES.LEADS)
      .delete()
      .eq('id', leadId)

    if (error) throw error
  },

  async getLeadsBySegment(userId, segment) {
    const { data, error } = await supabase
      .from(TABLES.LEADS)
      .select('*')
      .eq('user_id', userId)
      .eq('segment', segment)
      .order('score', { ascending: false })

    if (error) throw error
    return data
  }
}

// Sequence operations
export const sequenceService = {
  async createSequence(sequenceData) {
    const { data, error } = await supabase
      .from(TABLES.SEQUENCES)
      .insert([{
        user_id: sequenceData.userId,
        name: sequenceData.name,
        description: sequenceData.description,
        trigger_conditions: sequenceData.triggerConditions,
        is_active: sequenceData.isActive || false,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getSequencesByUserId(userId) {
    const { data, error } = await supabase
      .from(TABLES.SEQUENCES)
      .select(`
        *,
        sequence_steps (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async updateSequence(sequenceId, updates) {
    const { data, error } = await supabase
      .from(TABLES.SEQUENCES)
      .update(updates)
      .eq('id', sequenceId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteSequence(sequenceId) {
    // Delete sequence steps first
    await supabase
      .from(TABLES.SEQUENCE_STEPS)
      .delete()
      .eq('sequence_id', sequenceId)

    // Then delete the sequence
    const { error } = await supabase
      .from(TABLES.SEQUENCES)
      .delete()
      .eq('id', sequenceId)

    if (error) throw error
  }
}

// Sequence step operations
export const sequenceStepService = {
  async createSequenceStep(stepData) {
    const { data, error } = await supabase
      .from(TABLES.SEQUENCE_STEPS)
      .insert([{
        sequence_id: stepData.sequenceId,
        step_order: stepData.order,
        step_type: stepData.type,
        content: stepData.content,
        delay_days: stepData.delay || 0,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getSequenceSteps(sequenceId) {
    const { data, error } = await supabase
      .from(TABLES.SEQUENCE_STEPS)
      .select('*')
      .eq('sequence_id', sequenceId)
      .order('step_order', { ascending: true })

    if (error) throw error
    return data
  },

  async updateSequenceStep(stepId, updates) {
    const { data, error } = await supabase
      .from(TABLES.SEQUENCE_STEPS)
      .update(updates)
      .eq('id', stepId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteSequenceStep(stepId) {
    const { error } = await supabase
      .from(TABLES.SEQUENCE_STEPS)
      .delete()
      .eq('id', stepId)

    if (error) throw error
  }
}

// Lead activity operations
export const leadActivityService = {
  async createActivity(activityData) {
    const { data, error } = await supabase
      .from(TABLES.LEAD_ACTIVITIES)
      .insert([{
        lead_id: activityData.leadId,
        activity_type: activityData.type,
        activity_details: activityData.details,
        timestamp: activityData.timestamp || new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getLeadActivities(leadId) {
    const { data, error } = await supabase
      .from(TABLES.LEAD_ACTIVITIES)
      .select('*')
      .eq('lead_id', leadId)
      .order('timestamp', { ascending: false })

    if (error) throw error
    return data
  },

  async getRecentActivities(userId, limit = 50) {
    const { data, error } = await supabase
      .from(TABLES.LEAD_ACTIVITIES)
      .select(`
        *,
        leads!inner (
          name,
          email,
          company,
          user_id
        )
      `)
      .eq('leads.user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }
}

// Analytics operations
export const analyticsService = {
  async getLeadMetrics(userId) {
    const { data: leads, error } = await supabase
      .from(TABLES.LEADS)
      .select('segment, score, status, created_at')
      .eq('user_id', userId)

    if (error) throw error

    const metrics = {
      totalLeads: leads.length,
      hotLeads: leads.filter(l => l.segment === 'Hot').length,
      warmLeads: leads.filter(l => l.segment === 'Warm').length,
      coldLeads: leads.filter(l => l.segment === 'Cold').length,
      averageScore: leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length) : 0,
      newLeadsThisWeek: leads.filter(l => {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return new Date(l.created_at) > weekAgo
      }).length
    }

    return metrics
  },

  async getSequenceMetrics(userId) {
    const { data: sequences, error } = await supabase
      .from(TABLES.SEQUENCES)
      .select('id, name, is_active, created_at')
      .eq('user_id', userId)

    if (error) throw error

    const metrics = {
      totalSequences: sequences.length,
      activeSequences: sequences.filter(s => s.is_active).length,
      inactiveSequences: sequences.filter(s => !s.is_active).length
    }

    return metrics
  }
}
