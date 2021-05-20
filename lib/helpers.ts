import React, { useCallback, useEffect, useRef, useState } from 'react'
import { imageBuilder } from '@/lib/sanity'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

/*  ------------------------------ */
/*  Generic helper functions
/*  ------------------------------ */

// reference a previous state after update
export function usePrevious(value: any) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

// client-side mount
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}

// autoplay looper
export function useAutoplay(callback: (...args: any) => any, delay: number) {
  const [isRunning, setIsRunning] = useState(false)
  const stop = useCallback(() => setIsRunning(false), [setIsRunning])
  const play = useCallback(() => setIsRunning(true), [setIsRunning])
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (!isRunning) return
    let id: NodeJS.Timeout

    const tick = () => {
      if (!isRunning) return clearTimeout(id)
      savedCallback.current()
      requestAnimationFrame(() => (id = setTimeout(tick, delay)))
    }
    requestAnimationFrame(() => (id = setTimeout(tick, delay)))

    return () => {
      if (id) clearTimeout(id)
      stop()
    }
  }, [isRunning, delay, stop])

  return { play, stop }
}

// simple debounce function
export function debounce(fn: (...args: any) => any, ms: number) {
  let timer: NodeJS.Timeout | null
  return (_: any) => {
    timer && clearTimeout(timer)
    timer = setTimeout((_) => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  }
}

// delay with promise
export function sleeper(ms: number) {
  return function (x: any) {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms))
  }
}

// check if value is unique
export const unique = (value: any, index: number, self: any[]) => {
  return self.indexOf(value) === index
}

// see if an object is found in another array of objects
export function hasObject(recs: any[] | undefined, vals: any) {
  if (!recs) return false

  return recs.some(function (obj: any) {
    for (var x in obj) if (x in vals && obj[x] != vals[x]) return false
    return true
  })
}

// keep number counters within a range
export function clampRange(value: number, min = 0, max = 1) {
  return value < min ? min : value > max ? max : value
}

// wrap incremental
export function wrap(index: number, length: number) {
  if (index < 0) {
    index = length + (index % length)
  }
  if (index >= length) {
    return index % length
  }
  return index
}

// convert cents to dollars, optional trailing zeros if round amount
export function centsToPrice(cents: number, trailing: boolean = false) {
  const price = cents / 100

  if (!trailing && price % 1 === 0) {
    return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  } else {
    const parts = price.toFixed(2).split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return `${parts.join('.')}`
  }
}

/*  ------------------------------ */
/*  Client helpers
/*  ------------------------------ */

export const Keys = {
  ENTER: 13,
  SPACE: 32,
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
  RETURN: 13,
} as const

export const isBrowser = typeof window !== 'undefined'

export function useWindowSize() {
  function getSize() {
    return {
      width: isBrowser ? window.innerWidth : 0,
      height: isBrowser ? window.innerHeight : 0,
    }
  }

  const [windowSize, setWindowSize] = useState(getSize)

  useEffect(() => {
    if (!isBrowser) return

    function handleResize() {
      setWindowSize(getSize())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return windowSize
}

/*  ------------------------------ */
/*  Image helpers
/*  ------------------------------ */

type ImageFormat = 'jpg' | 'pjpg' | 'png' | 'webp'
type BuildOpts = {
  width?: number
  height?: number
  format?: ImageFormat
  quality?: number
}

export function buildSrc(
  image: SanityImageSource,
  { width, height, format, quality }: BuildOpts
) {
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

  if (quality) {
    imgSrc = imgSrc.quality(quality)
  }

  // Bail if asset isn't found
  // @ts-ignore TODO: figure out why this type is incorrect
  if (!imgSrc.options.source?.asset?._ref) {
    return
  }

  return imgSrc.fit('max').auto('format').url()
}

type SrcBuildOpts = {
  srcSizes: number[]
  aspect?: number
  format?: ImageFormat
  quality?: number
}

export function buildSrcSet(
  image: SanityImageSource,
  { srcSizes, aspect, format, quality }: SrcBuildOpts
) {
  const sizes = srcSizes.map((width) => {
    let imgSrc = buildSrc(image, {
      ...{ width },
      height: aspect && Math.round(width * aspect) / 100,
      ...{ format },
      ...{ quality },
    })

    // if (format) {
    //   imgSrc = imgSrc?.format(format)
    // }

    return `${imgSrc} ${width}w`
  })

  return sizes.join(',')
}
