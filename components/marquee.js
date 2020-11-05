import React, { useRef, useState, useEffect } from 'react'
import { debounce, usePrevious } from '../lib/helpers'

const Marquee = ({ line, speed = 0.5, reverse, className }) => {
  const container = useRef(null)
  const inner = useRef(null)
  const content = useRef(null)
  const item = useRef(null)

  const [bounds, setBounds] = useState(false)
  const previousBounds = usePrevious(bounds)

  const [reps, setReps] = useState(false)
  const previousReps = usePrevious(reps)

  const [isRendered, setIsRendered] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // set bounds after refs exist
  useEffect(() => {
    setInstanceBounds()
  }, [container, content, item])

  // calculate reps after bounds update
  useEffect(() => {
    // calculate a re-render
    if (previousBounds) {
      // no change? Just be done then!
      if (previousBounds.container.width === bounds.container.width) {
        setIsReady(true)
        setIsRendered(true)

        // initiate re-render
      } else {
        setIsRendered(false)
        setIsReady(false)
        calculateReps()
      }
    }
    // calculate initial reps
    else if (bounds) {
      calculateReps()
    }
  }, [bounds])

  // build clones if more/less than before or it hasn't been rendered before
  useEffect(() => {
    if (previousReps) {
      if (reps !== previousReps) {
        cloneItem(reps)
      }
    } else if (reps && !isRendered) {
      cloneItem(reps)
    }
  }, [reps])

  // recalculate widths after render, but before it's "ready"
  useEffect(() => {
    if (isRendered && !isReady) {
      setInstanceBounds()
    }
  }, [isRendered])

  // setup resize listener
  useEffect(() => {
    const resizeBounds = debounce(() => {
      setInstanceBounds()
    }, 400)

    window.addEventListener('resize', resizeBounds)

    return () => {
      window.removeEventListener('resize', resizeBounds)
    }
  }, [])

  // set marquee bounds
  const setInstanceBounds = () => {
    if (container.current && content.current && item.current) {
      setTimeout(() => {
        const containerBounds = container.current.getBoundingClientRect()
        const contentBounds = content.current.getBoundingClientRect()
        const itemBounds = item.current.getBoundingClientRect()

        setBounds({
          container: containerBounds,
          content: contentBounds,
          item: itemBounds,
        })
      }, 100)
    }
  }

  // determine how many items to clone
  const calculateReps = () => {
    const repetitions = Math.ceil(bounds.container.width / bounds.item.width)

    // no change? Just be done then!
    if (repetitions === previousReps) {
      setIsRendered(true)
      setIsReady(true)
    } else {
      setReps(repetitions)
    }
  }

  // clone items
  const cloneItem = (amount) => {
    // remove previous duplicates
    inner.current.querySelectorAll('.is-clone').forEach((el) => el.remove())

    // items
    if (amount) {
      const clones = [...Array(amount)]
      clones.map(() => {
        const clone = item.current.cloneNode(true)
        clone.setAttribute('aria-hidden', 'true')
        clone.setAttribute('role', 'presentation')
        clone.classList.add('is-clone')
        content.current.appendChild(clone)
        return clone
      })

      // container
      const contentClone = content.current.cloneNode(true)
      contentClone.setAttribute('aria-hidden', 'true')
      contentClone.setAttribute('role', 'presentation')
      contentClone.classList.add('is-clone')
      inner.current.appendChild(contentClone)

      // done rendering clones
      setIsRendered(true)
    }
  }

  return (
    <div
      ref={container}
      className={`marquee${isReady ? ' is-ready' : ''}${
        reverse ? ' is-reversed' : ''
      }${className ? ` ${className}` : ''}`}
    >
      <div
        ref={inner}
        className="marquee--inner"
        style={{
          animationDuration: `${
            isReady ? Math.ceil((bounds.content.width / 24) * speed) : 0
          }s`,
        }}
      >
        <div ref={content} className="marquee--content">
          <div ref={item} className="marquee--item">
            <span>{line} </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Marquee
