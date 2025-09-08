import React from 'react'
import { useLeads } from '../contexts/LeadContext'
import { useSequences } from '../contexts/SequenceContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { TrendingUp, Users, Mail, Target, ArrowUp, ArrowDown } from 'lucide-react'
import LeadCard from '../components/LeadCard'

export default function Dashboard() {
  const { leads } = useLeads()
  const { sequences, analytics } = useSequences()

  // Calculate metrics
  const totalLeads = leads.length
  const hotLeads = leads.filter(lead => lead.segment === 'Hot').length
  const activeSequences = sequences.filter(seq => seq.isActive).length
  
  // Calculate average response rate
  const avgResponseRate = Object.values(analytics).reduce((acc, curr) => acc + curr.replyRate, 0) / Object.values(analytics).length || 0

  // Sample chart data
  const leadScoreData = [
    { segment: 'Hot', count: leads.filter(l => l.segment === 'Hot').length },
    { segment: 'Warm', count: leads.filter(l => l.segment === 'Warm').length },
    { segment: 'Cold', count: leads.filter(l => l.segment === 'Cold').length },
    { segment: 'Nurture', count: leads.filter(l => l.segment === 'Nurture').length },
  ]

  const activityData = [
    { day: 'Mon', activities: 23 },
    { day: 'Tue', activities: 45 },
    { day: 'Wed', activities: 32 },
    { day: 'Thu', activities: 67 },
    { day: 'Fri', activities: 43 },
    { day: 'Sat', activities: 21 },
    { day: 'Sun', activities: 15 },
  ]

  const recentLeads = leads.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary">Welcome back! Here's what's happening with your leads.</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Total Leads</p>
              <p className="text-2xl font-bold text-text-primary">{totalLeads}</p>
              <div className="flex items-center text-green-600 text-sm mt-1">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span>+12% this week</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Hot Leads</p>
              <p className="text-2xl font-bold text-text-primary">{hotLeads}</p>
              <div className="flex items-center text-green-600 text-sm mt-1">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span>+{Math.round((hotLeads / totalLeads) * 100)}% of total</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Active Sequences</p>
              <p className="text-2xl font-bold text-text-primary">{activeSequences}</p>
              <div className="flex items-center text-blue-600 text-sm mt-1">
                <Mail className="w-4 h-4 mr-1" />
                <span>2 launching today</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Avg Response Rate</p>
              <p className="text-2xl font-bold text-text-primary">{avgResponseRate.toFixed(1)}%</p>
              <div className="flex items-center text-green-600 text-sm mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Above average</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Lead Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leadScoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segment" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(150, 60%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="activities" 
                stroke="hsl(210, 40%, 60%)" 
                strokeWidth={3}
                dot={{ fill: 'hsl(210, 40%, 60%)', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Recent Leads</h3>
            <a href="/app/leads" className="text-accent hover:underline text-sm">View all</a>
          </div>
          <div className="space-y-3">
            {recentLeads.map(lead => (
              <LeadCard key={lead.id} lead={lead} variant="compact" />
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Sequence Performance</h3>
            <a href="/app/analytics" className="text-accent hover:underline text-sm">View details</a>
          </div>
          <div className="space-y-4">
            {sequences.slice(0, 3).map(sequence => {
              const stats = analytics[sequence.id] || {}
              return (
                <div key={sequence.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-text-primary">{sequence.name}</h4>
                    <p className="text-sm text-text-secondary">
                      {sequence.isActive ? 'Active' : 'Paused'} • {sequence.targetSegment} leads
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-text-primary">{stats.replyRate?.toFixed(1) || 0}%</p>
                    <p className="text-xs text-text-secondary">Reply rate</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}