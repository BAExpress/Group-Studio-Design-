import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function currentTheme(): Theme {
  const attr = document.documentElement.getAttribute('data-theme')
  return attr === 'dark' ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    setTheme(currentTheme())
  }, [])

  function apply(t: Theme) {
    document.documentElement.setAttribute('data-theme', t)
    try {
      localStorage.setItem('rb-theme', t)
    } catch {
      /* ignore */
    }
    setTheme(t)
  }

  return (
    <button
      type="button"
      className="flex size-[30px] shrink-0 items-center justify-center rounded-sm border border-outline bg-surface text-on-surface-variant transition-colors hover:border-secondary hover:text-secondary"
      aria-label="Alternar tema claro/escuro"
      aria-pressed={theme === 'dark'}
      title={theme === 'dark' ? 'Modo escuro ativo — clique para claro' : 'Modo claro ativo — clique para escuro'}
      onClick={() => apply(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? '☾' : '☀'}
    </button>
  )
}
