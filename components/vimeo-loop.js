import React, { useRef, useState, useEffect } from 'react'
import Player from '@vimeo/player'
import useInView from 'react-cool-inview'
import cx from 'classnames'

const VideoLoop = ({
  title,
  id,
  width = 16,
  height = 9,
  initialState = false,
  className,
  ...rest
}) => {
  if (!id) return null

  const videoRef = useRef()
  const [iframePlayer, setIframePlayer] = useState(null)
  const { observe, inView } = useInView()

  useEffect(() => {
    if (videoRef.current && iframePlayer === null) {
      setIframePlayer(new Player(videoRef.current))
    }
  }, [videoRef.current])

  useEffect(() => {
    if (iframePlayer) {
      if (inView) {
        iframePlayer.play().catch(() => {})
      } else {
        iframePlayer.pause()
      }
    }
  }, [iframePlayer, inView])

  return (
    <div className={cx('video-loop', className)} {...rest}>
      <iframe
        ref={(node) => {
          observe(node)
          videoRef.current = node
        }}
        title={title}
        src={`https://player.vimeo.com/video/${id}?background=1&autoplay=1&autopause=0&loop=1&muted=1`}
        frameBorder="0"
        allow="autoplay; fullscreen"
        style={{
          height: `${(height / width) * 100}vw`,
          minWidth: `${(width / height) * 100}vh`,
        }}
      ></iframe>
    </div>
  )
}

export default VideoLoop
