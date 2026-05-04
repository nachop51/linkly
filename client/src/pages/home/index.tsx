import PageLayout from '@/components/common/page-layout'
import ShortenForm from '@/components/shorten-form'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from '@phosphor-icons/react'

export default function Home() {
  const exampleLinks = [
    'https://github.com/trending',
    'https://www.notion.so/templates',
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  ]

  const fillLongUrlInput = (url: string) => {
    const longUrlInput = document.getElementById(
      'longUrl'
    ) as HTMLInputElement | null

    if (!longUrlInput) return

    longUrlInput.value = url
    longUrlInput.dispatchEvent(new Event('input', { bubbles: true }))
    longUrlInput.focus()
  }

  return (
    <PageLayout>
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center py-10">
        <header className="mb-6 w-full max-w-2xl space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Shorten links
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Paste your URL, customize it and share it in seconds
          </p>
        </header>
        <section className="w-full max-w-2xl border border-border/60 bg-card/70 p-6 shadow-lg backdrop-blur-sm md:p-8">
          <ShortenForm />

          <div className="mt-6 border-t border-border/60 pt-5">
            <p className="mb-3 text-center text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Try with these links
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {exampleLinks.map((url) => (
                <Button
                  key={url}
                  onClick={() => fillLongUrlInput(url)}
                  variant="outline"
                  size="sm"
                  className="group"
                >
                  {url}
                  <span className="ml-0 inline-flex w-0 items-center overflow-hidden opacity-0 transition-all duration-200 ease-out group-hover:ml-2 group-hover:w-3 group-hover:opacity-100">
                    <ArrowRightIcon className="size-3 translate-x-[-2px] transition-transform duration-200 ease-out group-hover:translate-x-0" />
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
