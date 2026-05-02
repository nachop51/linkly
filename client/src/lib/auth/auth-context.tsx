import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '../types'
import { useLocation, useNavigate } from 'react-router'
import { api } from '../axios'
import { ROUTES } from '../constants/routes'
import { API } from '../constants/endpoints'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchUser = async () => {
      let authUser: User | null = null
      try {
        const response = await api.get<User>(API.AUTH.CHECK_AUTH, {
          withCredentials: true,
        })
        authUser = response.data
      } catch {
        setError('Failed to fetch user')
        return
      } finally {
        setLoading(false)
      }

      if (!authUser && !location.pathname.includes(ROUTES.LOGIN)) {
        navigate(ROUTES.LOGIN)
        return
      }

      setUser(authUser)
    }
    fetchUser()
  }, [])

  const logout = async () => {
    try {
      await api.post(API.AUTH.LOGOUT, { withCredentials: true })
      setUser(null)
      navigate(ROUTES.LOGIN)
    } catch (error) {
      setError('Failed to logout')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
