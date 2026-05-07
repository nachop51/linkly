'use client'

import PageLayout from '@/components/common/page-layout'
import LinkCard from '@/components/common/link-card'

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
  const handleEdit = (alias: string) => {
    window.alert(`Edit flow for /${alias}`)
  }
  const handleDelete = (alias: string) => {
    window.alert(`Delete flow for /${alias}`)
  }

  return (
    <PageLayout>
      <section className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center py-10">
        <header className="mb-6 w-full space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Dashboard
          </h1>
        </header>

        <article className="grid w-full auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
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
      </section>
    </PageLayout>
  )
}
