import React from 'react'
import Link from 'next/link'

import Navigation from './navigation'
import Icon from './icon'

const Footer = ({ menu, social }) => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer--wrapper">
        <div className="footer--content">
          <nav className="footer-navigation">
            {menu.items && <Navigation menu={menu} />}
          </nav>

          {social.items && (
            <div className="social-nav">
              {social.items.map((link, key) => {
                return (
                  <a
                    key={key}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-nav--link"
                  >
                    <Icon name={link.icon} />
                  </a>
                )
              })}
            </div>
          )}

          <div className="logo">
            <Link href="/" scroll={false}>
              <a className="logo--link" aria-label="Go Home">
                <Icon name="Logo Mark" id="footerLogo" viewBox="0 0 666 430" />
              </a>
            </Link>
          </div>

          <div className="footer--disclaimer">
            <p className="text-xs">
              &copy; {new Date().getFullYear()}. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
