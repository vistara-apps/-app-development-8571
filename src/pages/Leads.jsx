import React, { useState } from 'react'
import { useLeads } from '../contexts/LeadContext'
import { Plus, Filter, Search, Download, Upload } from 'lucide-react'
import LeadCard from '../components/LeadCard'
import { clsx } from 'clsx'

export default function Leads() {
  const { leads, addLead, addActivity } = useLeads()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSegment, setSelectedSegment] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    company: ''
  })

  const segments = ['All', 'Hot', 'Warm', 'Cold', 'Nurture']

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSegment = selectedSegment === 'All' || lead.segment === selectedSegment
    return matchesSearch && matchesSegment
  })

  const handleAddLead = (e) => {
    e.preventDefault()
    addLead(newLead)
    setNewLead({ name: '', email: '', company: '' })
    setShowAddModal(false)
  }

  const handleLeadClick = (lead) => {
    // Simulate adding an activity when clicking on a lead
    addActivity(lead.id, {
      type: 'profile_view',
      details: 'Lead profile viewed'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Leads</h1>
          <p className="text-text-secondary">Manage and track your lead pipeline</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
          <button className="btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            {segments.map(segment => (
              <button
                key={segment}
                onClick={() => setSelectedSegment(segment)}
                className={clsx(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  selectedSegment === segment
                    ? 'bg-accent text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                )}
              >
                {segment}
                {segment !== 'All' && (
                  <span className="ml-1 text-xs">
                    ({leads.filter(l => l.segment === segment).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {segments.slice(1).map(segment => {
          const count = leads.filter(l => l.segment === segment).length
          const percentage = leads.length ? (count / leads.length * 100).toFixed(1) : 0
          return (
            <div key={segment} className="card p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">{count}</div>
                <div className="text-sm text-text-secondary">{segment} Leads</div>
                <div className="text-xs text-text-secondary mt-1">{percentage}% of total</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map(lead => (
          <LeadCard 
            key={lead.id} 
            lead={lead} 
            onClick={() => handleLeadClick(lead)}
          />
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <div className="text-text-secondary">
            {searchTerm || selectedSegment !== 'All' 
              ? 'No leads match your current filters.'
              : 'No leads yet. Add your first lead to get started!'}
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <h2 className="text-xl font-bold text-text-primary mb-4">Add New Lead</h2>
            <form onSubmit={handleAddLead} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newLead.name}
                  onChange={(e) => setNewLead(prev => ({ ...prev, name: e.target.value }))}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={newLead.company}
                  onChange={(e) => setNewLead(prev => ({ ...prev, company: e.target.value }))}
                  className="input"
                  required
                />
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}