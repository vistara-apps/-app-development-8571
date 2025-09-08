import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { 
  TrendingUp, 
  TrendingDown,
  Eye,
  MousePointer,
  Reply,
  Send,
  Users,
  Target,
  Calendar,
  Download
} from 'lucide-react'
import ProgressChart from '../components/ProgressChart'
import { mockAnalytics } from '../data/mockData'

export default function Analytics() {
  const { leads, sequences } = useApp()
  const [timeRange, setTimeRange] = useState('7d')

  // Calculate real-time metrics from current data
  const totalLeads = leads.length
  const activeSequences = sequences.filter(seq => seq.isActive).length
  const totalSent = sequences.reduce((sum, seq) => sum + (seq.stats?.sent || 0), 0)
  const avgOpenRate = sequences.length > 0 
    ? Math.round(sequences.reduce((sum, seq) => sum + (seq.stats?.openRate || 0), 0) / sequences.length)
    : 0
  const avgClickRate = sequences.length > 0
    ? Math.round(sequences.reduce((sum, seq) => sum + (seq.stats?.clickRate || 0), 0) / sequences.length)
    : 0
  const avgReplyRate = sequences.length > 0
    ? Math.round(sequences.reduce((sum, seq) => sum + (seq.stats?.replyRate || 0), 0) / sequences.length)
    : 0

  const metrics = [
    {
      title: 'Total Sent',
      value: totalSent.toLocaleString(),
      change: '+12.5%',
      changeType: 'positive',
      icon: Send,
      color: 'text-blue-400'
    },
    {
      title: 'Open Rate',
      value: `${avgOpenRate}%`,
      change: '+5.2%',
      changeType: 'positive',
      icon: Eye,
      color: 'text-green-400'
    },
    {
      title: 'Click Rate',
      value: `${avgClickRate}%`,
      change: '+3.1%',
      changeType: 'positive',
      icon: MousePointer,
      color: 'text-orange-400'
    },
    {
      title: 'Reply Rate',
      value: `${avgReplyRate}%`,
      change: '+8.7%',
      changeType: 'positive',
      icon: Reply,
      color: 'text-purple-400'
    }
  ]

  const leadSegmentData = [
    { segment: 'Hot', count: leads.filter(l => l.segment === 'Hot').length, color: '#EF4444' },
    { segment: 'Warm', count: leads.filter(l => l.segment === 'Warm').length, color: '#F59E0B' },
    { segment: 'Cold', count: leads.filter(l => l.segment === 'Cold').length, color: '#3B82F6' },
    { segment: 'Nurture', count: leads.filter(l => l.segment === 'Nurture').length, color: '#6B7280' }
  ]

  const sequencePerformanceData = sequences.map(seq => ({
    name: seq.name,
    sent: seq.stats?.sent || 0,
    opened: seq.stats?.opened || 0,
    clicked: seq.stats?.clicked || 0,
    replied: seq.stats?.replied || 0,
    openRate: seq.stats?.openRate || 0,
    clickRate: seq.stats?.clickRate || 0,
    replyRate: seq.stats?.replyRate || 0
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-1 text-dark-text-primary">Analytics</h1>
          <p className="text-dark-text-secondary mt-2">
            Track your outreach performance and optimize your sequences
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-dark-surface border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="px-4 py-2 bg-dark-surface border border-gray-700 rounded-lg text-dark-text-primary hover:border-gray-600 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-dark-surface border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-text-secondary">{metric.title}</p>
                <p className="text-2xl font-bold text-dark-text-primary mt-1">{metric.value}</p>
                <div className={`flex items-center space-x-1 mt-2 ${
                  metric.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.changeType === 'positive' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">{metric.change}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center ${metric.color}`}>
                <metric.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Over Time */}
        <ProgressChart 
          data={mockAnalytics.sequencePerformance}
          variant="line"
          title="Sequence Performance Trend"
          height={350}
        />

        {/* Lead Distribution */}
        <div className="bg-dark-surface border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-6">Lead Distribution by Segment</h3>
          <div className="space-y-4">
            {leadSegmentData.map((segment) => {
              const percentage = totalLeads > 0 ? Math.round((segment.count / totalLeads) * 100) : 0
              return (
                <div key={segment.segment} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: segment.color }}
                      />
                      <span className="text-dark-text-primary">{segment.segment}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-dark-text-secondary">{segment.count}</span>
                      <span className="text-sm text-dark-text-secondary">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: segment.color
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sequence Performance Table */}
      <div className="bg-dark-surface border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-dark-text-primary mb-6">Sequence Performance Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-dark-text-primary font-medium">Sequence</th>
                <th className="text-right py-3 px-4 text-dark-text-primary font-medium">Sent</th>
                <th className="text-right py-3 px-4 text-dark-text-primary font-medium">Open Rate</th>
                <th className="text-right py-3 px-4 text-dark-text-primary font-medium">Click Rate</th>
                <th className="text-right py-3 px-4 text-dark-text-primary font-medium">Reply Rate</th>
                <th className="text-right py-3 px-4 text-dark-text-primary font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {sequencePerformanceData.map((sequence, index) => (
                <tr key={index} className="border-b border-gray-800 last:border-b-0">
                  <td className="py-3 px-4 text-dark-text-primary">{sequence.name}</td>
                  <td className="py-3 px-4 text-right text-dark-text-secondary">{sequence.sent}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`${
                      sequence.openRate >= 70 ? 'text-green-400' :
                      sequence.openRate >= 50 ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {sequence.openRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`${
                      sequence.clickRate >= 30 ? 'text-green-400' :
                      sequence.clickRate >= 20 ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {sequence.clickRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`${
                      sequence.replyRate >= 15 ? 'text-green-400' :
                      sequence.replyRate >= 10 ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {sequence.replyRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sequences.find(s => s.name === sequence.name)?.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {sequences.find(s => s.name === sequence.name)?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-dark-surface border border-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-dark-text-primary">Best Performing Segment</h3>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-blue-400">Hot Leads</div>
            <div className="text-sm text-dark-text-secondary">
              {((leads.filter(l => l.segment === 'Hot').length / totalLeads) * 100).toFixed(1)}% of total leads
            </div>
            <div className="text-sm text-dark-text-secondary">
              Highest conversion potential
            </div>
          </div>
        </div>

        <div className="bg-dark-surface border border-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-dark-text-primary">Growth Trend</h3>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-400">+24%</div>
            <div className="text-sm text-dark-text-secondary">
              Lead growth this month
            </div>
            <div className="text-sm text-dark-text-secondary">
              Above industry average
            </div>
          </div>
        </div>

        <div className="bg-dark-surface border border-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-dark-text-primary">Next Action</h3>
          </div>
          <div className="space-y-2">
            <div className="text-lg font-bold text-dark-text-primary">Review Cold Leads</div>
            <div className="text-sm text-dark-text-secondary">
              {leads.filter(l => l.segment === 'Cold').length} leads need attention
            </div>
            <div className="text-sm text-dark-text-secondary">
              Consider re-engagement campaign
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}