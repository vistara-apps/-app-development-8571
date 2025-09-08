import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Save, User, Mail, Building, CreditCard, Bell, Shield } from 'lucide-react'

export default function Settings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: '',
    timezone: 'UTC-5',
    notifications: {
      email: true,
      push: false,
      weekly: true
    }
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
  ]

  const handleSave = (e) => {
    e.preventDefault()
    // Here you would save the settings
    console.log('Saving settings:', formData)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary">Manage your account preferences and configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
                }`}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-6">Profile Information</h2>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="input"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="input"
                      placeholder="Your company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Timezone
                    </label>
                    <select
                      value={formData.timezone}
                      onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                      className="input"
                    >
                      <option value="UTC-8">Pacific Time (UTC-8)</option>
                      <option value="UTC-7">Mountain Time (UTC-7)</option>
                      <option value="UTC-6">Central Time (UTC-6)</option>
                      <option value="UTC-5">Eastern Time (UTC-5)</option>
                      <option value="UTC+0">UTC</option>
                    </select>
                  </div>
                  
                  <button type="submit" className="btn-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'billing' && (
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-6">Billing & Subscription</h2>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-text-primary">Current Plan</h3>
                      <p className="text-text-secondary">Pro Plan - $49/month</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent">$49</div>
                      <div className="text-sm text-text-secondary">per month</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="btn-primary">Upgrade Plan</button>
                    <button className="btn-secondary">Cancel Subscription</button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-text-primary mb-4">Payment Method</h3>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        VISA
                      </div>
                      <div>
                        <div className="font-medium">•••• •••• •••• 4242</div>
                        <div className="text-sm text-text-secondary">Expires 12/25</div>
                      </div>
                    </div>
                  </div>
                  <button className="btn-secondary mt-4">Update Payment Method</button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-text-primary">Email Notifications</h3>
                      <p className="text-sm text-text-secondary">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.notifications.email}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: e.target.checked }
                      }))}
                      className="w-4 h-4 text-accent rounded focus:ring-accent"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-text-primary">Push Notifications</h3>
                      <p className="text-sm text-text-secondary">Receive push notifications in browser</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.notifications.push}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, push: e.target.checked }
                      }))}
                      className="w-4 h-4 text-accent rounded focus:ring-accent"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-text-primary">Weekly Reports</h3>
                      <p className="text-sm text-text-secondary">Get weekly performance summaries</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.notifications.weekly}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, weekly: e.target.checked }
                      }))}
                      className="w-4 h-4 text-accent rounded focus:ring-accent"
                    />
                  </div>
                </div>
                
                <button onClick={handleSave} className="btn-primary mt-6">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </button>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-text-primary mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Current Password
                        </label>
                        <input type="password" className="input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          New Password
                        </label>
                        <input type="password" className="input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Confirm New Password
                        </label>
                        <input type="password" className="input" />
                      </div>
                      <button className="btn-primary">Update Password</button>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <h3 className="font-medium text-text-primary mb-4">Two-Factor Authentication</h3>
                    <p className="text-text-secondary mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <button className="btn-secondary">Enable 2FA</button>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <h3 className="font-medium text-text-primary mb-4 text-red-600">Danger Zone</h3>
                    <p className="text-text-secondary mb-4">
                      This action cannot be undone. This will permanently delete your account.
                    </p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}