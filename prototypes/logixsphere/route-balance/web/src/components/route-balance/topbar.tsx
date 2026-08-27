import { ThemeToggle } from './theme-toggle'

export function Topbar() {
  return (
    <div className="flex flex-wrap items-center justify-end gap-4 border-b border-outline-variant px-7 py-3.5 max-[860px]:gap-2 max-[860px]:px-4">
      <input
        className="w-[200px] rounded-sm border border-outline-variant bg-surface-variant px-2.5 py-[7px] font-mono text-[11px] uppercase tracking-wide text-on-surface-variant placeholder:text-on-surface-variant max-[560px]:hidden"
        type="text"
        placeholder="SEARCH SYSTEM..."
        aria-label="Buscar no sistema"
      />
      <time className="text-[11.5px] text-on-surface-variant max-[560px]:hidden">19/08/2026 11:20</time>
      <ThemeToggle />
      <div className="flex items-center gap-1.5 text-xs font-medium">
        <span className="flex size-[22px] items-center justify-center rounded-full border border-outline bg-surface-variant text-[11px]">◉</span>
        João ⌄
      </div>
    </div>
  )
}
