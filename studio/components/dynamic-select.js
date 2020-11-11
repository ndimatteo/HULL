import React from 'react'
import Select from 'part:@sanity/components/selects/default'
import FormField from 'part:@sanity/components/formfields/default'
import { withDocument } from 'part:@sanity/form-builder'
import PatchEvent, { set } from 'part:@sanity/form-builder/patch-event'

const DynamicSelect = React.forwardRef((props, ref) => {
  const { document, onChange, type, value } = props
  const { title, description, level, options } = type

  const selectOptions = document[options.fromField].map(opt => ({
    title: opt[options.fromFieldData.title].toString(),
    value: opt[options.fromFieldData.value].toString()
  }))

  const currentItem = selectOptions.find(opt => opt.value === value)

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
