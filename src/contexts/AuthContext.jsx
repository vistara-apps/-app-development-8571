import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { userService } from '../lib/database'

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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (authUser) => {
    try {
      const profile = await userService.getUserById(authUser.id)
      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        subscriptionPlan: profile.subscription_plan,
        createdAt: profile.created_at
      })
    } catch (error) {
      console.error('Error loading user profile:', error)
      // If profile doesn't exist, create it
      try {
        const newProfile = await userService.createUser({
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.name || authUser.email.split('@')[0],
          subscriptionPlan: 'free'
        })
        setUser({
          id: newProfile.id,
          email: newProfile.email,
          name: newProfile.name,
          subscriptionPlan: newProfile.subscription_plan,
          createdAt: newProfile.created_at
        })
      } catch (createError) {
        console.error('Error creating user profile:', createError)
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data.user
  }

  const signup = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    })

    if (error) throw error
    return data.user
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
  }

  const updateProfile = async (updates) => {
    if (!user) throw new Error('No user logged in')
    
    const updatedProfile = await userService.updateUser(user.id, updates)
    setUser({
      ...user,
      ...updates
    })
    return updatedProfile
  }

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
