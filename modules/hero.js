import React from 'react'
import BlockContent from '@sanity/block-content-to-react'
import { serializers } from '@lib/serializers'

import VideoLoop from '@components/video-loop'
import Photo from '@components/photo'

const Hero = ({ data = {} }) => {
  const { content, bgType, photos, video } = data

  return (
    <section className="hero">
      {content && (
        <div className="hero--overlay">
          <div className="hero--content">
            <BlockContent
              renderContainerOnSingleChild
              className="rc"
              blocks={content}
              serializers={serializers}
            />
          </div>
        </div>
      )}

      {bgType === 'video' && (
        <>
          <div className="hero--bg is-desktop">
            <VideoLoop title={video.title} id={video.id} />
          </div>
          <div className="hero--bg is-mobile">
            <VideoLoop title={video.title} id={video.id} />
          </div>
        </>
      )}

      {bgType === 'photo' && (
        <>
          {photos?.desktopPhoto && (
            <Photo
              photo={photos.desktopPhoto}
              width={1600}
              srcSizes={[800, 1000, 1200, 1600]}
              sizes="100vw"
              layout="fill"
              className="hero--bg is-desktop"
            />
          )}
          {photos?.mobilePhoto && (
            <Photo
              photo={photos.mobilePhoto}
              width={800}
              sizes="100vw"
              layout="fill"
              className="hero--bg is-mobile"
            />
          )}
        </>
      )}
    </section>
  )
}

export default Hero
