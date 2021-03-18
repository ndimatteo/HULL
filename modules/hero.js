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
          <div className="hero--bg-desktop">
            <VideoLoop title={video.title} id={video.id} />
          </div>
          <div className="hero--bg-mobile">
            <VideoLoop title={video.title} id={video.id} />
          </div>
        </>
      )}

      {bgType === 'photo' && (
        <>
          {photos?.desktopPhoto && (
            <Photo
              photo={photos.desktopPhoto}
              width={1920}
              // height={1080}
              sizes="100vw"
              layout="fill"
              className="hero--bg-desktop"
            />
          )}
          {photos?.mobilePhoto && (
            <Photo
              photo={photos.mobilePhoto}
              width={800}
              // height={1200}
              sizes="100vw"
              layout="fill"
              className="hero--bg-mobile"
            />
          )}
        </>
      )}
    </section>
  )
}

export default Hero
