import S from '@sanity/desk-tool/structure-builder'

import EyeIcon from 'part:@sanity/base/eye-icon'
import EditIcon from 'part:@sanity/base/edit-icon'

import SeoPreview from './seo/seo-preview'

const remoteURL = 'https://insane.codes'
const localURL = 'http://localhost:3000'
const previewURL =
  window.location.hostname === 'localhost' ? localURL : remoteURL

export const standardViews = [
  S.view.form().icon(EditIcon),
  S.view
    .component(SeoPreview)
    .options({ previewURL })
    .icon(EyeIcon)
    .title('SEO Preview')
]
