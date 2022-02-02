/* eslint-disable react/no-unused-prop-types, react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from 'part:@sanity/base/client'
import { assemblePageUrl, replaceTemplateTags } from '../../../lib/helpers'
import styles from './seo-preview.css'

const builder = imageUrlBuilder(sanityClient)

const urlFor = source => {
  return builder.image(source)
}

class FacebookShare extends React.PureComponent {
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
    const { default: defaultSEO, document, width } = this.props
    const { seo } = document

    const templateTags = [
      {
        tag: '{{page_title}}',
        value: document.title
      },
      {
        tag: '{{site_title}}',
        value: defaultSEO?.siteTitle
      }
    ]

    const url = assemblePageUrl({ document, domain: defaultSEO?.siteURL })
    const websiteUrlWithoutProtocol = url.split('://')[1]

    const shareTitle = replaceTemplateTags(
      seo?.shareTitle || defaultSEO?.shareTitle,
      templateTags
    )
    const shareDesc = seo?.shareDesc || defaultSEO?.shareDesc
    const shareGraphic = seo?.shareGraphic || defaultSEO?.shareGraphic

    return (
      <div className={styles.seoItem}>
        <h3 className={styles.seoItemTitle}>Facebook share</h3>
        <div className={styles.seoItemContent}>
          {shareTitle ? (
            <div className={styles.seoItemCard}>
              <div className={styles.facebookWrapper} style={{ width }}>
                <div className={styles.facebookImageContainer}>
                  {shareGraphic ? (
                    <img
                      className={styles.facebookCardImage}
                      src={urlFor(shareGraphic.asset)
                        .width(1200)
                        .height(630)
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
                      {shareTitle}
                    </a>
                  </div>
                  {shareDesc && (
                    <div className={styles.facebookCardDescription}>
                      {shareDesc}
                    </div>
                  )}
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

export default FacebookShare
