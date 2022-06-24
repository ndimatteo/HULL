import axios from 'axios'

export default async function send(req, res) {
  const {
    query: { id },
  } = req

  const hasShopify =
    process.env.SHOPIFY_STORE_ID && process.env.SHOPIFY_ADMIN_API_TOKEN

  // Bail if no product ID was supplied
  if (!id) {
    return res.status(401).json({ error: 'Product ID required' })
  }

  // Bail if no Shopify API credentials were supplied
  if (!hasShopify) {
    return res.status(401).json({ error: 'Shopify API not setup' })
  }

  // Setup our Shopify connection
  const shopifyConfig = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
  }

  // Fetch our product from Shopify
  const shopifyProduct = await axios({
    url: `https://${process.env.SHOPIFY_STORE_ID}.myshopify.com/admin/api/2021-01/products/${id}.json`,
    method: 'GET',
    headers: shopifyConfig,
  })
    .then((response) => {
      if (response.data?.product) {
        return response.data.product
      } else {
        return null
      }
    })
    .catch(() => {
      return null
    })

  // bail if Shopify can't find the product
  if (!shopifyProduct)
    return res.status(401).json({ error: 'Product not found' })

  // get our products variants
  const variants = shopifyProduct.variants

  // construct our inventory object
  const product = {
    inStock: variants.some(
      (v) =>
        v.inventory_quantity > 0 ||
        v.inventory_policy === 'continue' ||
        v.inventory_management === null
    ),
    lowStock:
      variants.reduce((a, b) => a + (b.inventory_quantity || 0), 0) <= 10,
    variants: variants.map((variant) => ({
      id: variant.id,
      inStock:
        variant.inventory_quantity > 0 ||
        variant.inventory_policy === 'continue' ||
        variant.inventory_management === null,
      lowStock: variant.inventory_quantity <= 5,
    })),
  }

  res.statusCode = 200
  res.json(product)
}
