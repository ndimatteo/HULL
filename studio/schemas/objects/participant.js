export default {
  title: 'Participant',
  name: 'participant',
  type: 'object',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string'
    },
    {
      title: 'Nickname',
      name: 'nickname',
      type: 'string'
    }
  ],
  preview: {
    select: {
      name: 'name',
      nickname: 'nickname'
    },
    prepare({ name, nickname }) {
      return {
        title: `${name} (${nickname})`
      }
    }
  }
}
