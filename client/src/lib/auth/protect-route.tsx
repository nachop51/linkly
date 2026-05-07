import { Navigate, useLocation } from 'react-router'
import useAuth from './auth-provider'
import { ROUTES } from '../constants/routes'

const unprotectedRoutes = [ROUTES.LOGIN, ROUTES.SIGNUP]

export default function ProtectRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (!loading && !user && !unprotectedRoutes.includes(location.pathname)) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return children
}
