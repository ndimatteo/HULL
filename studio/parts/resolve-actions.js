import defaultResolve, {
  PublishAction,
  DiscardChangesAction,
  DeleteAction
} from 'part:@sanity/base/document-actions'

const singletons = [
  'homePage',
  'samplePage',
  'shopPage',
  'errorPage',
  'generalSettings',
  'seoSettings'
]

const editAndDelete = ['product', 'productVariant']

export default function resolveDocumentActions(props) {
  const isSingle = singletons.indexOf(props.type) > -1
  const canEditDelete = editAndDelete.indexOf(props.type) > -1

  if (isSingle) {
    return [PublishAction, DiscardChangesAction]
  }

  if (canEditDelete) {
    return [PublishAction, DiscardChangesAction, DeleteAction]
  }

  return defaultResolve(props)
}
