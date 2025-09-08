import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Bell, Search, ChevronDown } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-surface border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
            <input
              type="text"
              placeholder="Search leads, sequences..."
              className="pl-10 pr-4 py-2 border rounded-md bg-bg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent w-80"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-text-secondary hover:text-text-primary rounded-md hover:bg-gray-50">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2 cursor-pointer" onClick={logout}>
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <span className="text-text-primary font-medium">{user?.name}</span>
            <ChevronDown className="w-4 h-4 text-text-secondary" />
          </div>
        </div>
      </div>
    </header>
  )
}