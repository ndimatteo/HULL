/* eslint-disable react/no-unused-prop-types, react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from 'part:@sanity/base/client'
import { assemblePageUrl } from './frontend-utils'
import styles from './facebook-share.css'

const builder = imageUrlBuilder(sanityClient)

const urlFor = source => {
  return builder.image(source)
}

class FacebookShare extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object,
    width: PropTypes.number
  }

  static defaultProps = {
    document: null,
    width: 500
  }

  render() {
    const { document, width, options } = this.props
    const { title, seo, mainImage: openGraphImage } = document

    const url = assemblePageUrl({ document, options })
    const websiteUrlWithoutProtocol = url.split('://')[1]

    return (
      <div className={styles.seoItem}>
        <h3>Facebook share</h3>
        {title ? (
          <div className={styles.facebookWrapper} style={{ width }}>
            <div className={styles.facebookImageContainer}>
              {seo && seo.share ? (
                <img
                  className={styles.facebookCardImage}
                  src={urlFor(seo.share)
                    .width(800)
                    .url()}
                />
              ) : (
                <span className={styles.imagePlaceholder} />
              )}
            </div>
            <div className={styles.facebookCardContent}>
              <div className={styles.facebookCardUrl}>
                {websiteUrlWithoutProtocol}
              </div>
              <div className={styles.facebookCardTitle}>
                <a href={url} target="_blank">
                  {title}
                </a>
              </div>
              {seo && (
                <div className={styles.facebookCardDescription}>
                  {seo.description}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>Please add a title and fill out your SEO fields first.</p>
        )}
      </div>
    )
  }
}

export default FacebookShare
