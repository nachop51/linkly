import { useState } from 'react'

import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { API } from '@/lib/constants/endpoints'
import { api } from '@/lib/axios'
import useAuth from '@/lib/auth/auth-provider'

const SignupForm = () => {
  const { updateUser } = useAuth()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const password = form.get('password') as string
    const confirmPassword = form.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await api.post(API.AUTH.SIGNUP, {
        name: form.get('name') as string,
        handle: form.get('handle') as string,
        email: form.get('email') as string,
        password,
        confirmPassword,
      })

      updateUser(res.data)
    } catch (err: any) {
      console.error(error)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <Label htmlFor="email" className="leading-5">
          Email address<span className="text-red-500">*</span>
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email address"
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="name" className="leading-5">
          Name<span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="handle" className="leading-5">
          Username<span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          id="handle"
          name="handle"
          placeholder="Enter your username"
          required
        />
      </div>

      <div className="w-full space-y-1">
        <Label htmlFor="password" className="leading-5">
          Password<span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="••••••••••••••••"
            className="pr-9"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            className="absolute inset-y-0 right-0 rounded-l-none text-muted-foreground hover:bg-transparent focus-visible:ring-ring/50"
          >
            {isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
            <span className="sr-only">
              {isPasswordVisible ? 'Hide password' : 'Show password'}
            </span>
          </Button>
        </div>
      </div>

      <div className="w-full space-y-1">
        <Label htmlFor="confirmPassword" className="leading-5">
          Confirm Password<span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="••••••••••••••••"
            className="pr-9"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            className="absolute inset-y-0 right-0 rounded-l-none text-muted-foreground hover:bg-transparent focus-visible:ring-ring/50"
          >
            {isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
            <span className="sr-only">
              {isPasswordVisible
                ? 'Hide confirm password'
                : 'Show confirm password'}
            </span>
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create an account'}
      </Button>
    </form>
  )
}

export default SignupForm
