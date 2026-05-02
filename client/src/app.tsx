import { Link, Route, Routes } from 'react-router'
import { ROUTES } from './lib/constants/routes'
import Home from './pages/home'
import { Button } from './components/ui/button'
import Login from './pages/login'
import Signup from './pages/signup'
import { useAuth } from './lib/auth/auth-context'

export function App() {
  const { user, logout } = useAuth()

  return (
    <>
      <nav>
        {user ? (
          <div>
            <span>{user.name}</span>
            <Button onClick={logout}>Logout</Button>
          </div>
        ) : (
          <div>
            <Link to={ROUTES.LOGIN}>Login</Link>
            <Link to={ROUTES.SIGNUP}>Sign Up</Link>
          </div>
        )}
      </nav>
      <Routes>
        <Route index element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />
      </Routes>
    </>
  )
}

export default App
