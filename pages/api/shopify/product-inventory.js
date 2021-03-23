import axios from 'axios'

export default async function send(req, res) {
  const {
    query: { id },
  } = req

  const hasShopify =
    process.env.SHOPIFY_STORE_ID && process.env.SHOPIFY_API_PASSWORD

  if (!id) {
    return res.status(401).json({ error: 'Product ID required' })
  }

  if (!hasShopify) {
    return res.status(401).json({ error: 'Shopify API not setup' })
  }

  // Setup our Shopify connection
  const shopifyConfig = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': process.env.SHOPIFY_API_PASSWORD,
  }

  // Fetch the metafields for this product
  const shopifyProduct = await axios({
    url: `https://${process.env.SHOPIFY_STORE_ID}.myshopify.com/admin/api/2021-01/products/${id}.json`,
    method: 'GET',
    headers: shopifyConfig,
  })

  const variants = shopifyProduct.data.product.variants

  const product = {
    inStock: variants.some(
      (v) => v.inventory_quantity > 0 || v.inventory_policy === 'continue'
    ),
    lowStock:
      variants.reduce((a, b) => a + (b.inventory_quantity || 0), 0) <= 10,
    variants: variants.map((variant) => ({
      id: variant.id,
      inStock:
        variant.inventory_quantity > 0 ||
        variant.inventory_policy === 'continue',
      lowStock: variant.inventory_quantity <= 5,
    })),
  }

  res.statusCode = 200
  res.json(product)
}
