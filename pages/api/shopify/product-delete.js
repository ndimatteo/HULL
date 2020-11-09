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
    console.log('not verified from Shopify')
    return res.status(200).json({ error: 'not verified from Shopify' })
  }

  // extract shopify data
  const {
    body: { id },
  } = req

  /*  ------------------------------ */
  /*  Begin Sanity Product Sync
  /*  ------------------------------ */

  console.log('[delete] product sync starting...')
  let stx = sanity.transaction()

  // patch (update) product document with core shopify data
  stx = stx.patch(`product-${id}`, (patch) => patch.set({ wasDeleted: true }))

  const result = await stx.commit()

  console.log('sync complete!')

  res.statusCode = 200
  res.json(JSON.stringify(result))
}
