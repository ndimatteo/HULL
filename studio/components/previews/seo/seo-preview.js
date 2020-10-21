/* eslint-disable react/no-multi-comp, react/no-did-mount-set-state, react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import GoogleSearchResult from './google-search'
import TwitterCard from './twitter-card'
import FacebookShare from './facebook-share'

class SeoPreviews extends React.PureComponent {
  static propTypes = {
    document: PropTypes.object
  }

  static defaultProps = {
    document: null
  }

  render() {
    const { options } = this.props
    const { displayed } = this.props.document

    return (
      <>
        <GoogleSearchResult document={displayed} options={options} />
        <TwitterCard document={displayed} options={options} />
        <FacebookShare document={displayed} options={options} />
      </>
    )
  }
}

export default SeoPreviews
