import React from 'react'
import { useApp } from '../context/AppContext'
import { 
  Users, 
  Send, 
  TrendingUp, 
  Mail,
  Eye,
  MousePointer,
  Reply,
  Plus,
  ArrowUpRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import ProgressChart from '../components/ProgressChart'
import LeadCard from '../components/LeadCard'
import SequenceBuilder from '../components/SequenceBuilder'
import { mockAnalytics } from '../data/mockData'

export default function Dashboard() {
  const { leads, sequences } = useApp()

  // Calculate dashboard metrics
  const totalLeads = leads.length
  const activeSequences = sequences.filter(seq => seq.isActive).length
  const hotLeads = leads.filter(lead => lead.segment === 'Hot').length
  const recentLeads = leads.slice(0, 3)
  const topSequences = sequences.slice(0, 2)

  const metrics = [
    {
      title: 'Total Leads',
      value: totalLeads,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'Active Sequences',
      value: activeSequences,
      change: '+2',
      changeType: 'positive', 
      icon: Send,
      color: 'text-green-400'
    },
    {
      title: 'Hot Leads',
      value: hotLeads,
      change: '+24%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-red-400'
    },
    {
      title: 'Avg. Open Rate',
      value: '68.5%',
      change: '+5.2%',
      changeType: 'positive',
      icon: Eye,
      color: 'text-accent'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="heading-1 text-dark-text-primary">Dashboard</h1>
        <p className="text-dark-text-secondary mt-2">
          Welcome back! Here's what's happening with your leads and sequences.
        </p>
      </div>

      {/* Metrics Grid */}
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
                  <ArrowUpRight className="w-4 h-4" />
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
        {/* Performance Chart */}
        <ProgressChart 
          data={mockAnalytics.sequencePerformance}
          variant="line"
          title="Sequence Performance (Last 7 Days)"
          height={300}
        />

        {/* Lead Distribution */}
        <div className="bg-dark-surface border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Lead Distribution</h3>
          <div className="space-y-4">
            {mockAnalytics.leadsBySegment.map((segment) => (
              <div key={segment.segment} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    segment.segment === 'Hot' ? 'bg-red-400' :
                    segment.segment === 'Warm' ? 'bg-orange-400' :
                    segment.segment === 'Cold' ? 'bg-blue-400' : 'bg-gray-400'
                  }`} />
                  <span className="text-dark-text-primary">{segment.segment}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-dark-text-secondary">{segment.count}</span>
                  <span className="text-sm text-dark-text-secondary">({segment.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-dark-surface border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark-text-primary">Recent Leads</h3>
            <Link 
              to="/leads"
              className="text-accent hover:text-accent/80 text-sm font-medium flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <LeadCard key={lead.leadId} lead={lead} variant="compact" />
            ))}
          </div>
        </div>

        {/* Top Sequences */}
        <div className="bg-dark-surface border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark-text-primary">Top Performing Sequences</h3>
            <Link 
              to="/sequences"
              className="text-accent hover:text-accent/80 text-sm font-medium flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {topSequences.map((sequence) => (
              <SequenceBuilder key={sequence.sequenceId} sequence={sequence} variant="preview" />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-dark-surface border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/leads?action=add"
            className="flex items-center space-x-3 p-4 bg-dark-bg rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-dark-text-primary">Add Lead</p>
              <p className="text-xs text-dark-text-secondary">Import new prospects</p>
            </div>
          </Link>

          <Link
            to="/sequences?action=create"
            className="flex items-center space-x-3 p-4 bg-dark-bg rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-dark-text-primary">Create Sequence</p>
              <p className="text-xs text-dark-text-secondary">Build email automation</p>
            </div>
          </Link>

          <Link
            to="/analytics"
            className="flex items-center space-x-3 p-4 bg-dark-bg rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-dark-text-primary">View Analytics</p>
              <p className="text-xs text-dark-text-secondary">Track performance</p>
            </div>
          </Link>

          <Link
            to="/leads?segment=Hot"
            className="flex items-center space-x-3 p-4 bg-dark-bg rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-dark-text-primary">Hot Leads</p>
              <p className="text-xs text-dark-text-secondary">Review top prospects</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}