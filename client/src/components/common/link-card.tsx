'use client'

import { useEffect, useState } from 'react'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DotsThreeOutlineVerticalIcon,
  LockIcon,
  LockOpenIcon,
  PencilSimpleLineIcon,
  TagIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '../ui/badge'
import { Link } from 'react-router'

interface LinkCardProps {
  url: string
  alias: string
  description?: string | null
  visibility: string
  tags?: string[]
  created_at: Date | string
  updated_at: Date | string
  onEdit?: () => void
  onDelete?: () => void
}

const LinkCard = ({
  url,
  alias,
  description,
  visibility,
  tags,
  created_at,
  updated_at,
  onEdit,
  onDelete,
}: LinkCardProps) => {
  useEffect(() => {
    const all = document.querySelectorAll('.spotlight-card')

    const handleMouseMove = (ev: MouseEvent) => {
      all.forEach((e) => {
        const blob = e.querySelector('.blob') as HTMLElement
        const fblob = e.querySelector('.fake-blob') as HTMLElement

        if (!blob || !fblob) return

        const rec = fblob.getBoundingClientRect()

        blob.style.opacity = '1'

        const transformValue = `translate(${
          ev.clientX - rec.left - rec.width / 2
        }px, ${ev.clientY - rec.top - rec.height / 2}px)`

        if (typeof blob.animate === 'function') {
          blob.animate([{ transform: transformValue }], {
            duration: 300,
            fill: 'forwards',
          })
        } else {
          blob.style.transform = transformValue
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const formatDate = (value: Date | string) => {
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return 'Unknown'

    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(parsed)
  }

  const createdAtLabel = formatDate(created_at)
  const updatedAtLabel = formatDate(updated_at)
  const showUpdatedAt =
    new Date(updated_at).getTime() > new Date(created_at).getTime()
  const safeTags = tags ?? []
  const [isPrivate, setIsPrivate] = useState(
    visibility.toLowerCase() === 'private'
  )
  const visibilityLabel = isPrivate ? 'Private' : 'Public'

  return (
    <div className="h-full w-full">
      <div className="spotlight-card group relative h-full overflow-hidden bg-border p-px transition-all duration-300 ease-in-out">
        <Card className="flex h-full min-h-80 w-full flex-col border-none transition-all duration-300 ease-in-out group-hover:bg-card/90 group-hover:backdrop-blur-[20px]">
          <CardHeader className="space-y-3 pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="font-mono text-xl font-semibold text-foreground">
                /{alias}
              </CardTitle>

              <div className="flex items-center gap-1">
                <div className="group/visibility relative">
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    type="button"
                    aria-label={`Actual visibility: ${visibilityLabel}`}
                    onClick={() => setIsPrivate((prev) => !prev)}
                  >
                    {isPrivate ? (
                      <LockIcon className="transition-all duration-200 group-hover/visibility:scale-110 group-hover/visibility:-rotate-6" />
                    ) : (
                      <LockOpenIcon className="transition-all duration-200 group-hover/visibility:scale-110 group-hover/visibility:rotate-6" />
                    )}
                  </Button>
                  <span className="pointer-events-none absolute top-full right-0 z-10 mt-1 rounded-md border border-border bg-popover px-2 py-1 text-[11px] whitespace-nowrap text-popover-foreground opacity-0 shadow-sm transition-opacity duration-150 group-focus-within/visibility:opacity-100 group-hover/visibility:opacity-100">
                    {visibilityLabel}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      aria-label={`Open actions for ${alias}`}
                    >
                      <DotsThreeOutlineVerticalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36 min-w-36">
                    <DropdownMenuItem onClick={onEdit}>
                      <PencilSimpleLineIcon />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={onDelete}>
                      <TrashIcon />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <p
              className="line-clamp-2 text-xs break-all text-muted-foreground/90"
              title={url}
            >
              <Link
                to={url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                {url}
              </Link>
            </p>
          </CardHeader>

          <CardContent className="space-y-4 py-0">
            {description ? (
              <p className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs/relaxed text-foreground/80">
                {description}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No description
              </p>
            )}

            <div className="flex items-start gap-2">
              <TagIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <ul className="flex flex-wrap items-center gap-2">
                {safeTags.length ? (
                  safeTags.map((tag) => (
                    <li key={tag}>
                      <Badge variant="outline">{tag}</Badge>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-muted-foreground">No tags</li>
                )}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="mt-auto border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <p>
                <span className="font-medium">Created:</span> {createdAtLabel}
              </p>
              {showUpdatedAt ? (
                <>
                  <p>&middot;</p>
                  <p>
                    <span className="font-medium">Updated:</span>{' '}
                    {updatedAtLabel}
                  </p>
                </>
              ) : null}
            </div>
          </CardFooter>
        </Card>
        <div className="blob pointer-events-none absolute top-0 left-0 size-20 rounded-full bg-sky-600/60 opacity-0 blur-2xl transition-all duration-300 ease-in-out dark:bg-sky-400/60" />
        <div className="fake-blob pointer-events-none absolute top-0 left-0 size-20 rounded-full" />
      </div>
    </div>
  )
}

export default LinkCard
