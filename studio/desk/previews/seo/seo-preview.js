/* eslint-disable react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import GoogleSearchResult from './google-search'
import TwitterCard from './twitter-card'
import FacebookShare from './facebook-share'

import sanityClient from 'part:@sanity/base/client'

class SeoPreviews extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object
  }

  static defaultProps = {
    document: null
  }

  state = {
    defaultSEO: {}
  }

  constructor() {
    super()
    this.loadData()
  }

  loadData = () => {
    sanityClient
      .fetch(
        `
        *[_type == "seoSettings"][0]{
          metaTitle,
          metaDesc,
          shareTitle,
          shareDesc,
          shareGraphic
        }
      `
      )
      .then(seo => {
        this.setState({
          defaultSEO: seo || {}
        })
      })
  }

  render() {
    const { options } = this.props
    const { displayed } = this.props.document
    const { defaultSEO } = this.state

    return (
      <>
        <GoogleSearchResult
          default={defaultSEO}
          document={displayed}
          options={options}
        />
        <TwitterCard
          default={defaultSEO}
          document={displayed}
          options={options}
        />
        <FacebookShare
          default={defaultSEO}
          document={displayed}
          options={options}
        />
      </>
    )
  }
}

export default SeoPreviews
