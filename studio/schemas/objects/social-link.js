import {
  FaApple,
  FaFacebookF,
  FaInstagram,
  FaSoundcloud,
  FaSpotify,
  FaTwitter,
  FaYoutube
} from 'react-icons/fa'

const getIcon = icon => {
  switch (icon) {
    case 'Apple':
      return FaApple
    case 'Facebook':
      return FaFacebookF
    case 'Instagram':
      return FaInstagram
    case 'Soundcloud':
      return FaSoundcloud
    case 'Spotify':
      return FaSpotify
    case 'Twitter':
      return FaTwitter
    case 'YouTube':
      return FaYoutube
    default:
      return
  }
}

export default {
  title: 'Social Link',
  name: 'socialLink',
  type: 'object',
  options: {
    columns: 2,
    collapsible: false
  },
  fields: [
    {
      title: 'Icon',
      name: 'icon',
      type: 'string',
      options: {
        list: [
          { title: 'Apple', value: 'Apple' },
          { title: 'Facebook', value: 'Facebook' },
          { title: 'Instagram', value: 'Instagram' },
          { title: 'Soundcloud', value: 'Soundcloud' },
          { title: 'Spotify', value: 'Spotify' },
          { title: 'Twitter', value: 'Twitter' },
          { title: 'YouTube', value: 'YouTube' }
        ]
      }
    },
    {
      title: 'URL',
      name: 'url',
      type: 'url'
    }
  ],
  preview: {
    select: {
      icon: 'icon',
      url: 'url'
    },
    prepare({ icon, url }) {
      return {
        title: icon,
        subtitle: url ? url : '(url not set)',
        media: getIcon(icon)
      }
    }
  }
}
