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
        </div>
      </div>
    </footer>
  )
}

export default Footer
