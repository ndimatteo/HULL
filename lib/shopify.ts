// @ts-ignore
import Client from 'shopify-buy'
import conf from '@/lib/publicConf'

export const formatDomain = (id: string) =>
  id.includes('myshopify') ? id : `${id}.myshopify.com`

const options = {
  domain: formatDomain(conf.SHOPIFY_STORE_ID),
  storefrontAccessToken: conf.SHOPIFY_API_TOKEN,
}

export default Client.buildClient(options)
