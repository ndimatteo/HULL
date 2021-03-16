import React from 'react'
import { useTheme } from 'next-themes'
import cx from 'classnames'

import { useHasMounted } from '@lib/helpers'

const ThemeSwitch = () => {
  const hasMounted = useHasMounted()
  const { theme, setTheme } = useTheme()

  if (!hasMounted) return null

  return (
    <div className="theme-switch">
      <button
        className={cx('theme-switch--button', {
          'is-current': theme === 'light',
        })}
        onClick={() => setTheme('light')}
        aria-label="Change theme to Light mode"
        style={{ '--swatch': '#f4f4f0' }}
      >
        <span></span>
      </button>
      <button
        className={cx('theme-switch--button', {
          'is-current': theme === 'dark',
        })}
        onClick={() => setTheme('dark')}
        aria-label="Change theme to Dark mode"
        style={{ '--swatch': '#000000' }}
      >
        <span></span>
      </button>
      <button
        className={cx('theme-switch--button', {
          'is-current': theme === 'metal',
        })}
        onClick={() => setTheme('metal')}
        aria-label="Change theme to Metal mode"
        style={{ '--swatch': '#8fff1f' }}
      >
        <span></span>
      </button>
    </div>
  )
}

export default ThemeSwitch
