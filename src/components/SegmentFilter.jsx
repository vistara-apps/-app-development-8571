import React, { useState } from 'react'
import { ChevronDown, Filter, X } from 'lucide-react'

const segments = [
  { value: 'all', label: 'All Leads', color: 'text-dark-text-primary' },
  { value: 'Hot', label: 'Hot', color: 'text-red-400' },
  { value: 'Warm', label: 'Warm', color: 'text-orange-400' },
  { value: 'Cold', label: 'Cold', color: 'text-blue-400' },
  { value: 'Nurture', label: 'Nurture', color: 'text-gray-400' }
]

export default function SegmentFilter({ selected, onSelect, variant = 'dropdown' }) {
  const [isOpen, setIsOpen] = useState(false)

  if (variant === 'tags') {
    return (
      <div className="flex flex-wrap gap-2">
        {segments.map((segment) => (
          <button
            key={segment.value}
            onClick={() => onSelect(segment.value)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selected === segment.value
                ? 'bg-accent text-white'
                : 'bg-dark-surface text-dark-text-secondary border border-gray-700 hover:border-gray-600'
            }`}
          >
            {segment.label}
          </button>
        ))}
      </div>
    )
  }

  const selectedSegment = segments.find(s => s.value === selected) || segments[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-dark-surface border border-gray-700 rounded-lg text-dark-text-primary hover:border-gray-600 transition-colors min-w-[140px]"
      >
        <Filter className="w-4 h-4" />
        <span className={selectedSegment.color}>{selectedSegment.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-full bg-dark-surface border border-gray-700 rounded-lg shadow-lg z-20">
            {segments.map((segment) => (
              <button
                key={segment.value}
                onClick={() => {
                  onSelect(segment.value)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2 text-left hover:bg-dark-bg transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  selected === segment.value ? 'bg-dark-bg' : ''
                }`}
              >
                <span className={segment.color}>{segment.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}