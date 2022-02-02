import S from '@sanity/desk-tool/structure-builder'

import EyeIcon from 'part:@sanity/base/eye-icon'
import EditIcon from 'part:@sanity/base/edit-icon'

import SeoPreview from './seo/seo-preview'

export const standardViews = [
  S.view.form().icon(EditIcon),
  S.view
    .component(SeoPreview)
    .icon(EyeIcon)
    .title('SEO Preview')
]
