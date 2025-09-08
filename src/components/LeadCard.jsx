import React from 'react'
import { 
  Mail, 
  Building, 
  MapPin, 
  Phone, 
  Calendar,
  TrendingUp,
  User
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const segmentColors = {
  Hot: 'bg-red-500 text-white',
  Warm: 'bg-orange-500 text-white', 
  Cold: 'bg-blue-500 text-white',
  Nurture: 'bg-gray-500 text-white'
}

const statusColors = {
  'New': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Contacted': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Qualified': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Proposal Sent': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'Follow-up': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'Not Interested': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

export default function LeadCard({ lead, variant = 'default', onClick }) {
  const isCompact = variant === 'compact'
  
  return (
    <div 
      className={`
        bg-dark-surface border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors cursor-pointer
        ${isCompact ? 'p-4' : 'p-6'}
      `}
      onClick={() => onClick && onClick(lead)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Avatar */}
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-dark-text-primary truncate">
                {lead.name}
              </h3>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${segmentColors[lead.segment]}`}>
                  {lead.segment}
                </span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-accent">{lead.score}</span>
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div className="space-y-1 mb-3">
              <div className="flex items-center space-x-2 text-sm text-dark-text-secondary">
                <Building className="w-4 h-4" />
                <span>{lead.company}</span>
                {lead.title && (
                  <>
                    <span>•</span>
                    <span>{lead.title}</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-dark-text-secondary">
                <Mail className="w-4 h-4" />
                <span>{lead.email}</span>
              </div>
              {!isCompact && lead.phone && (
                <div className="flex items-center space-x-2 text-sm text-dark-text-secondary">
                  <Phone className="w-4 h-4" />
                  <span>{lead.phone}</span>
                </div>
              )}
              {!isCompact && lead.location && (
                <div className="flex items-center space-x-2 text-sm text-dark-text-secondary">
                  <MapPin className="w-4 h-4" />
                  <span>{lead.location}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-dark-text-secondary">
                <Calendar className="w-3 h-3" />
                <span>
                  Last activity: {lead.lastActivity ? formatDistanceToNow(new Date(lead.lastActivity), { addSuffix: true }) : 'Never'}
                </span>
              </div>
              {lead.status && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                  {lead.status}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}