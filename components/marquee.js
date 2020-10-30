import React, { useRef, useState, useEffect } from 'react'
import { debounce, usePrevious } from '../lib/helpers'

const Marquee = ({ line, reverse, className }) => {
  const container = useRef(null)
  const inner = useRef(null)
  const content = useRef(null)
  const item = useRef(null)

  const [bounds, setBounds] = useState(false)
  const [reps, setReps] = useState(false)
  const previousReps = usePrevious(reps)
  const [isRendered, setIsRendered] = useState(false)

  // set bounds after refs exist
  useEffect(() => {
    console.log('STEP 1: setBounds triggered by refs')
    setInstanceBounds()
  }, [container, content])

  // calculate clones
  useEffect(() => {
    if (bounds) {
      console.log('STEP 2: calculateReps triggered by [bounds]')
      calculateReps()
    }
  }, [bounds])

  // build clones
  useEffect(() => {
    // set initial render
    if (reps && !isRendered) {
      console.log('STEP 3A: initial cloneItems')
      cloneItem(reps)
    }

    // re-render if clone count is different than before
    if (isRendered) {
      console.log('STEP 3B: re-render happened')
      if (reps !== previousReps) {
        console.log('STEP 3C: cloneItems triggered by mismatched reps')
        cloneItem(reps)
      }
    }
  }, [reps])

  useEffect(() => {
    console.log(`STEP 4: reset bounds triggered by [isRendered]: ${isRendered}`)
    setInstanceBounds()
  }, [isRendered])

  // setup resize listener
  useEffect(() => {
    const resizeBounds = debounce(setInstanceBounds, 400)

    window.addEventListener('resize', resizeBounds)

    return () => {
      window.removeEventListener('resize', resizeBounds)
    }
  }, [])

  // determine item sizes
  const setInstanceBounds = () => {
    setTimeout(() => {
      if (container.current && item.current) {
        const containerBounds = container.current.getBoundingClientRect()
        const contentBounds = content.current.getBoundingClientRect()
        const itemBounds = item.current.getBoundingClientRect()

        setBounds({
          container: containerBounds,
          content: contentBounds,
          item: itemBounds,
        })
      }
    }, 100)
  }

  // determine how many items to duplicate
  const calculateReps = () => {
    const repetitions = bounds.container.width / bounds.item.width
    setReps(Math.ceil(repetitions))
  }

  // clone function
  const cloneItem = (amount) => {
    // remove duplicates
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
      setIsRendered(true)
    }
  }

  return (
    <div
      ref={container}
      className={`marquee${isRendered ? ' is-running' : ''}${
        reverse ? ' is-reversed' : ''
      }${className ? ` ${className}` : ''}`}
    >
      <div
        ref={inner}
        className="marquee--inner"
        style={{
          animationDuration: `${
            isRendered && bounds
              ? Math.ceil((bounds.content.width / 20) * 0.5)
              : 0
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
