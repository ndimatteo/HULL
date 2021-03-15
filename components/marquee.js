import React, { useRef, useState, useEffect } from 'react'
import { useRect } from '@reach/rect'

export default function Marqy({
  speed = 0.5,
  direction = 'left',
  pauseOnHover,
  children,
  ...rest
}) {
  const [observe, setObserve] = useState({ container: true, item: true })
  const [widths, setWidths] = useState({ container: null, item: null })
  const previousWidths = usePrevious(widths)
  const [reps, setReps] = useState(1)

  const container = useRef()
  const containerRect = useRect(container, { observe: observe.container })
  const item = useRef()
  const itemRect = useRect(item, { observe: observe.item })

  // check that we are receiving rects from our refs, then set the widths and reps state
  useEffect(() => {
    if (containerRect?.width && itemRect?.width) {
      setWidths({
        container: containerRect.width,
        item: itemRect.width,
      })
      setReps(Math.ceil(containerRect.width / itemRect.width))
    }
  }, [containerRect, itemRect])

  // 1. when our widths states are updated, let's check if they are matching the previous rect state
  // 2. if they are the same, we can stop observing our refs
  useEffect(() => {
    if (widths.container && widths.item) {
      setObserve({
        container: widths.container !== previousWidths.container,
        item: widths.item !== previousWidths.item,
      })
    }
  }, [widths])

  // re-observe our refs when the container ref changes size, so we can recalculate widths and reps
  useEffect(() => {
    if (!container?.current) return
    const resizeObserverInstance = new ResizeObserver(() => setObserve(true))
    resizeObserverInstance.observe(container.current)
    return () => {
      if (!container?.current) return
      resizeObserverInstance.unobserve(container.current)
    }
  }, [container])

  return (
    <div
      ref={container}
      data-marquee=""
      data-direction={direction}
      data-pause-on-hover={pauseOnHover ? '' : null}
      {...rest}
    >
      <div data-marquee-inner="">
        {new Array(2).fill().map((_, clone) => {
          return (
            <div
              key={clone}
              data-marquee-content=""
              style={{
                animationDuration: `${
                  ((widths.item ?? 0) * reps) / (100 * speed)
                }s`,
              }}
            >
              {new Array(reps).fill().map((_, rep) => {
                const isFirstItem = clone === 0 && rep === 0
                return (
                  <div
                    key={rep}
                    ref={isFirstItem ? item : null}
                    aria-hidden={!isFirstItem || null}
                    data-marquee-item=""
                  >
                    {children}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// reference a previous state after update
function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
