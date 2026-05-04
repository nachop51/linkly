import { XIcon } from '@phosphor-icons/react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

interface ClosableBadgeProps {
  children: React.ReactNode
  onClick: () => void
}

export default function ClosableBadge({
  children,
  onClick,
}: ClosableBadgeProps) {
  return (
    <Badge className="flex items-center gap-2">
      {children}
      <Button
        className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[inherit] p-0 text-primary-foreground/60 transition-[color,box-shadow] outline-none hover:text-primary-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        variant="ghost"
        size="icon"
        aria-label="Close"
        onClick={onClick}
      >
        <XIcon className="size-3" />
      </Button>
    </Badge>
  )
}
