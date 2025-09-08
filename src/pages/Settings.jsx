import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { 
  User, 
  Bell, 
  CreditCard, 
  Shield, 
  Mail,
  Zap,
  Database,
  Download,
  Upload,
  Trash,
  Save,
  Check
} from 'lucide-react'

export default function Settings() {
  const { user } = useApp()
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'data', label: 'Data & Privacy', icon: Database },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  const ProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-dark-text-primary mb-2">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-text-primary mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue={user.email}
              className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-text-primary mb-2">
              Company
            </label>
            <input
              type="text"
              defaultValue="Acme Corp"
              className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-text-primary mb-2">
              Role
            </label>
            <input
              type="text"
              defaultValue="Sales Manager"
              className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Avatar</h3>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xl font-medium text-white">JD</span>
          </div>
          <button className="px-4 py-2 bg-dark-surface border border-gray-700 rounded-lg text-dark-text-primary hover:border-gray-600 transition-colors">
            Change Avatar
          </button>
        </div>
      </div>
    </div>
  )

  const NotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {[
            { id: 'sequence_complete', label: 'Sequence completions', description: 'When a lead completes a sequence' },
            { id: 'new_replies', label: 'New replies', description: 'When leads reply to your emails' },
            { id: 'hot_leads', label: 'Hot lead alerts', description: 'When leads reach hot status' },
            { id: 'weekly_reports', label: 'Weekly reports', description: 'Summary of your outreach performance' }
          ].map((notification) => (
            <div key={notification.id} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
              <div>
                <div className="text-dark-text-primary font-medium">{notification.label}</div>
                <div className="text-sm text-dark-text-secondary">{notification.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const BillingTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Current Plan</h3>
        <div className="bg-dark-bg border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xl font-bold text-dark-text-primary">Pro Plan</div>
              <div className="text-dark-text-secondary">$49/month</div>
            </div>
            <span className="px-3 py-1 bg-accent text-white rounded-full text-sm font-medium">
              Current
            </span>
          </div>
          <div className="text-sm text-dark-text-secondary mb-4">
            Next billing date: January 15, 2024
          </div>
          <button className="px-4 py-2 bg-dark-surface border border-gray-700 rounded-lg text-dark-text-primary hover:border-gray-600 transition-colors">
            Manage Subscription
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Usage This Month</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dark-bg border border-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-dark-text-primary">156</div>
            <div className="text-sm text-dark-text-secondary">Leads (of 500)</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div className="bg-accent h-2 rounded-full" style={{ width: '31.2%' }}></div>
            </div>
          </div>
          <div className="bg-dark-bg border border-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-dark-text-primary">8</div>
            <div className="text-sm text-dark-text-secondary">Active Sequences (of 20)</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>
          <div className="bg-dark-bg border border-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-dark-text-primary">1,247</div>
            <div className="text-sm text-dark-text-secondary">Emails Sent (of 10,000)</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div className="bg-green-400 h-2 rounded-full" style={{ width: '12.47%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const IntegrationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Available Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'HubSpot', status: 'connected', description: 'Sync leads and activities' },
            { name: 'Salesforce', status: 'available', description: 'Import contacts and opportunities' },
            { name: 'Pipedrive', status: 'available', description: 'Two-way contact synchronization' },
            { name: 'Gmail', status: 'connected', description: 'Send emails through Gmail' },
            { name: 'Outlook', status: 'available', description: 'Microsoft email integration' },
            { name: 'Zapier', status: 'available', description: 'Connect with 5000+ apps' }
          ].map((integration) => (
            <div key={integration.name} className="bg-dark-bg border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-dark-text-primary font-medium">{integration.name}</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  integration.status === 'connected' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  {integration.status === 'connected' ? 'Connected' : 'Available'}
                </span>
              </div>
              <div className="text-sm text-dark-text-secondary mb-3">{integration.description}</div>
              <button className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                integration.status === 'connected'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'
                  : 'bg-accent text-white hover:bg-accent/90'
              }`}>
                {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const DataTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Data Export</h3>
        <div className="bg-dark-bg border border-gray-800 rounded-lg p-4">
          <div className="text-dark-text-primary font-medium mb-2">Export Your Data</div>
          <div className="text-sm text-dark-text-secondary mb-4">
            Download all your leads, sequences, and analytics data in CSV format.
          </div>
          <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Data Import</h3>
        <div className="bg-dark-bg border border-gray-800 rounded-lg p-4">
          <div className="text-dark-text-primary font-medium mb-2">Import Leads</div>
          <div className="text-sm text-dark-text-secondary mb-4">
            Upload a CSV file to import leads in bulk.
          </div>
          <button className="px-4 py-2 bg-dark-surface border border-gray-700 rounded-lg text-dark-text-primary hover:border-gray-600 transition-colors flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Data Deletion</h3>
        <div className="bg-dark-bg border border-red-800 rounded-lg p-4">
          <div className="text-red-400 font-medium mb-2">Delete All Data</div>
          <div className="text-sm text-dark-text-secondary mb-4">
            Permanently delete all your data. This action cannot be undone.
          </div>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
            <Trash className="w-4 h-4" />
            <span>Delete All Data</span>
          </button>
        </div>
      </div>
    </div>
  )

  const SecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-text-primary mb-2">
              Current Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-text-primary mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-text-primary mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
            Update Password
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Two-Factor Authentication</h3>
        <div className="bg-dark-bg border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-dark-text-primary font-medium">Two-Factor Authentication</div>
              <div className="text-sm text-dark-text-secondary">Add an extra layer of security to your account</div>
            </div>
            <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
              Enable
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Login Sessions</h3>
        <div className="space-y-2">
          {[
            { device: 'MacBook Pro', location: 'San Francisco, CA', current: true },
            { device: 'iPhone 13', location: 'San Francisco, CA', current: false },
            { device: 'Chrome on Windows', location: 'New York, NY', current: false }
          ].map((session, index) => (
            <div key={index} className="bg-dark-bg border border-gray-800 rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-dark-text-primary font-medium">{session.device}</div>
                <div className="text-sm text-dark-text-secondary">{session.location}</div>
              </div>
              <div className="flex items-center space-x-3">
                {session.current && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                    Current
                  </span>
                )}
                {!session.current && (
                  <button className="text-red-400 hover:text-red-300 text-sm">
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />
      case 'notifications': return <NotificationsTab />
      case 'billing': return <BillingTab />
      case 'integrations': return <IntegrationsTab />
      case 'data': return <DataTab />
      case 'security': return <SecurityTab />
      default: return <ProfileTab />
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-1 text-dark-text-primary">Settings</h1>
        <p className="text-dark-text-secondary mt-2">
          Manage your account preferences and integrations
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent text-white'
                    : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-dark-surface border border-gray-800 rounded-lg p-6">
            {renderTabContent()}
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                saved 
                  ? 'bg-green-600 text-white'
                  : 'bg-accent text-white hover:bg-accent/90'
              }`}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}