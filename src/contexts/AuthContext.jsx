import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('leadflow_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Simulate login
    const userData = {
      id: '1',
      email,
      name: email.split('@')[0],
      subscriptionPlan: 'pro',
      createdAt: new Date().toISOString()
    }
    setUser(userData)
    localStorage.setItem('leadflow_user', JSON.stringify(userData))
    return userData
  }

  const signup = async (email, password, name) => {
    // Simulate signup
    const userData = {
      id: Date.now().toString(),
      email,
      name,
      subscriptionPlan: 'free',
      createdAt: new Date().toISOString()
    }
    setUser(userData)
    localStorage.setItem('leadflow_user', JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('leadflow_user')
  }

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}