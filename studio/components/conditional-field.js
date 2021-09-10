import React from 'react'
import PropTypes from 'prop-types'

import { FormBuilderInput } from '@sanity/form-builder/lib/FormBuilderInput'
import { withDocument, withValuePath } from 'part:@sanity/form-builder'

import { Stack } from '@sanity/ui'

import { setIfMissing } from '@sanity/form-builder/PatchEvent'

const isFunction = obj => !!(obj && obj.constructor && obj.call && obj.apply)

class ConditionalField extends React.PureComponent {
  static propTypes = {
    type: PropTypes.shape({
      title: PropTypes.string,
      name: PropTypes.string.isRequired,
      fields: PropTypes.array.isRequired,
      options: PropTypes.shape({
        hidden: PropTypes.func.isRequired
      }).isRequired
    }).isRequired,
    level: PropTypes.number,
    value: PropTypes.shape({
      _type: PropTypes.string
    }),
    onFocus: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
  }

  firstFieldInput = React.createRef()

  state = { showFields: false }

  focus() {
    this.firstFieldInput.current && this.firstFieldInput.current.focus()
  }

  getContext(level = 1) {
    // gets value path from withValuePath HOC, and applies path to document
    // we remove the last 𝑥 elements from the valuePath

    const valuePath = this.props.getValuePath()
    const removeItems = -Math.abs(level)
    return valuePath.length + removeItems <= 0
      ? this.props.document
      : valuePath.slice(0, removeItems).reduce((context, current) => {
          // basic string path
          if (typeof current === 'string') {
            return context[current] || {}
          }

          // object path with key used on arrays
          if (
            typeof current === 'object' &&
            Array.isArray(context) &&
            current._key
          ) {
            return (
              context.filter(
                item => item._key && item._key === current._key
              )[0] || {}
            )
          }
        }, this.props.document)
  }

  handleFieldChange = (field, fieldPatchEvent) => {
    // Whenever the field input emits a patch event, we need to make sure each of the included patches
    // are prefixed with its field name, e.g. going from:
    // {path: [], set: <nextvalue>} to {path: [<fieldName>], set: <nextValue>}
    // and ensure this input's value exists

    const { onChange, type } = this.props
    const event = fieldPatchEvent
      .prefixAll(field.name)
      .prepend(setIfMissing({ _type: type.name }))

    onChange(event)
  }

  handleConditionCheck = async () => {
    const { document, type } = this.props

    const condition =
      (isFunction(type.options.hidden) && type.options.hidden) ||
      function() {
        return true
      }

    const showFields = await condition(document, this.getContext.bind(this))
    this.setState({ showFields })
  }

  async componentDidMount() {
    await this.handleConditionCheck()
  }

  async componentDidUpdate() {
    await this.handleConditionCheck()
  }

  render() {
    const { type, value, level, onFocus, onBlur } = this.props

    if (!this.state.showFields) return <></>

    return (
      <Stack space={[3, 3, 4, 5]}>
        {type.fields.map((field, i) => (
          <div key={i}>
            <FormBuilderInput
              level={level + 1}
              ref={i === 0 ? this.firstFieldInput : null}
              key={field.name}
              type={field.type}
              value={value && value[field.name]}
              onChange={patchEvent => this.handleFieldChange(field, patchEvent)}
              path={[field.name]}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>
        ))}
      </Stack>
    )
  }
}

export default withValuePath(withDocument(ConditionalField))
