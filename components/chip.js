import React from 'react'
import cx from 'classnames'

const Chip = ({
  avatar,
  label,
  icon,
  title,
  onClick = () => {},
  className,
  children,
}) => {
  if (!children) return null

  const handleClick = () => {
    onClick()
  }

  return (
    <button
      onClick={handleClick}
      aria-label={label}
      title={title}
      className={cx('chip', className)}
    >
      {avatar && <span className="chip--avatar">{icon}</span>}
      <span className="chip--label">{children}</span>
      {icon && <span className="chip--icon">{icon}</span>}
    </button>
  )
}

export default Chip
