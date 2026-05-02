'use client'

import { useState } from 'react'

import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { API } from '@/lib/constants/endpoints'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/lib/constants/routes'
import { api } from '@/lib/axios'

const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const password = form.get('password') as string
    const identifier = form.get('identifier') as string

    if (!identifier || !password) {
      setError('Please fill in all fields.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      await api.post(
        API.AUTH.LOGIN,
        {
          identifier,
          password,
        },
        {
          withCredentials: true,
        }
      )

      navigate(ROUTES.HOME)
    } catch (err: any) {
      console.error(error)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Email */}
      <div className="space-y-1">
        <Label htmlFor="identifier" className="leading-5">
          Email address or username<span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          id="identifier"
          name="identifier"
          placeholder="Enter your email address or username"
        />
      </div>

      {/* Password */}
      <div className="w-full space-y-1">
        <Label htmlFor="password" className="leading-5">
          Password<span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={isVisible ? 'text' : 'password'}
            placeholder="••••••••••••••••"
            className="pr-9"
          />
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setIsVisible((prevState) => !prevState)}
            className="absolute inset-y-0 right-0 rounded-l-none text-muted-foreground hover:bg-transparent focus-visible:ring-ring/50"
          >
            {isVisible ? <EyeSlashIcon /> : <EyeIcon />}
            <span className="sr-only">
              {isVisible ? 'Hide password' : 'Show password'}
            </span>
          </Button>
        </div>
      </div>

      {/* Remember Me and Forgot Password */}
      <div className="flex items-center justify-between gap-y-2">
        <div className="flex items-center gap-3">
          <Checkbox id="rememberMe" className="size-6" />
          <Label htmlFor="rememberMe" className="text-muted-foreground">
            {' '}
            Remember Me
          </Label>
        </div>

        <a href="#" className="hover:underline">
          Forgot Password?
        </a>
      </div>

      <Button className="w-full" type="submit" disabled={isLoading}>
        Sign in to Linkly
      </Button>
    </form>
  )
}

export default LoginForm
