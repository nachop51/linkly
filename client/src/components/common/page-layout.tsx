export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex h-auto min-h-[calc(100dvh-65px-69px)] items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      {children}
    </div>
  )
}
