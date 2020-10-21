import React from 'react'
import PropTypes from 'prop-types'

import styles from './notice.css'

export default class Notice extends React.Component {
  static propTypes = {
    type: PropTypes.shape({
      title: PropTypes.string,
      name: PropTypes.string,
    }).isRequired,
    value: PropTypes.shape({
      _type: PropTypes.string,
    }),
  }

  focus() {
    return false
  }

  render() {
    const { type } = this.props

    return (
      <div
        className={styles.notice}
        dangerouslySetInnerHTML={{ __html: type.value }}
      />
    )
  }
}
