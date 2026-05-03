import { useLocation, useNavigate } from 'react-router'
import useAuth from './auth-provider'
import { ROUTES } from '../constants/routes'

const unprotectedRoutes = [ROUTES.LOGIN, ROUTES.SIGNUP]

export default function ProtectRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (!loading && !user && !unprotectedRoutes.includes(location.pathname)) {
    navigate(ROUTES.LOGIN, { replace: true })
    return
  }

  return children
}
