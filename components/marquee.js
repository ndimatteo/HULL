import React, { useEffect } from 'react'
import Marquee3k from 'marquee3000'

const Marquee = ({ line, speed = '0.5', reverse, className }) => {
  useEffect(() => {
    Marquee3k.init()
  }, [])

  return (
    <div className={`marquee${className ? ` ${className}` : ''}`}>
      <div className="marquee3k" data-speed={speed} data-reverse={reverse}>
        <span>{line}</span>
      </div>
    </div>
  )
}

export default Marquee
