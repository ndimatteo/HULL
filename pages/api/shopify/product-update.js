import axios from 'axios'
import sanityClient from '@sanity/client'
import crypto from 'crypto'
const getRawBody = require('raw-body')

const sanity = sanityClient({
  dataset: process.env.SANITY_PROJECT_DATASET,
  projectId: process.env.SANITY_PROJECT_ID,
  token: process.env.SANITY_API_TOKEN,
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
    console.log('must be a POST request with a product ID')
    return res
      .status(200)
      .json({ error: 'must be a POST request with a product ID' })
  }

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
    console.log('not verified from Shopify')
    return res.status(200).json({ error: 'not verified from Shopify' })
  }

  // extract shopify data
  const {
    body: { status, id, title, handle, options, variants },
  } = req

  // load up previous payload from the product Metafields
  const shopifyConfig = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': process.env.SHOPIFY_API_PASSWORD,
  }

  const shopifyProduct = await axios({
    url: `https://${process.env.SHOPIFY_STORE_ID}.myshopify.com/admin/products/${id}/metafields.json`,
    method: 'GET',
    headers: shopifyConfig,
  })

  console.log('metafields:')
  console.log(shopifyProduct.data.metafields)

  // const previousSync = shopifyProduct.find((mf) => mf.key === 'sanity_sync')
  const previousSync = false

  if (previousSync) {
    console.log(previousSync)
  } else {
    console.log('needs meta field created!')
    return res.status(200).json({ error: 'temp bail' })
  }

  console.log('[update] product sync starting...')

  // grab current variants
  const currentVariants = await sanity.fetch(
    `*[_type == "productVariant" && productID == ${id}]{
      _id
    }`
  )

  let stx = sanity.transaction()

  // setup product document
  const product = {
    _type: 'product',
    _id: `${status !== 'active' ? 'drafts.' : ''}product-${id}`,
  }

  // setup product options
  const productOptions = options.map((option) => ({
    _key: option.id,
    _type: 'productOption',
    name: option.name,
    values: option.values,
    position: option.position,
  }))

  // define produt fields
  const productFields = {
    productTitle: title,
    productID: id,
    variantID: variants[0].id,
    price: variants[0].price * 100,
    sku: variants[0].sku,
    wasDeleted: false,
    options: productOptions,
  }

  // create product if doesn't exist
  stx = stx.createIfNotExists(product)

  // patch (update) product document with core shopify data
  stx = stx.patch(`product-${id}`, (patch) => patch.set(productFields))
  // patch (update) title & slug if none has been set
  stx = stx.patch(`product-${id}`, (patch) =>
    patch.setIfMissing({ title: title, slug: { current: handle } })
  )

  // define productVariant documents
  const productVariants = variants.map((variant) => ({
    _type: 'productVariant',
    _id: `${status !== 'active' ? 'drafts.' : ''}productVariant-${variant.id}`,
  }))

  // define productVariant fields
  const productVariantFields = variants.map((variant) => ({
    productTitle: title,
    productID: id,
    variantTitle: variant.title,
    variantID: variant.id,
    price: variant.price * 100,
    sku: variant.sku,
    wasDeleted: false,
    options: options.map((option) => ({
      _key: option.id,
      _type: 'productOptionValue',
      name: option.name,
      value: variant[`option${option.position}`],
      position: option.position,
    })),
  }))

  // create variant if doesn't exist & patch (update) variant with core shopify data
  productVariants.forEach((variant, i) => {
    stx = stx.createIfNotExists(variant)
    stx = stx.patch(variant._id, (patch) => patch.set(productVariantFields[i]))
    stx = stx.patch(variant._id, (patch) =>
      patch.setIfMissing({ title: productVariantFields[i].variantTitle })
    )
  })

  // mark deleted variants
  currentVariants.forEach((cv) => {
    const active = productVariants.some((v) => v._id === cv._id)
    if (!active) {
      stx = stx.patch(cv._id, (patch) => patch.set({ wasDeleted: true }))
    }
  })

  const result = await stx.commit()

  console.log('sync complete!')

  res.statusCode = 200
  res.json(JSON.stringify(result))
}
