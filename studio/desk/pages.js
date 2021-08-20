import React from 'react'
import S from '@sanity/desk-tool/structure-builder'
import sanityClient from 'part:@sanity/base/client'

import { Card, Text } from '@sanity/ui'

import { House, Browser, ShoppingCart, WarningOctagon } from 'phosphor-react'

import { standardViews } from './previews/standard'

// Extract our home page
const currentHomePage = S.listItem()
  .title('Home Page')
  .icon(House)
  .child(async () => {
    const data = await sanityClient.fetch(`
      *[_type == "generalSettings"][0]{
        home->{_id}
      }
    `)

    if (!data?.home)
      return S.component(() => (
        <Card padding={4}>
          <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="critical">
            <Text align="center" size={[2]}>
              The Home Page has not been set. Visit the Settings page to
              activate.
            </Text>
          </Card>
        </Card>
      )).title('Home Page')

    return S.document()
      .id(data.home._id)
      .schemaType('page')
      .views(standardViews)
  })

// Extract our shop page
const currentShopPage = S.listItem()
  .title('Shop All Page')
  .icon(ShoppingCart)
  .child(async () => {
    const data = await sanityClient.fetch(`
    *[_type == "generalSettings"][0]{
      shop->{_id}
    }
  `)

    if (!data?.shop)
      return S.component(() => (
        <Card padding={4}>
          <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="critical">
            <Text align="center" size={[2]}>
              The Shop All Page has not been set. Visit the Settings page to
              activate.
            </Text>
          </Card>
        </Card>
      )).title('Shop All Page')

    return S.document()
      .id(data.shop._id)
      .schemaType('collection')
      .views(standardViews)
  })

// Extract our error page
const currentErrorPage = S.listItem()
  .title('Error Page')
  .icon(WarningOctagon)
  .child(async () => {
    const data = await sanityClient.fetch(`
      *[_type == "generalSettings"][0]{
        error->{_id}
      }
    `)

    if (!data?.error)
      return S.component(() => (
        <Card padding={4}>
          <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="critical">
            <Text align="center" size={[2]}>
              The Error Page has not been set. Visit the Settings page to
              activate.
            </Text>
          </Card>
        </Card>
      )).title('Error Page')

    return S.document()
      .id(data.error._id)
      .schemaType('page')
      .views(standardViews)
  })

export const pagesMenu = S.listItem()
  .title('Pages')
  .id('pages')
  .child(
    S.list()
      .title('Pages')
      .items([
        currentHomePage,
        currentShopPage,
        currentErrorPage,
        S.listItem()
          .title('Other Pages')
          .schemaType('page')
          .child(
            S.documentTypeList('page')
              .title('Other Pages')
              .filter(
                `_type == "page" && !(_id in [
                  *[_type == "generalSettings"][0].home._ref,
                  *[_type == "generalSettings"][0].error._ref,
                ]) && !(_id in path("drafts.**"))`
              )
              .child(documentId =>
                S.document()
                  .documentId(documentId)
                  .schemaType('page')
                  .views(standardViews)
              )
          )
      ])
  )
  .icon(Browser)
