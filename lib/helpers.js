import { imageBuilder } from './api'

export function buildSrcSet(image, { sizes, aspect, format }) {
  const srcSetparts = sizes.map((width) => {
    let imgSrc = imageBuilder.image(image).width(Math.round(width))

    if (aspect) {
      imgSrc = imgSrc.height(Math.round(width * aspect))
    }

    if (format) {
      imgSrc = imgSrc.format(format)
    }

    return `${imgSrc.quality(100).url()} ${width}w`
  })

  return srcSetparts.join(',')
}

export function buildSrc(image, { width, height, format }) {
  let imgSrc = imageBuilder.image(image)

  if (width) {
    imgSrc = imgSrc.width(Math.round(width))
  }

  if (height) {
    imgSrc = imgSrc.height(Math.round(height))
  }

  if (format) {
    imgSrc = imgSrc.format(format)
  }

  return imgSrc.quality(100).url()
}

export function sleeper(ms) {
  return function (x) {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms))
  }
}
