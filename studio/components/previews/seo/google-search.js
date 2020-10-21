/* eslint-disable react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { assemblePageUrl } from './frontend-utils'
import Truncate from './truncate'
import styles from './google-search.css'

class GoogleSearchResult extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object,
    width: PropTypes.number,
    route: PropTypes.object
  }

  static defaultProps = {
    document: null,
    width: 450
  }

  render() {
    const { document, options, width } = this.props
    const { title, seo, mainImage: openGraphImage } = document
    const url = assemblePageUrl({ document, options })

    return (
      <div className={styles.seoItem}>
        <h3>Google search result preview</h3>
        {title ? (
          <div className={styles.googleWrapper} style={{ width }}>
            <div className={styles.url}>{url}</div>
            <Truncate maxWidth={width} className={styles.title}>
              {title}
            </Truncate>
            {seo && (
              <Truncate maxChars={300} className={styles.description}>
                {seo.description}
              </Truncate>
            )}
          </div>
        ) : (
          <p>Please add a title and fill out your SEO fields first.</p>
        )}
      </div>
    )
  }
}

export default GoogleSearchResult
