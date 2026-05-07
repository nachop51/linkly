'use client'

import { useMemo, useState } from 'react'

import PageLayout from '@/components/common/page-layout'
import LinkCard from '@/components/common/link-card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const cards = [
  {
    url: 'https://google.com/ajsdkjsd',
    alias: 'google',
    visibility: 'public',
    tags: ['misc', 'google'],
    description: 'A link to Google',
    created_at: new Date('2026-03-01T08:30:00Z'),
    updated_at: new Date('2026-03-15T11:20:00Z'),
  },
  {
    url: 'https://www.notion.so/workspace/marketing-playbook-2026',
    alias: 'marketing-playbook',
    visibility: 'private',
    tags: ['docs', 'team'],
    description: 'Internal playbook for growth and campaign operations.',
    created_at: new Date('2026-01-12T10:15:00Z'),
    updated_at: new Date('2026-01-12T10:15:00Z'),
  },
  {
    url: 'https://github.com/vercel/next.js/tree/canary/examples',
    alias: 'next-examples',
    visibility: 'public',
    tags: ['dev', 'reference', 'frontend'],
    description: 'Useful examples for new feature prototypes.',
    created_at: new Date('2026-02-05T09:00:00Z'),
    updated_at: new Date('2026-04-02T14:45:00Z'),
  },
  {
    url: 'https://drive.google.com/drive/folders/abc123xyz-team-assets',
    alias: 'brand-assets',
    visibility: 'private',
    tags: ['design', 'assets'],
    description: null,
    created_at: new Date('2026-02-28T16:00:00Z'),
    updated_at: new Date('2026-03-03T09:10:00Z'),
  },
  {
    url: 'https://news.ycombinator.com/',
    alias: 'hn',
    visibility: 'public',
    tags: ['news', 'tech'],
    description: 'Daily industry reading list.',
    created_at: new Date('2026-04-20T06:00:00Z'),
    updated_at: new Date('2026-04-22T07:30:00Z'),
  },
  {
    url: 'https://calendar.google.com/calendar/u/0/r/week',
    alias: 'weekly-calendar',
    visibility: 'private',
    tags: [],
    description: 'Quick access to weekly planning.',
    created_at: new Date('2026-03-10T13:40:00Z'),
    updated_at: new Date('2026-03-10T13:40:00Z'),
  },
]

export default function Dashboard() {
  const [showPrivate, setShowPrivate] = useState(true)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    cards.forEach((card) => {
      card.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort((a, b) => a.localeCompare(b))
  }, [])

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesVisibility =
        card.visibility === 'public' || (showPrivate && card.visibility === 'private')
      const matchesTag =
        selectedTags.length === 0 ||
        selectedTags.some((selectedTag) => card.tags.includes(selectedTag))

      return matchesVisibility && matchesTag
    })
  }, [showPrivate, selectedTags])

  const handleEdit = (alias: string) => {
    window.alert(`Edit flow for /${alias}`)
  }
  const handleDelete = (alias: string) => {
    window.alert(`Delete flow for /${alias}`)
  }

  return (
    <PageLayout>
      <section className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center py-10">
        <header className="mb-6 flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Dashboard
          </h1>

          <div className="flex flex-wrap items-center gap-3 rounded-sm border border-border/60 bg-muted/20 p-2">
            <div className="flex items-center gap-2">
              <p className="text-[11px] text-muted-foreground">Show private</p>
              <button
                type="button"
                role="switch"
                aria-checked={showPrivate}
                aria-label="Toggle private links visibility"
                onClick={() => setShowPrivate((prev) => !prev)}
                className="relative inline-flex h-5 w-9 items-center rounded-full border border-border/70 bg-background transition-colors aria-checked:bg-primary"
              >
                <span
                  className={`inline-block size-4 transform rounded-full bg-foreground/90 transition-transform ${
                    showPrivate ? 'translate-x-4 bg-primary-foreground' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  size="xs"
                  className="h-7 rounded-full px-2.5"
                  variant="outline"
                >
                  {selectedTags.length ? `${selectedTags.length} tags` : 'All tags'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Filter by tags</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allTags.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={(checked) => {
                      setSelectedTags((prev) => {
                        if (checked) return [...prev, tag]
                        return prev.filter((item) => item !== tag)
                      })
                    }}
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <Button
                  type="button"
                  size="xs"
                  variant="ghost"
                  className="m-1 h-6 w-[calc(100%-0.5rem)] justify-center"
                  onClick={() => setSelectedTags([])}
                >
                  Clear tags
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>

            <p className="text-xs text-muted-foreground">
              {filteredCards.length} result{filteredCards.length === 1 ? '' : 's'}
            </p>
            <Button
              type="button"
              size="xs"
              variant="ghost"
              className="h-6 px-2 text-[11px]"
              onClick={() => {
                setShowPrivate(true)
                setSelectedTags([])
              }}
            >
              Clear
            </Button>
          </div>
        </header>

        <article className="grid w-full auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map((card) => (
            <LinkCard
              key={`${card.alias}-${card.url}`}
              url={card.url}
              alias={card.alias}
              visibility={card.visibility}
              description={card.description}
              tags={card.tags}
              created_at={card.created_at}
              updated_at={card.updated_at}
              onEdit={() => handleEdit(card.alias)}
              onDelete={() => handleDelete(card.alias)}
            />
          ))}
        </article>
        {!filteredCards.length ? (
          <p className="mt-6 text-sm text-muted-foreground">
            No links match the selected filters.
          </p>
        ) : null}
      </section>
    </PageLayout>
  )
}
