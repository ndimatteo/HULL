import React, { useState, useRef } from 'react'
import { m } from 'framer-motion'
import FocusTrap from 'focus-trap-react'
import { useIntersection } from 'use-intersection'
import { useRect } from '@reach/rect'
import Link from 'next/link'
import cx from 'classnames'

import { isBrowser } from '@lib/helpers'

import PromoBar from './promo-bar'
import Menu from '@blocks/navigation/menu'
import MegaNavigation from '@blocks/navigation/mega-nav'
import Icon from '@components/icon'

// Context helpers
import {
  useSiteContext,
  useToggleMegaNav,
  useToggleCart,
  useCartCount,
} from '@lib/context'

const Header = ({ data = {}, isTransparent }) => {
  // expand our header data
  const {
    promo,
    menuDesktopLeft,
    menuDesktopRight,
    menuMobilePrimary,
    menuMobileSecondary,
  } = data

  // setup states
  const [isMobileNavOpen, setMobileNavOpen] = useState(false)
  const observerRef = useRef()
  const observerIsVisible = useIntersection(observerRef)
  const headerRef = useRef()
  const headerRect = useRect(headerRef)

  // setup menu toggle event
  const toggleMobileNav = (state) => {
    setMobileNavOpen(state)

    if (isBrowser) {
      document.body.classList.toggle('overflow-hidden', state)
    }
  }

  // context helpers
  const { meganav } = useSiteContext()
  const toggleMegaNav = useToggleMegaNav()

  return (
    <>
      <a href="#content" className="skip-link">
        Skip to Content
      </a>

      <PromoBar data={promo} />

      <header
        className={cx('header', {
          'is-overlay': isTransparent,
          'is-white': isTransparent && !meganav.isOpen && observerIsVisible,
          'has-bg': !observerIsVisible,
        })}
      >
        <div ref={headerRef} className="header--outer">
          <div className="header--inner">
            <div className="header--content">
              <div className="logo">
                <Link href="/" scroll={false}>
                  <a className="logo--link" aria-label="Go Home">
                    <Icon name="Logo" id="header" viewBox="0 0 215 150" />
                  </a>
                </Link>
              </div>

              <nav className="main-navigation" role="navigation">
                {/* Mobile Header Menu */}
                <div id="mobile-nav" className="main-navigation--mobile">
                  <FocusTrap active={isMobileNavOpen}>
                    <div>
                      <button
                        onClick={() => toggleMobileNav(!isMobileNavOpen)}
                        className={cx('menu-toggle', {
                          'is-open': isMobileNavOpen,
                        })}
                        aria-expanded={isMobileNavOpen ? 'true' : 'false'}
                        aria-controls="mobile-nav"
                        aria-label="Toggle Menu"
                      >
                        <span className="hamburger">
                          <span className="hamburger--icon"></span>
                        </span>
                      </button>
                      <m.div
                        initial="hide"
                        animate={isMobileNavOpen ? 'show' : 'hide'}
                        variants={{
                          show: {
                            x: '0%',
                          },
                          hide: {
                            x: '-100%',
                          },
                        }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="menu-mobile"
                      >
                        <div
                          className="menu-mobile--inner"
                          style={
                            headerRect?.height
                              ? { '--headerHeight': `${headerRect.height}px` }
                              : null
                          }
                        >
                          <div className="menu-mobile--primary">
                            {menuMobilePrimary.items && (
                              <Menu
                                items={menuMobilePrimary.items}
                                onClick={() => toggleMobileNav(false)}
                              />
                            )}
                          </div>

                          <div className="menu-mobile--secondary">
                            {menuMobileSecondary.items && (
                              <Menu
                                items={menuMobileSecondary.items}
                                onClick={() => toggleMobileNav(false)}
                              />
                            )}
                          </div>
                        </div>
                      </m.div>

                      <div
                        className={cx('menu-mobile--backdrop', {
                          'is-active': isMobileNavOpen,
                        })}
                        onClick={() => toggleMobileNav(false)}
                      />
                    </div>
                  </FocusTrap>

                  <CartToggle />
                </div>

                {/* Desktop Header Menu */}
                <div className="main-navigation--desktop">
                  <div className="menu-left">
                    {menuDesktopLeft?.items && (
                      <Menu
                        items={menuDesktopLeft.items}
                        onClick={() => toggleMegaNav(false)}
                        useMegaNav
                      />
                    )}
                  </div>

                  <div className="menu-right">
                    {menuDesktopRight?.items && (
                      <Menu
                        items={menuDesktopRight.items}
                        onClick={() => toggleMegaNav(false)}
                        useMegaNav
                      />
                    )}

                    <CartToggle />
                  </div>
                </div>
              </nav>
            </div>

            <div
              className={cx('header--border', {
                'is-hidden': meganav.isOpen,
              })}
            />
          </div>

          <MegaNavigation
            items={[
              ...(menuDesktopLeft?.items || []),
              ...(menuDesktopRight?.items || []),
            ]}
            headerHeight={
              isTransparent && observerIsVisible ? headerRect?.height : false
            }
          />
        </div>
      </header>

      <span ref={observerRef} className="header--observer" />
    </>
  )
}

const CartToggle = () => {
  const toggleCart = useToggleCart()
  const cartCount = useCartCount()

  return (
    <button className="cart-toggle" onClick={() => toggleCart()}>
      Cart
      <span
        className={cx('cart-toggle--count', {
          'is-active': cartCount > 0,
        })}
      >
        {cartCount}
      </span>
    </button>
  )
}

const HeaderBackdrop = ({ isActive, onClick }) => {
  return (
    <div
      className={cx('header--backdrop', {
        'is-active': isActive,
      })}
      onClick={onClick}
    />
  )
}

export default Header
