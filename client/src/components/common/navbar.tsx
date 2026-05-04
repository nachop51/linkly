import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ROUTES } from '@/lib/constants/routes'
import type { User } from '@/lib/types'
import { Link } from 'react-router'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { api } from '@/lib/axios'
import { API } from '@/lib/constants/endpoints'
import useAuth from '@/lib/auth/auth-provider'
import LinklyLogo from '@/assets/logo'
import { ListDashesIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface NavbarProps {
  user: User | null
}

const links = [
  {
    title: 'Home',
    href: ROUTES.HOME,
  },
  {
    title: 'Dashboard',
    href: ROUTES.DASHBOARD,
  },
]

export default function Navbar({ user }: NavbarProps) {
  const { updateUser } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) setSearchOpen(false)
  }, [user])

  useEffect(() => {
    if (!user) return
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((open) => !open)
        return
      }
      if (searchOpen && e.key === 'Escape') {
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [user, searchOpen])

  useEffect(() => {
    if (!searchOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => searchInputRef.current?.focus(), 0)
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = prevOverflow
    }
  }, [searchOpen])

  if (!user) return null
  const middleIndex = Math.ceil(links.length / 2)
  const leftLinks = links.slice(0, middleIndex)
  const rightLinks = links.slice(middleIndex)

  const handleLogout = async () => {
    try {
      await api.post(API.AUTH.LOGOUT)
      updateUser(null)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-4 sm:gap-8 sm:px-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 md:hidden"
              aria-label="Open navigation menu"
            >
              <ListDashesIcon className="size-6" weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="z-60 min-w-44"
            align="start"
            side="bottom"
            sideOffset={8}
          >
            <DropdownMenuGroup>
              {links.map((link) => (
                <DropdownMenuItem key={`mobile-${link.title}`} asChild>
                  <Link to={link.href}>{link.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <ul className="flex flex-1 items-center justify-center gap-8 font-medium text-muted-foreground lg:gap-16">
          {leftLinks.map((link) => (
            <li
              key={`link-${link.title}`}
              className="hover:text-primary max-md:hidden"
            >
              <Link to={link.href}>{link.title}</Link>
            </li>
          ))}
          <li key="linkly-logo">
            <LinklyLogo className="text-foreground" width={100} />
          </li>
          {rightLinks.map((link) => (
            <li
              key={`link-${link.title}`}
              className="hover:text-primary max-md:hidden"
            >
              <Link to={link.href}>{link.title}</Link>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2 sm:gap-6">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-expanded={searchOpen}
            aria-controls="navbar-search"
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            onClick={() => setSearchOpen((open) => !open)}
          >
            <MagnifyingGlassIcon />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage
                    src={user.avatarUrl ?? ''}
                    alt={`${user.name}'s avatar`}
                  />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {searchOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6"
            role="presentation"
          >
            <button
              type="button"
              className="absolute inset-0 animate-in bg-black/50 backdrop-blur-[1px] duration-200 fade-in-0 motion-reduce:animate-none"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="navbar-search-title"
              className="relative z-10 w-full max-w-lg animate-in border border-border bg-background p-3 shadow-lg ring-1 ring-foreground/10 duration-200 fade-in-0 zoom-in-95 motion-reduce:animate-none"
            >
              <p
                id="navbar-search-title"
                className="mb-2 text-xs font-medium text-muted-foreground"
              >
                Search
              </p>
              <Input
                ref={searchInputRef}
                id="navbar-search"
                type="search"
                placeholder="Search…"
                aria-label="Search"
                className="h-9 w-full text-sm"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                <kbd className="border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                  ⌘ / Ctrl
                </kbd>
                <span className="mx-1">+</span>
                <kbd className="border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                  K
                </kbd>
                <span className="ml-2">to toggle</span>
              </p>
            </div>
          </div>,
          document.body
        )}
    </nav>
  )
}
