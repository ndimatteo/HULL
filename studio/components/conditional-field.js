import PropTypes from 'prop-types'
import React from 'react'
import Fieldset from 'part:@sanity/components/fieldsets/default'
import { setIfMissing } from 'part:@sanity/form-builder/patch-event'
import {
  FormBuilderInput,
  withDocument,
  withValuePath
} from 'part:@sanity/form-builder'
import fieldStyle from '@sanity/form-builder/lib/inputs/ObjectInput/styles/Field.css'

const isFunction = obj => !!(obj && obj.constructor && obj.call && obj.apply)

/**
 *
 * condition comes from a field in the document schema
 *
 * {
 *   name: 'objectTitle',
 *   title: 'object Title'
 *   type: 'object',
 *   options: {
 *		condition: (document: obj, context: func) => bool
 *	 }
 *   fields : []
 * }
 *
 */

class ConditionalFields extends React.PureComponent {
  static propTypes = {
    type: PropTypes.shape({
      title: PropTypes.string,
      name: PropTypes.string.isRequired,
      fields: PropTypes.array.isRequired,
      options: PropTypes.shape({
        condition: PropTypes.func.isRequired
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

  render() {
    const { document, type, value, level, onFocus, onBlur } = this.props
    const condition =
      (isFunction(type.options.condition) && type.options.condition) ||
      function() {
        return true
      }
    const showFields = !!condition(document, this.getContext.bind(this))

    if (!showFields) return <></>

    return (
      <>
        {type.fields.map((field, i) => (
          // Delegate to the generic FormBuilderInput. It will resolve and insert the actual input component
          // for the given field type
          <div className={fieldStyle.root} key={i} style={{ marginBottom: -1 }}>
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
      </>
    )
  }
}

export default withValuePath(withDocument(ConditionalFields))
