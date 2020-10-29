import React, { useRef, useState, useEffect } from 'react'
import { debounce, usePrevious } from '../lib/helpers'

const Marquee = ({ line, reverse, className }) => {
  const container = useRef(null)
  const inner = useRef(null)
  const content = useRef(null)
  const item = useRef(null)
  const [bounds, setBounds] = useState(false)
  const [reps, setReps] = useState(0)
  const previousReps = usePrevious(reps)
  const [isRendered, setIsRendered] = useState(false)

  // set bounds after refs exist
  useEffect(() => {
    setInstanceBounds()
  }, [container, content])

  // calculate clones
  useEffect(() => {
    if (bounds) {
      calculateReps()
    }
  }, [bounds])

  // build clones
  useEffect(() => {
    // set initial render
    if (reps && !isRendered) {
      cloneItem(reps)
    }

    // re-render if clone count is different than before
    if (isRendered) {
      if (reps !== previousReps) {
        cloneItem(reps)
      }
    }
  }, [reps])

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
        const itemBounds = item.current.getBoundingClientRect()

        setBounds({
          container: containerBounds,
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
      className={`marquee${reverse ? ' is-reversed' : ''}${
        className ? ` ${className}` : ''
      }`}
    >
      <div
        ref={inner}
        className="marquee--inner"
        style={{
          animationDuration: `${
            bounds
              ? Math.ceil((bounds.item.width + bounds.container.width) / 50)
              : 30
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
