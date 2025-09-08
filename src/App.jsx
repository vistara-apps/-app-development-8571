import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppShell from './components/AppShell'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Sequences from './pages/Sequences'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-dark-bg text-dark-text-primary">
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/sequences" element={<Sequences />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AppShell>
      </div>
    </AppProvider>
  )
}

export default App