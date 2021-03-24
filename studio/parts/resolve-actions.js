import defaultResolve, {
  PublishAction,
  DiscardChangesAction,
  DeleteAction
} from 'part:@sanity/base/document-actions'

import { FiEye } from 'react-icons/fi'

const remoteURL = window.location.protocol + '//' + window.location.hostname
const localURL = 'http://localhost:3000'
const previewURL =
  window.location.hostname === 'localhost' ? localURL : remoteURL

const singletons = [
  'homePage',
  'shopPage',
  'errorPage',
  'generalSettings',
  'cookieSettings',
  'promoSettings',
  'headerSettings',
  'footerSettings',
  'cartSettings',
  'seoSettings'
]

const editAndDelete = ['product', 'productVariant']

const previews = ['homePage', 'shopPage', 'page', 'product', 'collection']

const PreviewAction = props => {
  const slug = props.draft
    ? props.draft.slug?.current
    : props.published?.slug?.current
  return {
    label: 'Open Preview',
    icon: FiEye,
    onHandle: () => {
      window.open(
        `${previewURL}/api/preview?token=HULL&type=${props.type}&slug=${slug ||
          ''}`
      )
    }
  }
}

export default function resolveDocumentActions(props) {
  const isSingle = singletons.indexOf(props.type) > -1
  const canEditDelete = editAndDelete.indexOf(props.type) > -1
  const canPreview = previews.indexOf(props.type) > -1

  if (isSingle) {
    return [
      PublishAction,
      DiscardChangesAction,
      ...(canPreview ? [PreviewAction] : [])
    ]
  }

  if (canEditDelete) {
    return [
      PublishAction,
      DiscardChangesAction,
      DeleteAction,
      ...(canPreview ? [PreviewAction] : [])
    ]
  }

  return [...defaultResolve(props), ...(canPreview ? [PreviewAction] : [])]
}
