/* eslint-disable react/no-unused-prop-types, react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from 'part:@sanity/base/client'
import { assemblePageUrl } from './frontend-utils'
import styles from './seo-preview.css'

const builder = imageUrlBuilder(sanityClient)

const urlFor = source => {
  return builder.image(source)
}

const author = {
  name: 'Nick DiMatteo',
  handle: 'ndimatteo',
  image:
    'https://pbs.twimg.com/profile_images/1174691001119756288/TbJJ6_2I_400x400.jpg'
}

class TwitterCard extends React.PureComponent {
  static propTypes = {
    default: PropTypes.object,
    document: PropTypes.object,
    width: PropTypes.number
  }

  static defaultProps = {
    default: null,
    document: null,
    width: 580
  }

  render() {
    const { default: defaultSEO, document, options, width } = this.props
    const { seo } = document

    const url = assemblePageUrl({ document, options })
    const websiteUrlWithoutProtocol = url.split('://')[1]

    const shareTitle = seo?.shareTitle || defaultSEO?.shareTitle
    const shareDesc = seo?.shareDesc || defaultSEO?.shareDesc
    const shareGraphic = seo?.shareGraphic || defaultSEO?.shareGraphic

    return (
      <div className={styles.seoItem}>
        <h3 className={styles.seoItemTitle}>Twitter card preview</h3>
        <div className={styles.seoItemContent}>
          {shareTitle ? (
            <div className={styles.seoItemCard}>
              <div className={styles.tweetWrapper} style={{ width }}>
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

                <div className={styles.tweetText}>
                  <p>Tweet about this...</p>
                </div>
                <div className={styles.tweetUrlWrapper}>
                  <div className={styles.tweetCardPreview}>
                    <div className={styles.tweetCardImage}>
                      {shareGraphic ? (
                        <img
                          src={urlFor(shareGraphic.asset)
                            .width(1200)
                            .height(630)
                            .url()}
                        />
                      ) : (
                        <span className={styles.imagePlaceholder} />
                      )}
                    </div>
                    <div className={styles.tweetCardContent}>
                      <h2 className={styles.tweetCardTitle}>{shareTitle}</h2>
                      {shareDesc && (
                        <div className={styles.tweetCardDescription}>
                          {shareDesc}
                        </div>
                      )}
                      <div className={styles.tweetCardDestination}>
                        <span className={styles.tweetCardIcon}>
                          <svg viewBox="0 0 24 24">
                            <g>
                              <path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z" />
                              <path d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z" />
                            </g>
                          </svg>
                        </span>
                        {websiteUrlWithoutProtocol}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>Please add a title and fill out your SEO fields first.</p>
          )}
        </div>
      </div>
    )
  }
}

export default TwitterCard
