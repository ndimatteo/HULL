import Client from 'shopify-buy'

const options = {
  domain: `${process.env.SHOPIFY_STORE_ID}.myshopify.com`,
  storefrontAccessToken: process.env.SHOPIFY_API_TOKEN,
}

export default Client.buildClient(options)
