import { useEffect, useRef } from 'react'
import { imageBuilder } from './api'

export const isBrowser = typeof window !== 'undefined'

export const unique = (value, index, self) => {
  return self.indexOf(value) === index
}

export function buildSrcSet(image, { sizes, aspect, format }) {
  const srcSetparts = sizes.map((width) => {
    let imgSrc = imageBuilder.image(image).width(Math.round(width))

    if (aspect) {
      imgSrc = imgSrc.height(Math.round(width * aspect))
    }

    if (format) {
      imgSrc = imgSrc.format(format)
    }

    return `${imgSrc.quality(100).url()} ${width}w`
  })

  return srcSetparts.join(',')
}

export function buildSrc(image, { width, height, format }) {
  let imgSrc = imageBuilder.image(image)

  if (width) {
    imgSrc = imgSrc.width(Math.round(width))
  }

  if (height) {
    imgSrc = imgSrc.height(Math.round(height))
  }

  if (format) {
    imgSrc = imgSrc.format(format)
  }

  return imgSrc.quality(100).url()
}

export function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export function debounce(fn, ms) {
  let timer
  return (_) => {
    clearTimeout(timer)
    timer = setTimeout((_) => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  }
}

export function sleeper(ms) {
  return function (x) {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms))
  }
}

export function hasObject(recs, vals) {
  return recs.some(function (obj) {
    for (var x in obj) if (x in vals && obj[x] != vals[x]) return false
    return true
  })
}

export function centsToPrice(cents, trailing = false) {
  const price = cents / 100

  if (!trailing && price % 1 === 0) {
    return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  } else {
    const parts = price.toFixed(2).split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return `${parts.join('.')}`
  }
}

// export function clampRange(value, [min, max]) {
//   return Math.min(Math.max(value, min), max)
// }

export function clampRange(value, min = 0, max = 1) {
  return value < min ? min : value > max ? max : value
}
