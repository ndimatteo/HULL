import React, { useContext } from 'react'
import { ShopifyContext } from '../../contexts/ShopifyContext'

const addToCart = ({ product }) => {
  const {
    checkout: { products },
    addItemToCart,
  } = useContext(ShopifyContext)

  return (
    <button
      className="btn"
      style={{ marginBottom: '2em' }}
      onClick={() => addItemToCart(product.id, 1)}
    >
      Add To Cart
    </button>
  )
}

export default addToCart
