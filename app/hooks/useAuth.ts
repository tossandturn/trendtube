'use client'

import { useState, useEffect, useCallback } from 'react'

interface User {
  id: number
  username: string
  email: string
}

interface AuthState {
  user: User | null
  sessionId: string
  analyzeCount: number
  isLoading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    sessionId: '',
    analyzeCount: 0,
    isLoading: true
  })

  // Generate or retrieve session ID
  const getSessionId = useCallback((): string => {
    let sessionId = localStorage.getItem('analyzeSessionId')
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
      localStorage.setItem('analyzeSessionId', sessionId)
    }
    return sessionId
  }, [])

  // Load user from localStorage on mount
  useEffect(() => {
    const loadAuth = () => {
      const userJson = localStorage.getItem('user')
      const sessionId = getSessionId()
      let user: User | null = null

      if (userJson) {
        try {
          user = JSON.parse(userJson)
        } catch {
          localStorage.removeItem('user')
        }
      }

      setAuthState({
        user,
        sessionId,
        analyzeCount: 0,
        isLoading: false
      })

      // Fetch analyze count if logged in
      if (user) {
        fetchAnalyzeCount(sessionId, user.id)
      }
    }

    loadAuth()
  }, [getSessionId])

  const fetchAnalyzeCount = async (sessionId: string, userId?: number) => {
    try {
      const params = new URLSearchParams({ sessionId })
      if (userId) params.append('userId', userId.toString())

      const res = await fetch(`/api/analyze/track?${params}`)
      const data = await res.json()

      if (res.ok) {
        setAuthState(prev => ({ ...prev, analyzeCount: data.totalAttempts }))
      }
    } catch {
      // Silently fail
    }
  }

  const recordAnalyze = async (): Promise<{ success: boolean; requiresLogin: boolean }> => {
    const { sessionId, user } = authState

    try {
      const res = await fetch('/api/analyze/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, userId: user?.id })
      })

      const data = await res.json()

      if (res.ok) {
        setAuthState(prev => ({ ...prev, analyzeCount: data.totalAttempts }))
        return {
          success: true,
          requiresLogin: data.requiresLogin
        }
      }
    } catch {
      // Silently fail, allow the analyze
    }

    return { success: false, requiresLogin: false }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user))
        setAuthState(prev => ({
          ...prev,
          user: data.user,
          analyzeCount: 0 // Reset count on login
        }))
        return { success: true }
      }

      return { success: false, error: data.error || 'Login failed' }
    } catch {
      return { success: false, error: 'Network error' }
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    setAuthState(prev => ({
      ...prev,
      user: null,
      analyzeCount: 0
    }))
  }

  const getRemainingAnalyzes = () => {
    return Math.max(0, 10 - authState.analyzeCount)
  }

  const canAnalyze = () => {
    return authState.analyzeCount < 10 || !!authState.user
  }

  return {
    user: authState.user,
    sessionId: authState.sessionId,
    analyzeCount: authState.analyzeCount,
    isLoading: authState.isLoading,
    isLoggedIn: !!authState.user,
    canAnalyze: canAnalyze(),
    remainingAnalyzes: getRemainingAnalyzes(),
    recordAnalyze,
    login,
    logout
  }
}
