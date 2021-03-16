import React, { useRef, useState, useEffect } from 'react'

export default function Marqy({
  speed = 0.5,
  direction = 'left',
  pauseOnHover,
  children,
  ...rest
}) {
  const [reps, setReps] = useState(1)

  const container = useRef()
  const containerWidth = useWidth(container)

  const item = useRef()
  const itemWidth = useWidth(item)

  useEffect(() => {
    if (containerWidth && itemWidth) {
      setReps(Math.ceil(containerWidth / itemWidth))
    }
  }, [containerWidth, itemWidth])

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
                  ((itemWidth ?? 0) * reps) / (100 * speed)
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

function useWidth(ref) {
  const [width, setWidth] = useState(null)

  useEffect(() => {
    if (!ref?.current) return

    const resizeObserverInstance = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width)
      }
    })

    resizeObserverInstance.observe(ref.current)

    return () => {
      if (!ref?.current) return
      resizeObserverInstance.unobserve(ref.current)
    }
  }, [ref])

  return width
}
