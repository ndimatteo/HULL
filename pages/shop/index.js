import React from 'react'

import { getStaticPage } from '../../lib/api'

import Layout from '../../components/layout'

const Shop = ({ data }) => {
  const { site, menus, page } = data

  console.log(page)

  return (
    <Layout
      site={{
        seo: site.seo,
        social: site.social,
        menus: menus,
      }}
      page={{
        seo: page.seo,
      }}
    >
      <section className="section">
        <h1>{page.title}</h1>

        {page.products.map((product) => (
          <div className="product-item">
            <div className="product-item--details">
              <h2>{product.title}</h2>
            </div>
          </div>
        ))}
      </section>
    </Layout>
  )
}

export async function getStaticProps(context) {
  const shopData = await getStaticPage(`
    *[_type == "shopPage"][0]{
      title,
      "products": *[_type == "product" && wasDeleted != true && isDraft != true]{
        "slug": slug.current,
        "id": productID,
        title,
        price,
        comparePrice,
        "photos": {
          "gallery": photos[],
          "listing": {
            "default": listingPhoto,
            "hover": listingPhotoHover
          }
        },
        inStock,
        lowStock,
        quickOption,
        options[]{
          name,
          position,
          values[]
        },
        "variants": *[_type == "productVariant" && productID == ^.productID && wasDeleted != true && isDraft != true]{
          "id": variantID,
          title,
          price,
          comparePrice,
          "photos": {
            "gallery": coalesce(
              photos[],
              *[_type == "product" && productID == ^.productID][0].photos[]
            ),
            "listing": {
              "default": coalesce(
                listingPhoto,
                *[_type == "product" && productID == ^.productID][0].listingPhoto
              ),
              "hover": coalesce(
                listingPhotoHover,
                *[_type == "product" && productID == ^.productID][0].listingPhotoHover
              )
            }
          },
          inStock,
          lowStock,
          options[]{
            name,
            position,
            value
          }
        }
      },
      seo
    }
  `)

  return {
    props: {
      data: shopData,
    },
  }
}

export default Shop
