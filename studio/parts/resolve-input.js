import DynamicSelect from '../components/dynamic-select'

export default function resolveInput(type) {
  if (
    type.name === 'string' &&
    type.options &&
    type.options.from &&
    type.options.fromData
  ) {
    return DynamicSelect
  }
}
