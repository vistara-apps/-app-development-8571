import React, { useState } from 'react'
import { useSequences } from '../contexts/SequenceContext'
import { Plus, Play, Pause, Edit, Trash2, Mail, Clock, Users } from 'lucide-react'
import SequenceBuilder from '../components/SequenceBuilder'
import { clsx } from 'clsx'
import { formatDistanceToNow } from 'date-fns'

export default function Sequences() {
  const { sequences, createSequence, updateSequence, deleteSequence, toggleSequence, getSequenceAnalytics } = useSequences()
  const [showBuilder, setShowBuilder] = useState(false)
  const [editingSequence, setEditingSequence] = useState(null)

  const handleCreateSequence = () => {
    setEditingSequence(null)
    setShowBuilder(true)
  }

  const handleEditSequence = (sequence) => {
    setEditingSequence(sequence)
    setShowBuilder(true)
  }

  const handleSaveSequence = (sequenceData) => {
    if (editingSequence) {
      updateSequence(editingSequence.id, sequenceData)
    } else {
      createSequence(sequenceData)
    }
    setShowBuilder(false)
    setEditingSequence(null)
  }

  const handleCancelBuilder = () => {
    setShowBuilder(false)
    setEditingSequence(null)
  }

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const getSegmentColor = (segment) => {
    switch (segment) {
      case 'Hot': return 'bg-red-100 text-red-800'
      case 'Warm': return 'bg-yellow-100 text-yellow-800'
      case 'Cold': return 'bg-blue-100 text-blue-800'
      case 'Nurture': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (showBuilder) {
    return (
      <SequenceBuilder
        sequence={editingSequence}
        onSave={handleSaveSequence}
        onCancel={handleCancelBuilder}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Sequences</h1>
          <p className="text-text-secondary">Automate your outreach with smart email sequences</p>
        </div>
        <button onClick={handleCreateSequence} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Sequence
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Total Sequences</p>
              <p className="text-2xl font-bold text-text-primary">{sequences.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Active Sequences</p>
              <p className="text-2xl font-bold text-text-primary">
                {sequences.filter(s => s.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Avg Response Rate</p>
              <p className="text-2xl font-bold text-text-primary">
                {sequences.length ? 
                  (Object.values(sequences.reduce((acc, seq) => {
                    const analytics = getSequenceAnalytics(seq.id)
                    acc.totalReplyRate = (acc.totalReplyRate || 0) + analytics.replyRate
                    acc.count = (acc.count || 0) + 1
                    return acc
                  }, {})).length ? 
                    (Object.values(sequences.reduce((acc, seq) => {
                      const analytics = getSequenceAnalytics(seq.id)
                      acc.totalReplyRate = (acc.totalReplyRate || 0) + analytics.replyRate
                      acc.count = (acc.count || 0) + 1
                      return acc
                    }, {})).reduce((a, b) => a + b, 0) / sequences.length).toFixed(1) 
                    : '0') 
                  : '0'}%
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Sequences List */}
      <div className="space-y-4">
        {sequences.map(sequence => {
          const analytics = getSequenceAnalytics(sequence.id)
          return (
            <div key={sequence.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-text-primary">{sequence.name}</h3>
                    <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(sequence.isActive))}>
                      {sequence.isActive ? 'Active' : 'Paused'}
                    </span>
                    <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', getSegmentColor(sequence.targetSegment))}>
                      {sequence.targetSegment} Leads
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-text-secondary mb-3">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{sequence.steps.length} steps</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Created {formatDistanceToNow(new Date(sequence.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-text-primary">{analytics.sent || 0}</div>
                      <div className="text-xs text-text-secondary">Sent</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-text-primary">{analytics.openRate?.toFixed(1) || 0}%</div>
                      <div className="text-xs text-text-secondary">Open Rate</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-text-primary">{analytics.clickRate?.toFixed(1) || 0}%</div>
                      <div className="text-xs text-text-secondary">Click Rate</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-text-primary">{analytics.replyRate?.toFixed(1) || 0}%</div>
                      <div className="text-xs text-text-secondary">Reply Rate</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleSequence(sequence.id)}
                    className={clsx(
                      'p-2 rounded-md transition-colors',
                      sequence.isActive
                        ? 'text-orange-600 hover:bg-orange-50'
                        : 'text-green-600 hover:bg-green-50'
                    )}
                    title={sequence.isActive ? 'Pause sequence' : 'Start sequence'}
                  >
                    {sequence.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEditSequence(sequence)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                    title="Edit sequence"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteSequence(sequence.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete sequence"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {sequences.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-text-secondary" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">No sequences yet</h3>
          <p className="text-text-secondary mb-4">
            Create your first email sequence to start automating your outreach.
          </p>
          <button onClick={handleCreateSequence} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Sequence
          </button>
        </div>
      )}
    </div>
  )
}