export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full min-h-full items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full">{children}</div>
    </div>
  )
}
