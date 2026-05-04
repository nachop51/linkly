const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="sticky bottom-0 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {year} Shortener. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
