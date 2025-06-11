'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'
import toast from 'react-hot-toast'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  phone?: string
  country?: string
  role: 'user' | 'admin'
  created_at: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  updateProfile: (profileData: ProfileData) => Promise<boolean>
  isAdmin: boolean
  isAuthenticated: boolean
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  country?: string
}

interface ProfileData {
  firstName?: string
  lastName?: string
  phone?: string
  country?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await api.getCurrentUser()
      if (response.success && response.data) {
        setUser(response.data)
      } else {
        // Invalid token, remove it
        localStorage.removeItem('auth_token')
        api.setToken(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('auth_token')
      api.setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await api.login({ email, password })
      
      if (response.success && response.data) {
        setUser(response.data.user)
        toast.success('Login successful!')
        return true
      } else {
        toast.error(response.message || 'Login failed')
        return false
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await api.register(userData)
      
      if (response.success && response.data) {
        setUser(response.data.user)
        toast.success('Registration successful!')
        return true
      } else {
        toast.error(response.message || 'Registration failed')
        return false
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Registration failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    api.logout()
    toast.success('Logged out successfully')
  }

  const updateProfile = async (profileData: ProfileData): Promise<boolean> => {
    try {
      const response = await api.updateProfile(profileData)
      
      if (response.success) {
        // Refresh user data
        await checkAuthStatus()
        toast.success('Profile updated successfully!')
        return true
      } else {
        toast.error(response.message || 'Profile update failed')
        return false
      }
    } catch (error: any) {
      console.error('Profile update error:', error)
      toast.error(error.message || 'Profile update failed')
      return false
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}