import PropTypes from 'prop-types'
import React from 'react'
import { FormBuilderInput, withDocument } from 'part:@sanity/form-builder'

const defaultCondition = () => true

class ConditionalField extends React.Component {
  static propTypes = {
    type: PropTypes.shape({
      title: PropTypes.string,
      options: PropTypes.shape({
        condition: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    level: PropTypes.number,
    focusPath: PropTypes.array,
    onFocus: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
  }

  _inputElement = React.createRef()

  focus() {
    if (this._inputElement.current) {
      this._inputElement.current.focus()
    }
  }

  render() {
    const {
      document,
      value,
      level,
      focusPath,
      onFocus,
      onBlur,
      onChange,
    } = this.props

    const { inputComponent, ...type } = this.props.type
    const condition =
      (type.options && type.options.condition) || defaultCondition

    return condition(document) ? (
      <div style={{ marginBottom: 20 }}>
        <FormBuilderInput
          level={level}
          ref={this._inputElement}
          type={type}
          value={value}
          onChange={onChange}
          path={[]}
          focusPath={focusPath}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
    ) : null
  }
}

export default withDocument(ConditionalField)
