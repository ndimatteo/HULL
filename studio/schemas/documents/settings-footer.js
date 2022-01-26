import { PaperPlaneTilt, List, GlobeSimple } from 'phosphor-react'

export default {
  title: 'Footer Settings',
  name: 'footerSettings',
  type: 'document',
  groups: [
    {
      title: 'Block 1',
      name: 'column1',
      icon: PaperPlaneTilt,
      default: true
    },
    {
      title: 'Block 2',
      name: 'column2',
      icon: List
    },
    {
      title: 'Block 3',
      name: 'column3',
      icon: List
    },
    {
      title: 'Block 4',
      name: 'column4',
      icon: GlobeSimple
    }
  ],
  fields: [
    {
      title: 'Block Title',
      name: 'blockTitle1',
      type: 'string',
      group: 'column1'
    },
    {
      title: 'Newsletter',
      name: 'newsletter',
      type: 'newsletter',
      group: 'column1'
    },
    {
      title: 'Block Title',
      name: 'blockTitle2',
      type: 'string',
      group: 'column2'
    },
    {
      title: 'Block Menu',
      name: 'blockMenu2',
      type: 'reference',
      to: [{ type: 'menu' }],
      group: 'column2'
    },
    {
      title: 'Block Title',
      name: 'blockTitle3',
      type: 'string',
      group: 'column3'
    },
    {
      title: 'Block Menu',
      name: 'blockMenu3',
      type: 'reference',
      to: [{ type: 'menu' }],
      group: 'column3'
    },
    {
      title: 'Block Title',
      name: 'blockTitle4',
      type: 'string',
      group: 'column4'
    },
    {
      title: 'Social Links',
      name: 'social',
      type: 'array',
      of: [{ type: 'socialLink' }],
      group: 'column4'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Footer Settings'
      }
    }
  }
}
