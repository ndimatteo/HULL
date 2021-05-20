import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import conf from '@/lib/privateConfig'
import { formatDomain } from '@/lib/shopify'
import type { ShopifyProduct } from '@/lib/shared-types'
import type { AxiosResponse } from 'axios'

export default async function send(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = req.query.id

    const hasShopify = conf.SHOPIFY_STORE_ID && conf.SHOPIFY_API_PASSWORD

    if (!id) {
      return res.status(401).json({ error: 'Product ID required' })
    }

    if (!hasShopify) {
      return res.status(401).json({ error: 'Shopify API not setup' })
    }

    // Setup our Shopify connection
    const shopifyConfig = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': conf.SHOPIFY_API_PASSWORD,
    }

    // Fetch the metafields for this product
    const shopifyProduct: AxiosResponse<ShopifyProduct> = await axios({
      url: `https://${formatDomain(
        conf.SHOPIFY_STORE_ID
      )}/admin/api/2021-01/products/${id}.json`,
      method: 'GET',
      headers: shopifyConfig,
    })

    const variants = shopifyProduct.data.product.variants

    const product = {
      inStock: variants.some(
        (v) =>
          (v?.inventory_quantity ?? 0) > 0 || v?.inventory_policy === 'continue'
      ),
      lowStock:
        variants.reduce((a, b) => a + (b?.inventory_quantity || 0), 0) <= 10,
      variants: variants.map((variant) => ({
        id: variant?.id,
        inStock:
          (variant?.inventory_quantity ?? 0) > 0 ||
          variant?.inventory_policy === 'continue',
        lowStock: (variant?.inventory_quantity ?? 0) <= 5,
      })),
    }

    res.statusCode = 200
    res.json(product)
  } catch (err) {
    console.error(err)
    return res.status(401).json({ error: err.message })
  }
}
