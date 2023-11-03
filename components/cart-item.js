import Link from 'next/link'


import { useRemoveItem, useToggleCart, useUpdateItem } from '@lib/context'

import { ProductCounter, ProductPrice } from '@components/product'

function CartItem({ item }) {
  const removeItem = useRemoveItem()
  const updateItem = useUpdateItem()
  const toggleCart = useToggleCart()

  const changeQuantity = (quantity) => {
    updateItem(item.id, quantity)
  }

  /*
	const defaultPhoto = item.photos.cart?.find((set) => !set.forOption);
	const variantPhoto = item.photos.cart?.find((set) => {
		const option = set.forOption
			? {
					name: set.forOption.split(':')[0],
					value: set.forOption.split(':')[1],
			  }
			: {};
		return option.value && hasObject(item.options, option);
	});

	const photos = variantPhoto ? variantPhoto : defaultPhoto;
	*/
  const photos = item.merchandise.product.images.edges[0].node.originalSrc

  return (
    <div className="cart-item">
      {/*
      {photos && (
        <Photo
          photo={photos?.default}
          srcSizes={[400]}
          sizes="(min-width: 768px) 400px, 35vw'"
          className="cart-item--photo"
        />
      )} 
      */}
      {photos && <img src={photos} className="cart-item--photo" />}
      <div className="cart-item--details">
        <div className="cart-item--header">
          <div className="cart-item--title">
            {/* <div className="cart-item--variant">
							{item.merchandise.product.title}
			      </div> */}
            <h2 className="cart-item--name">
              <Link
                href={`/products/${
                  item.merchandise.product.handle
                }?variant=${item.merchandise.id.replace(
                  'gid://shopify/ProductVariant/',
                  '',
                )}`}
                scroll={false}
              >
                <a
                  onClick={() => toggleCart(false)}
                  className="cart-item--link"
                >
                  {item.merchandise.product.title}
                </a>
              </Link>
            </h2>
          </div>
          <ProductPrice price={item.cost.totalAmount.amount * 100} />
        </div>
        <div className="cart-item--tools">
          <div className="cart-item--quantity">
            <ProductCounter
              key={item.id}
              id={item.id}
              defaultCount={item.quantity}
              onUpdate={changeQuantity}
              className="is-small is-inverted"
            />
          </div>
          <button onClick={() => removeItem(item.id)} className="btn is-text">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem
