import * as React from 'react'
import { useTheme } from 'next-themes'
import { useHasMounted } from '@/lib/helpers'
import Swatch from '@/components/swatch'

const themes = [
  { title: 'Brex Mode', name: 'brex', color: { hex: '#ff7b28' } },
  { title: 'Light Mode', name: 'light', color: { hex: '#f4f4f0' } },
  { title: 'Dark Mode', name: 'dark', color: { hex: '#000000' } },
  { title: 'Otter Mode', name: 'otter', color: { hex: '#0a0523' } },
]

const ThemeSwitch = () => {
  const hasMounted = useHasMounted()
  const { theme: themeName, setTheme } = useTheme()

  // Make sure it's client-only

  // store our current and next theme objects (will be first theme, if undefined)
  const currentIndex = Math.max(
    0,
    themes.findIndex((t) => t.name === themeName)
  )

  const nextTheme = themes[(currentIndex + 1) % themes.length]
  const currentTheme = themes[currentIndex]

  const handleSetNextTheme = React.useCallback(() => {
    setTheme(nextTheme.name)
  }, [nextTheme, setTheme])

  if (!hasMounted || !themeName) return null

  return (
    <div className="theme-switch">
      <button
        className="theme-switch--toggle"
        onClick={handleSetNextTheme}
        aria-label={`Change theme to ${nextTheme.title}`}
      >
        <Swatch color={currentTheme.color} />
        <div className="theme-switch--label">{currentTheme.title}</div>
      </button>
    </div>
  )
}

export default ThemeSwitch
