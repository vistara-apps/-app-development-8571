import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { 
  Plus, 
  Download, 
  Upload, 
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash,
  Mail,
  Phone,
  User
} from 'lucide-react'
import LeadCard from '../components/LeadCard'
import SegmentFilter from '../components/SegmentFilter'

export default function Leads() {
  const { leads, selectedLeadSegment, dispatch } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // grid or list

  // Filter and search leads
  const filteredLeads = useMemo(() => {
    let filtered = leads

    // Filter by segment
    if (selectedLeadSegment !== 'all') {
      filtered = filtered.filter(lead => lead.segment === selectedLeadSegment)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [leads, selectedLeadSegment, searchTerm])

  const handleAddLead = (leadData) => {
    const newLead = {
      leadId: `lead_${Date.now()}`,
      ...leadData,
      score: 0,
      segment: 'Cold',
      lastActivity: new Date().toISOString(),
      status: 'New'
    }
    dispatch({ type: 'ADD_LEAD', payload: newLead })
    setShowAddForm(false)
  }

  const handleUpdateLead = (leadId, updates) => {
    dispatch({ type: 'UPDATE_LEAD', payload: { leadId, ...updates } })
    setSelectedLead(null)
  }

  const handleDeleteLead = (leadId) => {
    dispatch({ type: 'DELETE_LEAD', payload: leadId })
  }

  const AddLeadForm = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-dark-surface border border-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Add New Lead</h3>
        <form onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target)
          handleAddLead({
            name: formData.get('name'),
            email: formData.get('email'),
            company: formData.get('company'),
            title: formData.get('title'),
            phone: formData.get('phone'),
            location: formData.get('location'),
            source: formData.get('source')
          })
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-text-primary mb-2">Name *</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-text-primary mb-2">Email *</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-text-primary mb-2">Company</label>
              <input
                type="text"
                name="company"
                className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-text-primary mb-2">Title</label>
              <input
                type="text"
                name="title"
                className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-text-primary mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-text-primary mb-2">Location</label>
              <input
                type="text"
                name="location"
                className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-text-primary mb-2">Source</label>
              <select
                name="source"
                className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Cold Email">Cold Email</option>
                <option value="Social Media">Social Media</option>
                <option value="Event">Event</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-dark-text-secondary hover:text-dark-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-1 text-dark-text-primary">Leads</h1>
          <p className="text-dark-text-secondary mt-2">
            Manage and score your prospects
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-dark-surface border border-gray-700 rounded-lg text-dark-text-primary hover:border-gray-600 transition-colors flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button className="px-4 py-2 bg-dark-surface border border-gray-700 rounded-lg text-dark-text-primary hover:border-gray-600 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-text-secondary" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-surface border border-gray-700 rounded-lg text-dark-text-primary placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>
        <SegmentFilter
          selected={selectedLeadSegment}
          onSelect={(segment) => dispatch({ type: 'SET_LEAD_SEGMENT', payload: segment })}
          variant="tags"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-dark-surface border border-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-dark-text-primary">{filteredLeads.length}</div>
          <div className="text-sm text-dark-text-secondary">Total Leads</div>
        </div>
        <div className="bg-dark-surface border border-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{filteredLeads.filter(l => l.segment === 'Hot').length}</div>
          <div className="text-sm text-dark-text-secondary">Hot Leads</div>
        </div>
        <div className="bg-dark-surface border border-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">{filteredLeads.filter(l => l.segment === 'Warm').length}</div>
          <div className="text-sm text-dark-text-secondary">Warm Leads</div>
        </div>
        <div className="bg-dark-surface border border-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-accent">{Math.round(filteredLeads.reduce((sum, lead) => sum + lead.score, 0) / filteredLeads.length) || 0}</div>
          <div className="text-sm text-dark-text-secondary">Avg Score</div>
        </div>
      </div>

      {/* Leads Grid */}
      {filteredLeads.length === 0 ? (
        <div className="text-center py-12 bg-dark-surface border border-gray-800 rounded-lg">
          <User className="w-12 h-12 text-dark-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark-text-primary mb-2">No leads found</h3>
          <p className="text-dark-text-secondary mb-4">
            {searchTerm || selectedLeadSegment !== 'all' 
              ? 'Try adjusting your filters or search terms'
              : 'Add your first lead to get started'
            }
          </p>
          {!searchTerm && selectedLeadSegment === 'all' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              Add First Lead
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <LeadCard 
              key={lead.leadId} 
              lead={lead} 
              onClick={(lead) => setSelectedLead(lead)}
            />
          ))}
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddForm && <AddLeadForm />}
    </div>
  )
}