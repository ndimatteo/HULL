import React, { useState, useRef } from 'react'
import FocusTrap from 'focus-trap-react'
import { useInView } from 'react-intersection-observer'
import { useRect } from '@reach/rect'
import Link from 'next/link'
import cx from 'classnames'

import PromoBar from '../modules/promo-bar'
import { isBrowser } from '../lib/helpers'
import Navigation from '../components/navigation'
import MegaNavigation, {
  MegaNavigationBackdrop,
} from '../components/mega-navigation'
import Icon from '../components/icon'

import { useSiteContext } from '../lib/contexts'
import { useToggleCart, useCartCount } from '../lib/contexts/shopify'

const Header = ({ data = {}, isTransparent }) => {
  // expand our header data
  const { menuLeft, menuRight, promo } = data

  // setup states
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [observerRef, observerIsVisible] = useInView()
  const headerRef = useRef()
  const headerRect = useRect(headerRef)

  // setup menu toggle event
  const toggleMenu = (state) => {
    setMenuOpen(state)

    if (isBrowser) {
      document.body.classList.toggle('overflow-hidden', state)
    }
  }

  // context helpers
  const { meganav } = useSiteContext()
  const toggleCart = useToggleCart()
  const cartCount = useCartCount()

  return (
    <>
      <a href="#content" className="skip-link">
        Skip to Content
      </a>
      <PromoBar data={promo} />
      <header
        className={cx(
          'header',
          { 'is-overlay': isTransparent },
          { 'is-white': isTransparent && !meganav.isOpen && observerIsVisible },
          { 'has-bg': !observerIsVisible }
        )}
      >
        <div ref={headerRef} className="header--wrapper">
          <div className="header--content">
            <div className="logo">
              <Link href="/" scroll={false}>
                <a className="logo--link" aria-label="Go Home">
                  <Icon name="Logo" id="header" viewBox="0 0 215 150" />
                </a>
              </Link>
            </div>

            <FocusTrap active={isMenuOpen}>
              <div>
                <button
                  onClick={() => toggleMenu(!isMenuOpen)}
                  className={cx('menu-toggle', { 'is-open': isMenuOpen })}
                  aria-expanded={isMenuOpen ? 'true' : 'false'}
                  aria-label="Toggle Menu"
                >
                  <span className="toggle-icon">
                    <span className="toggle-icon--hamburger"></span>
                  </span>
                </button>

                <nav className="main-navigation" role="navigation">
                  <div className="main-navigation--desktop">
                    <div className="menu-left">
                      {menuLeft.items && <Navigation items={menuLeft.items} />}
                    </div>

                    <div className="menu-right">
                      {menuRight.items && (
                        <Navigation items={menuRight.items} />
                      )}

                      <button
                        className="cart-toggle"
                        onClick={() => toggleCart()}
                      >
                        Cart
                        <span
                          className={cx('cart-toggle--count', {
                            'is-active': cartCount > 0,
                          })}
                        >
                          {cartCount}
                        </span>
                      </button>
                    </div>
                  </div>
                </nav>
              </div>
            </FocusTrap>
          </div>
          <MegaNavigation
            items={[...menuLeft.items, ...menuRight.items]}
            headerHeight={
              isTransparent && observerIsVisible ? headerRect?.height : false
            }
          />
        </div>
      </header>
      <span ref={observerRef} className="header--observer" />
      <MegaNavigationBackdrop />
    </>
  )
}

export default Header
