import { ChevronDown, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

function formatDateTime(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function HeaderBar() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center justify-between border-b border-outline-variant bg-surface px-6 py-2">
      <div className="relative w-full max-w-xs">
        <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-on-surface-variant" />
        <input
          disabled
          placeholder="Search system…"
          className="h-8 w-full rounded-sm border border-outline-variant bg-background pl-7 font-mono text-[11px] text-on-surface-variant placeholder:text-on-surface-variant disabled:cursor-not-allowed"
        />
      </div>
      <div className="flex items-center gap-4 font-mono text-[11px] text-on-surface-variant">
        <span>{formatDateTime(now)}</span>
        <span className="flex items-center gap-1 text-on-surface">
          João <ChevronDown className="size-3" />
        </span>
      </div>
    </div>
  )
}
