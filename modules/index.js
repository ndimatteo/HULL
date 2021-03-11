import React from 'react'
import dynamic from 'next/dynamic'

const Grid = dynamic(() => import('./grid'))
const Marquee = dynamic(() => import('./marquee'))

export const Module = ({ module }) => {
  const type = module._type

  switch (type) {
    case 'grid':
      return <Grid data={module} />
    case 'marquee':
      return <Marquee data={module} />
    default:
      return null
  }
}
