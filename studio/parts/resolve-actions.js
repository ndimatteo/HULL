import React, { useState } from 'react'
import axios from 'axios'

import sanityClient from 'part:@sanity/base/client'

import defaultResolve, {
  PublishAction,
  DiscardChangesAction,
  DeleteAction,
} from 'part:@sanity/base/document-actions'

import { useToast } from '@sanity/ui'
import { EyeOpenIcon, BasketIcon, SyncIcon } from '@sanity/icons'

const singletons = [
  'generalSettings',
  'cookieSettings',
  'promoSettings',
  'headerSettings',
  'footerSettings',
  'shopSettings',
  'seoSettings',
]

const editAndDelete = ['product', 'productVariant']

const previews = ['page', 'product', 'collection']

const PreviewAction = (props) => {
  const slug = props.draft
    ? props.draft.slug?.current
    : props.published?.slug?.current

  return {
    label: 'Open Preview',
    icon: EyeOpenIcon,
    onHandle: async () => {
      const localURL = 'http://localhost:3000'
      const remoteURL = await sanityClient.fetch(
        '*[_type == "generalSettings"][0].siteURL'
      )

      const frontendURL =
        window.location.hostname === 'localhost' ? localURL : remoteURL

      window.open(
        `${frontendURL}/api/preview?token=HULL&type=${props.type}&slug=${
          slug || ''
        }`
      )
    },
  }
}

const ShopifyAction = ({ draft, published }) => {
  const [isSyncing, setIsSyncing] = useState(false)

  const toast = useToast()

  return {
    label: isSyncing ? 'Syncing...' : 'Sync images to Shopify',
    icon: isSyncing ? SyncIcon : BasketIcon,
    disabled: draft || !published?.productID,
    title: draft ? 'Must be published first' : null,
    onHandle: async () => {
      setIsSyncing(true)

      toast.push({
        title: 'Beginning Sync...',
      })

      const localURL = 'http://localhost:3000'
      const remoteURL = await sanityClient.fetch(
        '*[_type == "generalSettings"][0].siteURL'
      )
      const frontendURL =
        window.location.hostname === 'localhost' ? localURL : remoteURL

      axios({
        url: `${frontendURL}/api/shopify/product-images`,
        method: 'POST',
        data: published,
      })
        .then((res) => res.data)
        .then((res) => {
          setIsSyncing(false)

          if (res.error) {
            toast.push({
              status: 'error',
              title: 'Error',
              description: res.error,
            })
          } else {
            toast.push({
              status: 'success',
              title: 'Photos sync’d to Shopify successfully!',
            })
          }
        })
        .catch((err) => {
          setIsSyncing(false)

          toast.push({
            status: 'error',
            title: 'Error!',
            description: 'An unknown error occurred',
          })
        })
    },
  }
}

export default function resolveDocumentActions(props) {
  const isSingle = singletons.indexOf(props.type) > -1
  const canEditDelete = editAndDelete.indexOf(props.type) > -1
  const canPreview = previews.indexOf(props.type) > -1
  const isProduct = props.type === 'product'

  if (isSingle) {
    return [
      PublishAction,
      DiscardChangesAction,
      ...(canPreview ? [PreviewAction] : []),
    ]
  }

  if (canEditDelete) {
    return [
      PublishAction,
      DiscardChangesAction,
      DeleteAction,
      ...(canPreview ? [PreviewAction] : []),
      ...(isProduct ? [ShopifyAction] : []),
    ]
  }

  return [...defaultResolve(props), ...(canPreview ? [PreviewAction] : [])]
}
