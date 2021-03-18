import React from 'react'
import cx from 'classnames'

export const Header1 = props => (
  <h1 style={{ margin: '0', fontSize: '2rem', lineHeight: '1.5' }}>
    {props.children}
  </h1>
)

export const Header2 = props => (
  <h2 style={{ margin: '0', fontSize: '1.75rem', lineHeight: '1.375' }}>
    {props.children}
  </h2>
)

export const Header3 = props => (
  <h3 style={{ margin: '0', fontSize: '1.5rem', lineHeight: '1.25' }}>
    {props.children}
  </h3>
)

export const Header4 = props => (
  <h4 style={{ margin: '0', fontSize: '1rem', lineHeight: '1.15' }}>
    {props.children}
  </h4>
)

export const Button = ({ isButton, styles, children }) => {
  if (!isButton) return children

  return (
    <span
      className={cx('btn', styles?.style, {
        'is-large': styles?.isLarge,
        'is-block': styles?.isBlock
      })}
    >
      {children}
    </span>
  )
}

export const TextAlign = props => (
  <span className={props.alignment}>{props.children}</span>
)
