import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Workflow, 
  BarChart3, 
  Settings,
  Zap
} from 'lucide-react'
import { clsx } from 'clsx'

const navigation = [
  { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { name: 'Leads', href: '/app/leads', icon: Users },
  { name: 'Sequences', href: '/app/sequences', icon: Workflow },
  { name: 'Analytics', href: '/app/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/app/settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <div className="w-64 bg-surface border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-text-primary">LeadFlow AI</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}