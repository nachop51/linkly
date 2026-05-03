import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import Logo from '@/assets/logo'
import SignupForm from '@/components/auth/signup-form'
import { Link, useNavigate } from 'react-router'
import useAuth from '@/lib/auth/auth-provider'
import { ROUTES } from '@/lib/constants/routes'

const Signup = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  if (user && !loading) {
    navigate(ROUTES.HOME)
    return
  }

  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <Card className="z-1 w-full border-none shadow-md sm:max-w-lg">
        <CardHeader className="gap-6">
          <Logo className="gap-3" />

          <div>
            <CardTitle className="mb-1.5 text-2xl">Sign up to Linkly</CardTitle>
            <CardDescription className="text-base">
              Sign up to Linkly to continue.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {/* Signup Form */}
          <div className="space-y-4">
            <SignupForm />

            <p className="text-center text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-card-foreground hover:underline"
              >
                Sign in
              </Link>
            </p>

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <p>or</p>
              <Separator className="flex-1" />
            </div>

            <Button variant="ghost" className="w-full" asChild>
              <a href="#">Sign up with google</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Signup
