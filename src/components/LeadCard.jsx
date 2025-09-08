import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Mail, Building, Clock, TrendingUp } from 'lucide-react'
import { clsx } from 'clsx'

export default function LeadCard({ lead, variant = 'default', onClick }) {
  const getSegmentColor = (segment) => {
    switch (segment) {
      case 'Hot': return 'bg-red-100 text-red-800'
      case 'Warm': return 'bg-yellow-100 text-yellow-800'
      case 'Cold': return 'bg-blue-100 text-blue-800'
      case 'Nurture': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-gray-600'
  }

  if (variant === 'compact') {
    return (
      <div 
        className="card p-4 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {lead.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-text-primary">{lead.name}</h3>
              <p className="text-sm text-text-secondary">{lead.company}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', getSegmentColor(lead.segment))}>
              {lead.segment}
            </span>
            <span className={clsx('font-bold', getScoreColor(lead.score))}>
              {lead.score}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="card hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-lg">
              {lead.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{lead.name}</h3>
            <div className="flex items-center space-x-2 text-text-secondary">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{lead.email}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', getSegmentColor(lead.segment))}>
            {lead.segment}
          </span>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-text-secondary" />
            <span className={clsx('font-bold text-lg', getScoreColor(lead.score))}>
              {lead.score}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-text-secondary">
          <Building className="w-4 h-4" />
          <span className="text-sm">{lead.company}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-text-secondary">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            Last activity: {formatDistanceToNow(new Date(lead.lastActivity), { addSuffix: true })}
          </span>
        </div>
        
        {lead.activities && lead.activities.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-text-secondary mb-2">Recent Activity</p>
            <div className="space-y-1">
              {lead.activities.slice(0, 2).map((activity, index) => (
                <div key={index} className="text-xs text-text-secondary">
                  {activity.type.replace('_', ' ')} • {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}