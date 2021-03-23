import React from 'react'
import BlockContent from '@sanity/block-content-to-react'
import { serializers } from '@lib/serializers'

import {
  ProductGallery,
  ProductPrice,
  ProductForm,
  ProductActions,
} from '@blocks/product'

const ProductHero = ({ product, activeVariant, onVariantChange }) => {
  return (
    <section className="product">
      <div className="product--content">
        <div className="product--gallery">
          <ProductGallery
            photosets={product.photos.main}
            activeVariant={activeVariant}
            hasArrows
            hasCounter
            hasThumbs
          />
        </div>

        <div className="product--details">
          <div className="product--info">
            <div className="product--header">
              <div className="product--title">
                {activeVariant && (
                  <div className="product--variant">
                    {activeVariant.title}

                    {activeVariant.lowStock && activeVariant.inStock && (
                      <span className="label is-secondary">Low Stock</span>
                    )}

                    {!activeVariant.inStock && (
                      <span className="label">Out of Stock</span>
                    )}
                  </div>
                )}
                <h1 className="product--name">{product.title}</h1>
              </div>

              <ProductPrice
                price={activeVariant?.price || product.price}
                comparePrice={
                  activeVariant?.comparePrice || product.comparePrice
                }
              />
            </div>

            {product.description && (
              <div className="product--desc">
                <BlockContent
                  renderContainerOnSingleChild
                  className="rc"
                  blocks={product.description}
                  serializers={serializers}
                />
              </div>
            )}

            <ProductForm
              product={product}
              activeVariant={activeVariant}
              onVariantChange={onVariantChange}
              className="product--form"
            />
          </div>

          <ProductActions
            activeVariant={activeVariant}
            klaviyoAccountID={product.klaviyoAccountID}
          />
        </div>
      </div>
    </section>
  )
}

export default ProductHero
