import axios from 'axios'
import sanityClient from '@sanity/client'
import crypto from 'crypto'
import { nanoid } from 'nanoid'
const getRawBody = require('raw-body')
const jsondiffpatch = require('jsondiffpatch')

const sanity = sanityClient({
  dataset: process.env.SANITY_PROJECT_DATASET,
  projectId: process.env.SANITY_PROJECT_ID,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2021-03-25',
  useCdn: false,
})

// Turn off default NextJS bodyParser, so we can run our own middleware
export const config = {
  api: {
    bodyParser: false,
  },
}

// Custom Middleware to parse Shopify's webhook payload
const runMiddleware = (req, res, fn) => {
  new Promise((resolve) => {
    if (!req.body) {
      let buffer = ''
      req.on('data', (chunk) => {
        buffer += chunk
      })

      req.on('end', () => {
        resolve()
        req.body = JSON.parse(Buffer.from(buffer).toString())
      })
    }
  })
}

export default async function send(req, res) {
  // bail if it's not a post request or it's missing an ID
  if (req.method !== 'POST') {
    console.error('Must be a POST request with a product ID')
    return res
      .status(200)
      .json({ error: 'Must be a POST request with a product ID' })
  }

  /*  ------------------------------ */
  /*  1. Run our middleware
  /*  2. check webhook integrity
  /*  ------------------------------ */

  // run our middleware to extract the "raw" body for matching the Shopify Integrity Key
  await runMiddleware(req, res)
  const rawBody = await getRawBody(req)

  // get request integrity header
  const hmac = req.headers['x-shopify-hmac-sha256']
  const generatedHash = await crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_INTEGRITY)
    .update(rawBody, 'utf8', 'hex')
    .digest('base64')

  // bail if shopify integrity doesn't match
  if (hmac !== generatedHash) {
    console.error('Unable to verify from Shopify')
    return res.status(200).json({ error: 'Unable to verify from Shopify' })
  }

  // extract shopify data
  const {
    body: { status, id, title, handle, options, variants },
  } = req

  console.info(`Sync triggered for product: ${title} (id: ${id})`)

  /*  ------------------------------ */
  /*  Construct our product objects
  /*  ------------------------------ */

  // Define product document
  const product = {
    _type: 'product',
    _id: `product-${id}`,
  }

  // Define product options if there are more than one variant
  const productOptions =
    variants.length > 1
      ? options.map((option) => ({
          _key: option.id,
          _type: 'productOption',
          name: option.name,
          values: option.values,
          position: option.position,
        }))
      : []

  // Define product fields
  const productFields = {
    wasDeleted: false,
    isDraft: status === 'draft' ? true : false,
    productTitle: title,
    productID: id,
    slug: { current: handle },
    price: variants[0].price * 100,
    comparePrice: variants[0].compare_at_price * 100,
    sku: variants[0].sku || '',
    inStock: variants.some(
      (v) => v.inventory_quantity > 0 || v.inventory_policy === 'continue'
    ),
    lowStock:
      variants.reduce((a, b) => a + (b.inventory_quantity || 0), 0) <= 10,
    options: productOptions,
  }

  // Define productVariant documents
  const productVariants = variants
    .sort((a, b) => (a.id > b.id ? 1 : -1))
    .map((variant) => ({
      _type: 'productVariant',
      _id: `productVariant-${variant.id}`,
    }))

  // Define productVariant fields
  const productVariantFields = variants
    .sort((a, b) => (a.id > b.id ? 1 : -1))
    .map((variant) => ({
      isDraft: status === 'draft' ? true : false,
      wasDeleted: false,
      productTitle: title,
      productID: id,
      variantTitle: variant.title,
      variantID: variant.id,
      price: variant.price * 100,
      comparePrice: variant.compare_at_price * 100,
      sku: variant.sku || '',
      inStock:
        variant.inventory_quantity > 0 ||
        variant.inventory_policy === 'continue',
      lowStock: variant.inventory_quantity <= 5,
      options:
        variants.length > 1
          ? options.map((option) => ({
              _key: option.id,
              _type: 'productOptionValue',
              name: option.name,
              value: variant[`option${option.position}`],
              position: option.position,
            }))
          : [],
    }))

  // construct our comparative product object
  const productCompare = {
    ...product,
    ...productFields,
    ...{
      variants: productVariants.map((variant, key) => ({
        ...variant,
        ...productVariantFields[key],
      })),
    },
  }

  /*  ------------------------------ */
  /*  Check for previous sync
  /*  ------------------------------ */

  console.log('Checking for previous sync data...')

  // Setup our Shopify connection
  const shopifyConfig = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
  }

  // Fetch the metafields for this product
  const shopifyProduct = await axios({
    url: `https://${process.env.SHOPIFY_STORE_ID}.myshopify.com/admin/products/${id}/metafields.json`,
    method: 'GET',
    headers: shopifyConfig,
  })

  // See if our metafield exists
  const previousSync = shopifyProduct.data?.metafields.find(
    (mf) => mf.key === 'product_sync'
  )

  // Metafield found
  if (previousSync) {
    console.log('Previous sync found, comparing differences...')

    // Differences found
    if (jsondiffpatch.diff(JSON.parse(previousSync.value), productCompare)) {
      console.warn('Critical difference found! Start sync...')

      // update our shopify metafield with the new data before continuing sync with Sanity
      axios({
        url: `https://${process.env.SHOPIFY_STORE_ID}.myshopify.com/admin/products/${id}/metafields/${previousSync.id}.json`,
        method: 'PUT',
        headers: shopifyConfig,
        data: {
          metafield: {
            id: previousSync.id,
            value: JSON.stringify(productCompare),
            value_type: 'string',
          },
        },
      })

      // No changes found
    } else {
      console.info('No differences found, sync complete!')
      return res
        .status(200)
        .json({ error: 'nothing to sync, product up-to-date' })
    }
    // No metafield created yet, let's do that
  } else {
    console.warn('No previous sync found, Start sync...')
    axios({
      url: `https://${process.env.SHOPIFY_STORE_ID}.myshopify.com/admin/products/${id}/metafields.json`,
      method: 'POST',
      headers: shopifyConfig,
      data: {
        metafield: {
          namespace: 'sanity',
          key: 'product_sync',
          value: JSON.stringify(productCompare),
          value_type: 'string',
        },
      },
    })
  }

  /*  ------------------------------ */
  /*  Begin Sanity Product Sync
  /*  ------------------------------ */

  console.log('Writing product to Sanity...')
  let stx = sanity.transaction()

  // create product if doesn't exist
  stx = stx.createIfNotExists(product)

  // unset options field first, to avoid patch set issues
  stx = stx.patch(`product-${id}`, (patch) => patch.unset(['options']))

  // patch (update) product document with core shopify data
  stx = stx.patch(`product-${id}`, (patch) => patch.set(productFields))

  // patch (update) title & slug if none has been set
  stx = stx.patch(`product-${id}`, (patch) =>
    patch.setIfMissing({ title: title })
  )

  // patch (update) productHero module if none has been set
  stx = stx.patch(`product-${id}`, (patch) =>
    patch.setIfMissing({
      modules: [
        {
          _key: nanoid(),
          _type: 'productHero',
          active: true,
        },
      ],
    })
  )

  // create variant if doesn't exist & patch (update) variant with core shopify data
  productVariants.forEach((variant, i) => {
    stx = stx.createIfNotExists(variant)
    stx = stx.patch(variant._id, (patch) => patch.set(productVariantFields[i]))
    stx = stx.patch(variant._id, (patch) =>
      patch.setIfMissing({ title: productVariantFields[i].variantTitle })
    )
  })

  // grab current variants
  const currentVariants = await sanity.fetch(
    `*[_type == "productVariant" && productID == ${id}]{
      _id
    }`
  )

  // mark deleted variants
  currentVariants.forEach((cv) => {
    const active = productVariants.some((v) => v._id === cv._id)
    if (!active) {
      stx = stx.patch(cv._id, (patch) => patch.set({ wasDeleted: true }))
    }
  })

  const result = await stx.commit()

  console.info('Sync complete!')
  console.log(result)

  res.statusCode = 200
  res.json(JSON.stringify(result))
}
