import React from 'react'

import MarqueeItem from '../components/marquee'

const Marquee = ({ data = {} }) => {
  const { text, speed, reverse, pausable } = data

  return (
    <MarqueeItem speed={speed} reverse={reverse} pauseOnHover={pausable}>
      {text}
    </MarqueeItem>
  )
}

export default Marquee
