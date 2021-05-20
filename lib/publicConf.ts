import { guard, object, string } from 'decoders'

const CONFIG_DECODER = object({
  SANITY_PROJECT_DATASET: string,
  SANITY_PROJECT_ID: string,
  SHOPIFY_STORE_ID: string,
  SHOPIFY_API_TOKEN: string,
})

const env = {
  SANITY_PROJECT_DATASET: process.env.SANITY_PROJECT_DATASET,
  SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
  SHOPIFY_STORE_ID: process.env.NEXT_PUBLIC_SHOPIFY_STORE_ID,
  SHOPIFY_API_TOKEN: process.env.NEXT_PUBLIC_SHOPIFY_API_TOKEN,
}

export default guard(CONFIG_DECODER)(env)
