import React from 'react'
import Select from 'part:@sanity/components/selects/default'
import FormField from 'part:@sanity/components/formfields/default'
import { withDocument } from 'part:@sanity/form-builder'
import PatchEvent, { set } from 'part:@sanity/form-builder/patch-event'

const DynamicSelect = React.forwardRef((props, ref) => {
  const { document, onChange, type, value } = props
  const { title, description, level, options } = type // details about the field

  let dynamicOptions = []

  // are we joining from a subfield?
  if (options.joinWith) {
    /*  ------------------------------------------------------------ */
    /*  1. Map over the main array field (from)
    /*  2. Map over the subfield (joinWith)
    /*  3. build our array object
    /*    - Use the main array field title (fromData -> title)
    /*    - store that with the subfield value (joinWith), 
    /*      or the subfield title and value (joinWith -> title)
    /*  ------------------------------------------------------------ */

    // bail if we can't find the from field
    if (!(options.from in document)) return null

    dynamicOptions = document[options.from]
      .map(opt => {
        // bail if we can't find the subfield
        if (!(options.joinWith in opt)) return null

        // if a subfield is a complex array
        if (options.joinWithData) {
          return opt[options.joinWith].map(jOpt => {
            return {
              title: `${opt[options.fromData.title]} - ${
                jOpt[options.joinWithData.title]
              }`,
              value: `${opt[options.fromData.title]}:${
                jOpt[options.joinWithData.value]
              }`
            }
          })
        } else {
          return opt[options.joinWith].map(val => {
            return {
              title: `${opt[options.fromData.title]} - ${val}`,
              value: `${opt[options.fromData.title]}:${val}`
            }
          })
        }
      })
      .flat(1)
      .filter(x => x !== null)

    // Map basic field array data
  } else {
    // bail if we can't find the from field
    if (!(options.from in document)) return null

    // map over the field to build our list of options
    dynamicOptions = document[options.from].map(opt => ({
      title: opt[options.fromData.title].toString(),
      value: opt[options.fromData.value].toString()
    }))
  }

  // Let's make sure we include existing "list" values
  const selectOptions = [
    ...(options.list ? options.list : [{}]),
    ...dynamicOptions
  ]

  // find our currently active value
  const currentItem = selectOptions.find(opt => opt.value === value)

  // Save the new value on change
  const handleCustomFieldChange = option => {
    onChange(PatchEvent.from(set(option.value.toString())))
  }

  return (
    <FormField
      label={title}
      level={level}
      legend={title}
      description={description}
    >
      <Select
        ref={ref}
        items={selectOptions}
        onChange={evt => handleCustomFieldChange(evt)}
        value={currentItem}
      />
    </FormField>
  )
})

export default withDocument(DynamicSelect)
