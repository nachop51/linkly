import { createContext, use, useEffect, useState } from 'react'
import type { User } from '../types'
import { api } from '../axios'
import { API } from '../constants/endpoints'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  updateUser: (user: User | null) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(API.AUTH.CHECK_AUTH)
        setUser(res.data)
      } catch (e) {
        console.error('Error fetching user:', e)
        setError('Failed to fetch user')
      }
    }

    fetchUser().finally(() => setLoading(false))
  }, [])

  const updateUser = (user: User | null) => {
    setUser(user)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  const auth = use(AuthContext)

  if (auth == null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return auth
}
