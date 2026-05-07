import { Route, Routes } from 'react-router'
import { ROUTES } from './lib/constants/routes'
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'
import useAuth from './lib/auth/auth-provider'
import ProtectRoute from './lib/auth/protect-route'
import Navbar from './components/common/navbar'
import Footer from './components/common/footer'
import Dashboard from './pages/dashboard'

export function App() {
  const { user, loading } = useAuth()

  return (
    <ProtectRoute>
      <div className="relative min-h-screen overflow-x-hidden bg-white">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-sky-500/35 via-sky-200/10 to-transparent" />
        {loading && (
          <p className="grid h-screen w-screen place-items-center bg-black">
            Loading...
          </p>
        )}

        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar user={user} />

          <main className="flex-1">
            <Routes>
              <Route index element={<Home />} />
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.SIGNUP} element={<Signup />} />
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </ProtectRoute>
  )
}

export default App
