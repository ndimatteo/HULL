import React, { useEffect } from 'react'
import LazyLoad from 'vanilla-lazyload'

import Icon from '../components/icon'
import { buildSrcSet, buildSrc } from '../lib/helpers'

const Events = ({ data }) => {
  const { title, items } = data

  let lazy
  useEffect(() => {
    lazy = new LazyLoad({
      elements_selector: '.event-item--photo img',
      threshold: -100,
      unobserve_entered: true,
      class_loaded: 'is-loaded',
    })

    return () => {
      lazy.destroy()
    }
  }, [])

  return (
    <section className="section">
      {title && <div className="section--title">{title}</div>}
      <div className="events-list">
        {items.map((event, key) => {
          return (
            <div key={key} className="event-item">
              <figure className="event-item--photo">
                <div className="is-aspect is-aspect--landscape">
                  <>
                    {event.photo ? (
                      <picture>
                        <source
                          data-srcset={buildSrcSet(event.photo, {
                            sizes: [400, 600, 800],
                            aspect: 0.5625,
                            format:
                              event.photo.type !== 'image/gif' ? 'webp' : null,
                          })}
                          sizes="(min-width: 1200px) 33.333vw, (min-width: 768px) 50vw, 100vw"
                          type={
                            event.photo.type !== 'image/gif'
                              ? 'image/webp'
                              : null
                          }
                        />

                        <img
                          data-srcset={buildSrcSet(event.photo, {
                            sizes: [400, 600, 800],
                            aspect: 0.5625,
                          })}
                          data-src={buildSrc(event.photo, {
                            width: 800,
                            height: 450,
                          })}
                          sizes="(min-width: 1200px) 33.333vw, (min-width: 768px) 50vw, 100vw"
                          alt={event.photo.alt}
                          className="photo"
                        />
                      </picture>
                    ) : (
                      <>
                        <span className="img-placeholder" />
                      </>
                    )}
                  </>
                  <div className="event-item--watermark">
                    <Icon id={key} name="Logo Mark" />
                  </div>
                </div>
              </figure>
              <div className="event-item--details">
                <h2 className="event-item--title">{event.title}</h2>
                <div className="event-item--desc">
                  <p>{event.description}</p>
                </div>
                <div className="event-item--group">
                  <span className="event-item--date">{event.date}</span>

                  {event.website && (
                    <a
                      href={event.website}
                      className="btn is-accent"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Events
