import React, { useState } from 'react'
import { Plus, Mail, Clock, Trash2, Edit } from 'lucide-react'
import { clsx } from 'clsx'

export default function SequenceBuilder({ sequence, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: sequence?.name || '',
    targetSegment: sequence?.targetSegment || 'Hot',
    isActive: sequence?.isActive ?? true,
    steps: sequence?.steps || [
      {
        id: Date.now().toString(),
        order: 1,
        type: 'email',
        subject: '',
        content: '',
        delay: 0
      }
    ]
  })

  const addStep = () => {
    const newStep = {
      id: Date.now().toString(),
      order: formData.steps.length + 1,
      type: 'email',
      subject: '',
      content: '',
      delay: 1
    }
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }))
  }

  const updateStep = (stepId, updates) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      )
    }))
  }

  const removeStep = (stepId) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            {sequence ? 'Edit Sequence' : 'Create New Sequence'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Sequence Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="input"
                placeholder="Welcome Series"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Target Segment
              </label>
              <select
                value={formData.targetSegment}
                onChange={(e) => setFormData(prev => ({ ...prev, targetSegment: e.target.value }))}
                className="input"
              >
                <option value="Hot">Hot Leads</option>
                <option value="Warm">Warm Leads</option>
                <option value="Cold">Cold Leads</option>
                <option value="Nurture">Nurture Leads</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-accent rounded focus:ring-accent"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-text-primary">
              Activate sequence immediately
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">Sequence Steps</h3>
            <button
              type="button"
              onClick={addStep}
              className="btn-primary text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Step
            </button>
          </div>
          
          {formData.steps.map((step, index) => (
            <div key={step.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">{step.order}</span>
                  </div>
                  <Mail className="w-5 h-5 text-text-secondary" />
                  <span className="font-medium text-text-primary">Email Step</span>
                </div>
                
                {formData.steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(step.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {index > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Delay (days after previous step)
                    </label>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-text-secondary" />
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={step.delay}
                        onChange={(e) => updateStep(step.id, { delay: parseInt(e.target.value) })}
                        className="input w-20"
                      />
                      <span className="text-sm text-text-secondary">days</span>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    value={step.subject}
                    onChange={(e) => updateStep(step.id, { subject: e.target.value })}
                    className="input"
                    placeholder="Welcome to LeadFlow AI!"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email Content
                  </label>
                  <textarea
                    value={step.content}
                    onChange={(e) => updateStep(step.id, { content: e.target.value })}
                    className="input h-32 resize-none"
                    placeholder="Hi {{name}}, welcome to our platform..."
                    required
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Use {'{{name}}'} and {'{{company}}'} for personalization
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {sequence ? 'Update Sequence' : 'Create Sequence'}
          </button>
        </div>
      </form>
    </div>
  )
}