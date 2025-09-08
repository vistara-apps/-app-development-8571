import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { 
  Plus, 
  Play, 
  Pause, 
  Edit, 
  Trash, 
  Copy,
  MoreHorizontal,
  Mail,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react'
import SequenceBuilder from '../components/SequenceBuilder'

export default function Sequences() {
  const { sequences, dispatch } = useApp()
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
      dispatch({ type: 'UPDATE_SEQUENCE', payload: sequenceData })
    } else {
      dispatch({ type: 'ADD_SEQUENCE', payload: sequenceData })
    }
    setShowBuilder(false)
    setEditingSequence(null)
  }

  const handleDeleteSequence = (sequenceId) => {
    if (window.confirm('Are you sure you want to delete this sequence?')) {
      dispatch({ type: 'DELETE_SEQUENCE', payload: sequenceId })
    }
  }

  const handleToggleSequence = (sequenceId, isActive) => {
    dispatch({ 
      type: 'UPDATE_SEQUENCE', 
      payload: { sequenceId, isActive: !isActive } 
    })
  }

  const handleDuplicateSequence = (sequence) => {
    const duplicatedSequence = {
      ...sequence,
      sequenceId: `seq_${Date.now()}`,
      name: `${sequence.name} (Copy)`,
      isActive: false,
      stats: {
        sent: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        openRate: 0,
        clickRate: 0,
        replyRate: 0
      }
    }
    dispatch({ type: 'ADD_SEQUENCE', payload: duplicatedSequence })
  }

  if (showBuilder) {
    return (
      <SequenceBuilder
        sequence={editingSequence}
        onSave={handleSaveSequence}
        onCancel={() => {
          setShowBuilder(false)
          setEditingSequence(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-1 text-dark-text-primary">Sequences</h1>
          <p className="text-dark-text-secondary mt-2">
            Automate your outreach with email sequences
          </p>
        </div>
        <button
          onClick={handleCreateSequence}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Sequence</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-dark-surface border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-secondary">Total Sequences</p>
              <p className="text-2xl font-bold text-dark-text-primary mt-1">{sequences.length}</p>
            </div>
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="bg-dark-surface border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-secondary">Active Sequences</p>
              <p className="text-2xl font-bold text-dark-text-primary mt-1">
                {sequences.filter(seq => seq.isActive).length}
              </p>
            </div>
            <Play className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-dark-surface border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-secondary">Total Sent</p>
              <p className="text-2xl font-bold text-dark-text-primary mt-1">
                {sequences.reduce((sum, seq) => sum + (seq.stats?.sent || 0), 0)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent" />
          </div>
        </div>
        <div className="bg-dark-surface border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-secondary">Avg. Open Rate</p>
              <p className="text-2xl font-bold text-dark-text-primary mt-1">
                {Math.round(sequences.reduce((sum, seq) => sum + (seq.stats?.openRate || 0), 0) / sequences.length) || 0}%
              </p>
            </div>
            <Mail className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Sequences List */}
      {sequences.length === 0 ? (
        <div className="text-center py-12 bg-dark-surface border border-gray-800 rounded-lg">
          <Mail className="w-12 h-12 text-dark-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark-text-primary mb-2">No sequences yet</h3>
          <p className="text-dark-text-secondary mb-4">
            Create your first email sequence to start automating your outreach
          </p>
          <button
            onClick={handleCreateSequence}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            Create First Sequence
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sequences.map((sequence) => (
            <div key={sequence.sequenceId} className="bg-dark-surface border border-gray-800 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-dark-text-primary">{sequence.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sequence.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {sequence.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-dark-text-secondary mb-4">{sequence.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-dark-text-secondary mb-4">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{sequence.steps.length} steps</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>
                        Targets: {sequence.triggerConditions.segments.length > 0 
                          ? sequence.triggerConditions.segments.join(', ') 
                          : 'All segments'
                        }
                      </span>
                    </div>
                    {sequence.triggerConditions.minScore > 0 && (
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>Min score: {sequence.triggerConditions.minScore}</span>
                      </div>
                    )}
                  </div>

                  {/* Performance Stats */}
                  {sequence.stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-dark-bg rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-dark-text-primary">{sequence.stats.sent}</div>
                        <div className="text-xs text-dark-text-secondary">Sent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-accent">{sequence.stats.openRate}%</div>
                        <div className="text-xs text-dark-text-secondary">Open Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-primary">{sequence.stats.clickRate}%</div>
                        <div className="text-xs text-dark-text-secondary">Click Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-400">{sequence.stats.replyRate}%</div>
                        <div className="text-xs text-dark-text-secondary">Reply Rate</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleToggleSequence(sequence.sequenceId, sequence.isActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      sequence.isActive 
                        ? 'text-green-400 hover:bg-green-400/10' 
                        : 'text-dark-text-secondary hover:bg-dark-bg'
                    }`}
                    title={sequence.isActive ? 'Pause sequence' : 'Start sequence'}
                  >
                    {sequence.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => handleEditSequence(sequence)}
                    className="p-2 text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg rounded-lg transition-colors"
                    title="Edit sequence"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDuplicateSequence(sequence)}
                    className="p-2 text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg rounded-lg transition-colors"
                    title="Duplicate sequence"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteSequence(sequence.sequenceId)}
                    className="p-2 text-dark-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Delete sequence"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}