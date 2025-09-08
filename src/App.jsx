import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { LeadProvider } from './contexts/LeadContext'
import { SequenceProvider } from './contexts/SequenceContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Sequences from './pages/Sequences'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <AuthProvider>
      <LeadProvider>
        <SequenceProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/app" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="leads" element={<Leads />} />
              <Route path="sequences" element={<Sequences />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </SequenceProvider>
      </LeadProvider>
    </AuthProvider>
  )
}

export default App