import S from '@sanity/desk-tool/structure-builder'
import sanityClient from 'part:@sanity/base/client'

import { Copy, Gift, Sliders, ShoppingCart, LinkBreak } from 'phosphor-react'

import { standardViews } from './previews/standard'

const collectionsMenu = S.listItem()
  .title('Collections')
  .schemaType('collection')
  .child(
    S.documentTypeList('collection')
      .title('Collections')
      .filter(
        `_type == "collection" && !(_id in [
      *[_type == "generalSettings"][0].shop._ref,
    ]) && !(_id in path("drafts.**"))`
      )
      .child(documentId =>
        S.document()
          .documentId(documentId)
          .schemaType('collection')
          .views(standardViews)
      )
      .canHandleIntent(
        (intent, { type }) =>
          ['create', 'edit'].includes(intent) && type === 'collection'
      )
  )

const productsMenu = S.listItem()
  .title('Products')
  .icon(Gift)
  .child(
    S.documentTypeList('product')
      .title('Products')
      .child(documentId =>
        S.document()
          .documentId(documentId)
          .schemaType('product')
          .views(standardViews)
      )
  )

const productVariantsMenu = S.listItem()
  .title('Product Variants')
  .icon(Copy)
  .child(
    S.list()
      .title('Product Variants')
      .items([
        S.listItem()
          .title('By Product')
          .icon(Gift)
          .child(
            S.documentTypeList('product')
              .title('By Product')
              .menuItems(S.documentTypeList('product').getMenuItems())
              .filter('_type == $type')
              .params({ type: 'product' })
              .child(productID =>
                S.documentList()
                  .title('Variants')
                  .menuItems(
                    S.documentTypeList('productVariant').getMenuItems()
                  )
                  .filter('_type == $type && productID == $id')
                  .params({
                    type: 'productVariant',
                    id: Number(productID.replace('product-', ''))
                  })
                  .child(documentId =>
                    S.document()
                      .documentId(documentId)
                      .schemaType('productVariant')
                      .views(standardViews)
                  )
              )
          ),
        S.listItem()
          .title('Unattached Variants')
          .icon(LinkBreak)
          .child(async () => {
            const productIDs = await sanityClient.fetch(`
          *[_type == "product"][].productID
        `)

            return S.documentTypeList('productVariant')
              .title('Unattached Variants')
              .filter('_type == $type && !(productID in $ids)')
              .params({
                type: 'productVariant',
                ids: productIDs
              })
          })
      ])
  )

const filtersMenu = S.listItem()
  .title('Filters')
  .icon(Sliders)
  .child(
    S.documentTypeList('filter')
      .title('Filters')
      .child(documentId =>
        S.document()
          .documentId(documentId)
          .schemaType('filter')
      )
      .canHandleIntent(
        (intent, { type }) =>
          ['create', 'edit'].includes(intent) && type === 'filter'
      )
  )

// Our exported "Shop" Menu
export const shopMenu = S.listItem()
  .title('Shop')
  .id('shop')
  .child(
    S.list()
      .title('Shop')
      .items([
        productsMenu,
        productVariantsMenu,
        S.divider(),
        collectionsMenu,
        filtersMenu
      ])
  )
  .icon(ShoppingCart)
