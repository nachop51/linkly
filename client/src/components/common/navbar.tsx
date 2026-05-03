import { ROUTES } from '@/lib/constants/routes'
import type { User } from '@/lib/types'
import { Link } from 'react-router'
import { Button } from '../ui/button'
import { api } from '@/lib/axios'
import { API } from '@/lib/constants/endpoints'
import useAuth from '@/lib/auth/auth-provider'

interface NavbarProps {
  user: User | null
}

export default function Navbar({ user }: NavbarProps) {
  const { updateUser } = useAuth()
  if (!user) return null

  const handleLogout = async () => {
    try {
      await api.post(API.AUTH.LOGOUT)
      updateUser(null)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <nav className="flex h-16 items-center justify-between border-b border-border bg-background px-6 py-4">
      <div>
        <Link to={ROUTES.HOME}>Linkly</Link>
      </div>

      <div className="flex items-center gap-2">
        <Button>
          <Link to="#">{user.name}</Link>
        </Button>
        <Button variant="destructive" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </nav>
  )
}
