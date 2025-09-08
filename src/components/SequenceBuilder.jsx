import React, { useState } from 'react'
import { 
  Plus,
  Mail,
  Clock,
  X,
  Save,
  Play,
  Pause,
  Settings,
  ChevronDown
} from 'lucide-react'

export default function SequenceBuilder({ sequence, variant = 'editor', onSave, onCancel }) {
  const [editingSequence, setEditingSequence] = useState(sequence || {
    name: '',
    description: '',
    steps: [],
    triggerConditions: {
      segments: [],
      minScore: 0
    },
    isActive: false
  })

  const [showSettings, setShowSettings] = useState(false)

  const addStep = () => {
    const newStep = {
      stepId: `step_${Date.now()}`,
      order: editingSequence.steps.length + 1,
      type: 'email',
      subject: '',
      content: '',
      delay: 1
    }
    setEditingSequence({
      ...editingSequence,
      steps: [...editingSequence.steps, newStep]
    })
  }

  const updateStep = (stepId, updates) => {
    setEditingSequence({
      ...editingSequence,
      steps: editingSequence.steps.map(step =>
        step.stepId === stepId ? { ...step, ...updates } : step
      )
    })
  }

  const removeStep = (stepId) => {
    setEditingSequence({
      ...editingSequence,
      steps: editingSequence.steps.filter(step => step.stepId !== stepId)
    })
  }

  const handleSave = () => {
    const sequenceToSave = {
      ...editingSequence,
      sequenceId: editingSequence.sequenceId || `seq_${Date.now()}`,
      userId: 'user_1'
    }
    onSave && onSave(sequenceToSave)
  }

  if (variant === 'preview') {
    return (
      <div className="bg-dark-surface border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-dark-text-primary">{sequence.name}</h3>
            <p className="text-sm text-dark-text-secondary">{sequence.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              sequence.isActive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            }`}>
              {sequence.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {sequence.steps.map((step, index) => (
            <div key={step.stepId} className="flex items-start space-x-3 p-3 bg-dark-bg rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">{index + 1}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Mail className="w-4 h-4 text-dark-text-secondary" />
                  <span className="text-sm font-medium text-dark-text-primary">{step.subject}</span>
                  {step.delay > 0 && (
                    <div className="flex items-center space-x-1 text-xs text-dark-text-secondary">
                      <Clock className="w-3 h-3" />
                      <span>Wait {step.delay} day{step.delay !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-dark-text-secondary line-clamp-2">{step.content}</p>
              </div>
            </div>
          ))}
        </div>

        {sequence.stats && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-dark-text-primary">{sequence.stats.sent}</div>
                <div className="text-xs text-dark-text-secondary">Sent</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-accent">{sequence.stats.openRate}%</div>
                <div className="text-xs text-dark-text-secondary">Open Rate</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-primary">{sequence.stats.clickRate}%</div>
                <div className="text-xs text-dark-text-secondary">Click Rate</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-400">{sequence.stats.replyRate}%</div>
                <div className="text-xs text-dark-text-secondary">Reply Rate</div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-dark-text-primary">
            {sequence ? 'Edit Sequence' : 'Create New Sequence'}
          </h2>
          <p className="text-dark-text-secondary">Build automated email sequences to nurture your leads</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-dark-surface border border-gray-700 rounded-lg text-dark-text-primary hover:border-gray-600 transition-colors flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-dark-text-secondary hover:text-dark-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Sequence</span>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-dark-surface border border-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Sequence Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Sequence Name
              </label>
              <input
                type="text"
                value={editingSequence.name}
                onChange={(e) => setEditingSequence({ ...editingSequence, name: e.target.value })}
                className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Enter sequence name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Target Segments
              </label>
              <div className="flex flex-wrap gap-2">
                {['Hot', 'Warm', 'Cold', 'Nurture'].map((segment) => (
                  <button
                    key={segment}
                    onClick={() => {
                      const segments = editingSequence.triggerConditions.segments.includes(segment)
                        ? editingSequence.triggerConditions.segments.filter(s => s !== segment)
                        : [...editingSequence.triggerConditions.segments, segment]
                      
                      setEditingSequence({
                        ...editingSequence,
                        triggerConditions: { ...editingSequence.triggerConditions, segments }
                      })
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      editingSequence.triggerConditions.segments.includes(segment)
                        ? 'bg-accent text-white'
                        : 'bg-dark-bg text-dark-text-secondary border border-gray-700'
                    }`}
                  >
                    {segment}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Description
              </label>
              <textarea
                value={editingSequence.description}
                onChange={(e) => setEditingSequence({ ...editingSequence, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Describe the purpose of this sequence"
              />
            </div>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dark-text-primary">Sequence Steps</h3>
          <button
            onClick={addStep}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Step</span>
          </button>
        </div>

        {editingSequence.steps.length === 0 ? (
          <div className="text-center py-12 bg-dark-surface border border-gray-800 rounded-lg">
            <Mail className="w-12 h-12 text-dark-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-dark-text-primary mb-2">No steps yet</h3>
            <p className="text-dark-text-secondary mb-4">Add your first email step to get started</p>
            <button
              onClick={addStep}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              Add First Step
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {editingSequence.steps.map((step, index) => (
              <div key={step.stepId} className="bg-dark-surface border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">{index + 1}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-dark-text-primary">
                      Email Step {index + 1}
                    </h4>
                  </div>
                  <button
                    onClick={() => removeStep(step.stepId)}
                    className="p-2 text-dark-text-secondary hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-dark-text-primary mb-2">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        value={step.subject}
                        onChange={(e) => updateStep(step.stepId, { subject: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="Enter email subject"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-text-primary mb-2">
                        Delay (days)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={step.delay}
                        onChange={(e) => updateStep(step.stepId, { delay: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text-primary mb-2">
                      Email Content
                    </label>
                    <textarea
                      value={step.content}
                      onChange={(e) => updateStep(step.stepId, { content: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="Write your email content here. Use {{name}}, {{company}}, etc. for personalization."
                    />
                    <p className="text-xs text-dark-text-secondary mt-2">
                      Tip: Use variables like {'{{'} name {'}}'}, {'{{'} company {'}}'} for personalization
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}