import { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { imageBuilder } from '@lib/sanity'
import Router, { useRouter } from 'next/router'
import queryString from 'query-string'

/*  ------------------------------ */
/*  Generic helper functions
/*  ------------------------------ */

// reference a previous state after update
export function usePrevious(value) {
  const prev = useRef()

  useEffect(() => {
    prev.current = value
  })

  return prev.current
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
export function useAutoplay(callback, delay) {
  const [isRunning, setIsRunning] = useState(false)
  const stop = useCallback(() => setIsRunning(false), [setIsRunning])
  const play = useCallback(() => setIsRunning(true), [setIsRunning])
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (!isRunning) return
    let id = 0

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

// conditionally wrap a component with another
export const ConditionalWrapper = ({ condition, wrapper, children }) => {
  return condition ? wrapper(children) : children
}

// simple debounce function
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

// delay with promise
export function sleeper(ms) {
  return function (x) {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms))
  }
}

// check if value is unique
export const unique = (value, index, self) => {
  return self.indexOf(value) === index
}

// see if an object is found in another array of objects
export function hasObject(recs, vals) {
  if (!recs) return false

  return recs.some(function (obj) {
    for (var x in obj) if (x in vals && obj[x] != vals[x]) return false
    return true
  })
}

// keep number counters within a range
export function clampRange(value, min = 0, max = 1) {
  return value < min ? min : value > max ? max : value
}

// Maps a value to a new range
export function map(value, start1, stop1, start2, stop2) {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2
}

// wrap incremental
export function wrap(index, length) {
  if (index < 0) {
    index = length + (index % length)
  }
  if (index >= length) {
    return index % length
  }
  return index
}

// sort ascending
export function sortAsc(arr, field) {
  return arr.sort(function (a, b) {
    if (a[field] > b[field]) {
      return 1
    }
    if (b[field] > a[field]) {
      return -1
    }
    return 0
  })
}

// sort descending
export function sortDesc(arr, field) {
  return arr.sort(function (a, b) {
    if (a[field] > b[field]) {
      return -1
    }
    if (b[field] > a[field]) {
      return 1
    }
    return 0
  })
}

// convert cents to dollars, optional trailing zeros if round amount
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

// generate all combos from multiple arrays
export function cartesian(...arrays) {
  return [...arrays].reduce(
    (a, b) =>
      a.map((x) => b.map((y) => x.concat(y))).reduce((a, b) => a.concat(b), []),
    [[]]
  )
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
}

export const isBrowser = typeof window !== 'undefined'

export function isMobileSafari() {
  if (!isBrowser) return

  return navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/)
    ? true
    : false
}

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

// update multiple url params easily
export function useParams(fallback) {
  const router = useRouter()
  const currentPath = [].concat(router.query?.slug).join('/')
  const hasQuery = Object.keys(router.query).length
  let currentParams = fallback

  // if query params present, update the current parameters
  if (hasQuery) {
    currentParams = fallback.map((param) =>
      router.query[param.name]
        ? { ...param, value: router.query[param.name] }
        : param
    )
  }

  // update the query params on change
  const setCurrentParams = useCallback(
    (params) => {
      const urlParams = params
        .filter(
          (p) => p.value !== fallback.find((fb) => fb.name === p.name).value
        )
        .reduce((r, { name, value }) => ((r[name] = value?.split(',')), r), {})

      const qs = queryString.stringify(urlParams, {
        arrayFormat: 'comma',
      })

      router.replace(`${currentPath}${qs ? `?${qs}` : ''}`, undefined, {
        shallow: true,
      })
    },
    [router]
  )

  return [currentParams, setCurrentParams]
}

// use a Portal for overlays
export function InPortal({ id, children }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) return null

  return ReactDOM.createPortal(children, document.querySelector(`#${id}`))
}

// restore previous scroll position after page change
export function useScrollRestoration(router, delay) {
  const restorePosition = useRef({})

  const saveScrollPosition = (url, pos) => {
    restorePosition.current = {
      ...restorePosition.current,
      [url]: pos,
    }
  }

  const updateScrollPosition = (url, restore, shouldRestore) => {
    const position = restore.current[url]

    // if we have a saved position and it's a history change, restore position, otherwise set to 0
    setTimeout(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: position && shouldRestore ? position : 0 })
      })
    }, delay + 100)
  }

  useEffect(() => {
    let shouldScrollRestore = false
    window.history.scrollRestoration = 'manual'

    const onBeforeUnload = (event) => {
      saveScrollPosition(router.asPath, window.scrollY)
      delete event['returnValue']
    }

    const onRouteChangeStart = () => {
      saveScrollPosition(router.asPath, window.scrollY)
    }

    const onRouteChangeComplete = (url, { shallow }) => {
      // Bail if we're just changing URL parameters
      if (shallow) return

      updateScrollPosition(url, restorePosition, shouldScrollRestore)

      // reset if we should restore the scroll position
      shouldScrollRestore = false
    }

    // save scroll position on route change
    window.addEventListener('beforeunload', onBeforeUnload)
    Router.events.on('routeChangeStart', onRouteChangeStart)

    // restore scroll position after route change completes
    Router.events.on('routeChangeComplete', onRouteChangeComplete)

    // if it's a history change, set to restore scroll position to "true"
    Router.beforePopState((state) => {
      shouldScrollRestore = true
      state.options.scroll = false
      return true
    })

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      Router.events.off('routeChangeStart', onRouteChangeStart)
      Router.events.off('routeChangeComplete', onRouteChangeComplete)
      Router.beforePopState(() => true)
    }
  }, [])
}

/*  ------------------------------ */
/*  Image helpers
/*  ------------------------------ */

export function buildSrc(image, { width, height, format, quality }) {
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

  return imgSrc.fit('max').auto('format').url()
}

export function buildSrcSet(image, { srcSizes, aspect, format, quality }) {
  const sizes = srcSizes.map((width) => {
    let imgSrc = buildSrc(image, {
      ...{ width },
      height: aspect && Math.round(width * aspect) / 100,
      ...{ format },
      ...{ quality },
    })

    if (format) {
      imgSrc = imgSrc.format(format)
    }

    return `${imgSrc} ${width}w`
  })

  return sizes.join(',')
}
