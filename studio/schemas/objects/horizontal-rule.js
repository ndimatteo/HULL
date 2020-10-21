import { FiMinus } from 'react-icons/fi'
import HR from '../../components/hr'

export default {
  title: 'Horizontal Rule',
  name: 'horizontalRule',
  type: 'object',
  icon: FiMinus,
  fields: [
    {
      type: 'string',
      name: 'horizontalRule',
      inputComponent: HR
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Horizontal Rule'
      }
    }
  }
}
