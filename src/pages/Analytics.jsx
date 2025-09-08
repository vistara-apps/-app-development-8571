import React, { useState } from 'react'
import { useSequences } from '../contexts/SequenceContext'
import { useLeads } from '../contexts/LeadContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Mail, Users, Target, Calendar } from 'lucide-react'

export default function Analytics() {
  const { sequences, getSequenceAnalytics } = useSequences()
  const { leads } = useLeads()
  const [timeRange, setTimeRange] = useState('7d')

  // Calculate overall metrics
  const totalSent = Object.values(sequences).reduce((acc, seq) => {
    const analytics = getSequenceAnalytics(seq.id)
    return acc + (analytics.sent || 0)
  }, 0)

  const totalOpened = Object.values(sequences).reduce((acc, seq) => {
    const analytics = getSequenceAnalytics(seq.id)
    return acc + (analytics.opened || 0)
  }, 0)

  const totalClicked = Object.values(sequences).reduce((acc, seq) => {
    const analytics = getSequenceAnalytics(seq.id)
    return acc + (analytics.clicked || 0)
  }, 0)

  const totalReplied = Object.values(sequences).reduce((acc, seq) => {
    const analytics = getSequenceAnalytics(seq.id)
    return acc + (analytics.replied || 0)
  }, 0)

  const avgOpenRate = totalSent ? (totalOpened / totalSent * 100).toFixed(1) : 0
  const avgClickRate = totalOpened ? (totalClicked / totalOpened * 100).toFixed(1) : 0
  const avgReplyRate = totalSent ? (totalReplied / totalSent * 100).toFixed(1) : 0

  // Sequence performance data
  const sequencePerformanceData = sequences.map(seq => {
    const analytics = getSequenceAnalytics(seq.id)
    return {
      name: seq.name,
      openRate: analytics.openRate || 0,
      clickRate: analytics.clickRate || 0,
      replyRate: analytics.replyRate || 0
    }
  })

  // Lead segment distribution
  const segmentData = [
    { name: 'Hot', value: leads.filter(l => l.segment === 'Hot').length, color: '#ef4444' },
    { name: 'Warm', value: leads.filter(l => l.segment === 'Warm').length, color: '#f59e0b' },
    { name: 'Cold', value: leads.filter(l => l.segment === 'Cold').length, color: '#3b82f6' },
    { name: 'Nurture', value: leads.filter(l => l.segment === 'Nurture').length, color: '#6b7280' },
  ]

  // Sample time series data
  const timeSeriesData = [
    { date: '2024-01-01', emails: 45, opens: 32, clicks: 18, replies: 8 },
    { date: '2024-01-02', emails: 52, opens: 38, clicks: 22, replies: 12 },
    { date: '2024-01-03', emails: 38, opens: 28, clicks: 15, replies: 6 },
    { date: '2024-01-04', emails: 61, opens: 44, clicks: 28, replies: 15 },
    { date: '2024-01-05', emails: 48, opens: 35, clicks: 20, replies: 9 },
    { date: '2024-01-06', emails: 55, opens: 41, clicks: 24, replies: 13 },
    { date: '2024-01-07', emails: 42, opens: 31, clicks: 17, replies: 7 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Analytics</h1>
          <p className="text-text-secondary">Track performance and optimize your outreach campaigns</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input w-auto"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Emails Sent</p>
              <p className="text-2xl font-bold text-text-primary">{totalSent}</p>
              <div className="flex items-center text-green-600 text-sm mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+15% vs last period</span>
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
              <p className="text-text-secondary text-sm font-medium">Open Rate</p>
              <p className="text-2xl font-bold text-text-primary">{avgOpenRate}%</p>
              <div className="flex items-center text-green-600 text-sm mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+3.2% vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Click Rate</p>
              <p className="text-2xl font-bold text-text-primary">{avgClickRate}%</p>
              <div className="flex items-center text-green-600 text-sm mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+1.8% vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Reply Rate</p>
              <p className="text-2xl font-bold text-text-primary">{avgReplyRate}%</p>
              <div className="flex items-center text-green-600 text-sm mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+2.1% vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Email Performance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
              <Line type="monotone" dataKey="emails" stroke="hsl(210, 40%, 60%)" strokeWidth={2} name="Emails Sent" />
              <Line type="monotone" dataKey="opens" stroke="hsl(150, 60%, 50%)" strokeWidth={2} name="Opens" />
              <Line type="monotone" dataKey="clicks" stroke="hsl(280, 60%, 50%)" strokeWidth={2} name="Clicks" />
              <Line type="monotone" dataKey="replies" stroke="hsl(25, 60%, 50%)" strokeWidth={2} name="Replies" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Lead Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={segmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {segmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sequence Performance */}
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Sequence Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={sequencePerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="openRate" fill="hsl(150, 60%, 50%)" name="Open Rate %" />
            <Bar dataKey="clickRate" fill="hsl(210, 40%, 60%)" name="Click Rate %" />
            <Bar dataKey="replyRate" fill="hsl(280, 60%, 50%)" name="Reply Rate %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Sequence Analytics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Detailed Sequence Analytics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-text-primary">Sequence</th>
                <th className="text-left py-3 px-4 font-medium text-text-primary">Status</th>
                <th className="text-right py-3 px-4 font-medium text-text-primary">Sent</th>
                <th className="text-right py-3 px-4 font-medium text-text-primary">Opened</th>
                <th className="text-right py-3 px-4 font-medium text-text-primary">Clicked</th>
                <th className="text-right py-3 px-4 font-medium text-text-primary">Replied</th>
                <th className="text-right py-3 px-4 font-medium text-text-primary">Reply Rate</th>
              </tr>
            </thead>
            <tbody>
              {sequences.map(sequence => {
                const analytics = getSequenceAnalytics(sequence.id)
                return (
                  <tr key={sequence.id} className="border-b">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-text-primary">{sequence.name}</div>
                        <div className="text-sm text-text-secondary">{sequence.targetSegment} leads</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sequence.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {sequence.isActive ? 'Active' : 'Paused'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">{analytics.sent || 0}</td>
                    <td className="py-3 px-4 text-right">{analytics.opened || 0}</td>
                    <td className="py-3 px-4 text-right">{analytics.clicked || 0}</td>
                    <td className="py-3 px-4 text-right">{analytics.replied || 0}</td>
                    <td className="py-3 px-4 text-right font-medium">{analytics.replyRate?.toFixed(1) || 0}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}