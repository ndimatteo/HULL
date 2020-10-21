/* eslint-disable react/no-unused-prop-types, react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from 'part:@sanity/base/client'
import { assemblePageUrl } from './frontend-utils'
import styles from './twitter-card.css'

const builder = imageUrlBuilder(sanityClient)

const urlFor = source => {
  return builder.image(source)
}

const author = {
  name: 'Sanity.io',
  handle: 'sanity_io',
  image:
    'https://pbs.twimg.com/profile_images/1135907399582199809/7uZ5d2to_400x400.jpg'
}

class TwitterCard extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object,
    width: PropTypes.number,
    route: PropTypes.object
  }

  static defaultProps = {
    document: null,
    width: 500
  }

  render() {
    const { document, width, options } = this.props
    const { title, seo, mainImage } = document
    const url = assemblePageUrl({ document, options })
    const websiteUrlWithoutProtocol = url.split('://')[1]
    return (
      <div className={styles.seoItem}>
        <h3>Twitter card preview</h3>
        {title ? (
          <div className={styles.tweetWrapper} style={{ width }}>
            {author && (
              <div className={styles.tweetAuthor}>
                <img
                  className={styles.tweetAuthorAvatar}
                  src={
                    author && typeof author.image === 'object'
                      ? urlFor(author.image)
                          .width(300)
                          .url()
                      : author.image
                  }
                />
                <span className={styles.tweetAuthorName}>{author.name}</span>
                <span className={styles.tweetAuthorHandle}>
                  @{author.handle}
                </span>
              </div>
            )}

            <div className={styles.tweetText}>
              <p>Tweet about this...</p>
            </div>
            <a href={url} className={styles.tweetUrlWrapper}>
              <div className={styles.tweetCardPreview}>
                <div className={styles.tweetCardImage}>
                  {seo && seo.share ? (
                    <img
                      src={urlFor(seo.share)
                        .width(800)
                        .url()}
                    />
                  ) : (
                    <span className={styles.imagePlaceholder} />
                  )}
                </div>
                <div className={styles.tweetCardContent}>
                  <h2 className={styles.tweetCardTitle}>{title}</h2>
                  {seo && (
                    <div className={styles.tweetCardDescription}>
                      {seo.description}
                    </div>
                  )}
                  <div className={styles.tweetCardDestination}>
                    {websiteUrlWithoutProtocol}
                  </div>
                </div>
              </div>
            </a>
          </div>
        ) : (
          <p>Please add a title and fill out your SEO fields first.</p>
        )}
      </div>
    )
  }
}

export default TwitterCard
