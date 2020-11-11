import React from 'react'

const VideoLoop = ({ title, id, width = 16, height = 9 }) => {
  return (
    <div className="video-loop">
      <iframe
        title={title}
        src={`https://player.vimeo.com/video/${id}?background=1&autoplay=1&loop=1&byline=0&title=0&portrait=0`}
        frameBorder="0"
        allowFullScreen
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
