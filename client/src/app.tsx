import { Route, Routes } from 'react-router'
import { ROUTES } from './lib/constants/routes'
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'
import useAuth from './lib/auth/auth-provider'
import ProtectRoute from './lib/auth/protect-route'
import Navbar from './components/common/navbar'
import Footer from './components/common/footer'

export function App() {
  const { user, loading } = useAuth()

  return (
    <ProtectRoute>
      {loading && (
        <p className="grid h-screen w-screen place-items-center bg-black">
          Loading...
        </p>
      )}

      <Navbar user={user} />

      <Routes>
        <Route index element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />
      </Routes>

      <Footer />
    </ProtectRoute>
  )
}

export default App
