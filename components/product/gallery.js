import React from 'react'

import Carousel from '../carousel'
import Photo from '../photo'

const ProductGallery = ({ photos }) => {
  const id = photos.map((p) => p.id).join('')

  console.log(id)

  return (
    <div key={id} className="product--gallery">
      {photos && (
        <Carousel hasArrows thumbs={photos}>
          {photos.map((photo, key) => (
            <Photo
              key={key}
              photo={photo}
              srcsetSizes={[500, 800, 1200, 1800]}
              sizes="(min-width: 768px) 50vw, 100vw"
              aspect="portrait"
              width={1200}
              className="carousel--photo"
            />
          ))}
        </Carousel>
      )}
    </div>
  )
}

export default ProductGallery
