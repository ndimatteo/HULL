import { m } from 'framer-motion'
import { useRect } from '@reach/rect'
import { useSiteContext, useToggleMegaNav } from '@/lib/context'
import { isBrowser } from '@/lib/helpers'
import { swipeAnim } from '@/lib/animate'
import * as React from 'react'
import FocusTrap from 'focus-trap-react'
import cx from 'classnames'
import Menu from './menu'
import FeaturedProducts from './featured-products'
import type API from '@/lib/shared-types'

type MegaNavigationProps = {
  headerHeight: number | undefined
  items: API['MenuItems']
}

const MegaNavigation = ({ items, headerHeight }: MegaNavigationProps) => {
  const dropdowns = React.useMemo(
    () =>
      items.filter((item) => {
        return 'dropdownItems' in item
      }),
    [items]
  )

  const toggleMegaNav = useToggleMegaNav()
  const { meganav } = useSiteContext()
  const activeNav = React.useRef<HTMLDivElement | null>(null)
  const activeNavRect = useRect(activeNav, { observe: true })
  const [hasFocus, setHasFocus] = React.useState(false)

  const handleKeyup = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.which === 27) {
        toggleMegaNav(false)
      }
    },
    [toggleMegaNav]
  )

  React.useEffect(() => {
    if (isBrowser) {
      document.body.classList.toggle('overflow-hidden', meganav.isOpen)
    }
  }, [meganav.isOpen])

  if (!dropdowns.length) return null

  return (
    <>
      <FocusTrap
        active={meganav.isOpen && hasFocus}
        focusTrapOptions={{ allowOutsideClick: true }}
      >
        <div
          // @ts-ignore TODO: fix legacy refs
          ref={!meganav.isOpen ? activeNav : undefined}
          className="mega-nav"
          onKeyUp={(e) => handleKeyup(e)}
        >
          {dropdowns.map((dropdown, key) => {
            const isActive =
              meganav.isOpen && meganav.activeID === dropdown._key

            return (
              <div
                key={key}
                ref={isActive ? (ref) => (activeNav.current = ref) : undefined}
                id={`meganav-${dropdown._key}`}
                className={cx('mega-item', {
                  'is-active': isActive,
                })}
              >
                <div className="mega-item--outer">
                  <div className="mega-item--inner">
                    <m.div
                      initial="hide"
                      animate={isActive ? 'show' : 'hide'}
                      onAnimationComplete={() => setHasFocus(isActive)}
                      variants={swipeAnim}
                      className="mega-item--content"
                    >
                      <Menu
                        items={dropdown.dropdownItems}
                        hasFocus={hasFocus && isActive}
                        onClick={() => toggleMegaNav(false)}
                      />

                      {dropdown.featured && (
                        <div className="mega-item--featured">
                          <div className="mega-item--featured-title">
                            <span>Featured</span>
                          </div>
                          <FeaturedProducts
                            products={dropdown.featured}
                            onClick={() => toggleMegaNav(false)}
                          />
                        </div>
                      )}
                    </m.div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </FocusTrap>
      <div
        className={cx('mega-nav--bg')}
        style={{
          // @ts-ignore TODO: extend these properties to CSSProperties
          '--h': meganav.isOpen
            ? (activeNavRect?.height ?? 0) + (headerHeight ?? 0)
            : 0,
          '--hpx': `${
            meganav.isOpen
              ? (activeNavRect?.height ?? 0) + (headerHeight ?? 0)
              : 0
          }px`,
        }}
      />

      <div className="mega-nav--border" />

      <div
        className={cx('mega-nav--backdrop', {
          'is-active': meganav.isOpen,
        })}
        onClick={() => toggleMegaNav(false)}
      />
    </>
  )
}

type MegaDropdownButtonProps = {
  title: string
  id: string
}
export const MegaDropdownButton = ({ title, id }: MegaDropdownButtonProps) => {
  const toggleMegaNav = useToggleMegaNav()
  const { meganav } = useSiteContext()

  const isActive = meganav.activeID === id

  return (
    <button
      className={cx('mega-toggle', { 'is-open': isActive })}
      aria-expanded={isActive}
      aria-controls={`meganav-${id}`}
      onClick={() => toggleMegaNav(!isActive ? true : 'toggle', id)}
    >
      <span className="mega-toggle--icon" />
      {title}
    </button>
  )
}

export default MegaNavigation
