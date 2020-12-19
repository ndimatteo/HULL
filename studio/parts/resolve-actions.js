import defaultResolve, {
  PublishAction,
  DiscardChangesAction,
  DeleteAction
} from 'part:@sanity/base/document-actions'

import { FiEye } from 'react-icons/fi'

const remoteURL = 'https://insane.codes'
const localURL = 'http://localhost:3000'
const previewURL =
  window.location.hostname === 'localhost' ? localURL : remoteURL

const singletons = [
  'homePage',
  'samplePage',
  'shopPage',
  'errorPage',
  'generalSettings',
  'seoSettings'
]

const editAndDelete = ['product', 'productVariant']

const previews = [
  'homePage',
  'samplePage',
  'shopPage',
  'page',
  'product',
  'collection'
]

const PreviewAction = props => {
  const slug = props.draft
    ? props.draft.slug?.current
    : props.published?.slug?.current
  return {
    label: 'Open Preview',
    icon: FiEye,
    onHandle: () => {
      window.open(
        `${previewURL}/api/preview?token=666&type=${props.type}&slug=${slug ||
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
      canPreview && PreviewAction
    ]
  }

  return [...defaultResolve(props), ...(canPreview ? [PreviewAction] : [])]
}
