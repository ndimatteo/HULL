import { guard, object, optional, string } from 'decoders'

const CONFIG_DECODER = object({
  SANITY_API_TOKEN: string,
  SANITY_PROJECT_ID: string,
  SANITY_PROJECT_DATASET: string,
  SHOPIFY_STORE_ID: string,
  SHOPIFY_API_TOKEN: string,
  SHOPIFY_API_PASSWORD: string,
  SHOPIFY_WEBHOOK_INTEGRITY: string,
  // Optional
  // KLAVIYO_API_KEY: optional(string),
  // MAILCHIMP_API_KEY: optional(string),
  // MAILCHIMP_SERVER: optional(string),
  // SENDGRID_API_KEY: optional(string),
})

const env = {
  SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
  SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
  SANITY_PROJECT_DATASET: process.env.SANITY_PROJECT_DATASET,
  SHOPIFY_STORE_ID: process.env.SHOPIFY_STORE_ID,
  SHOPIFY_API_TOKEN: process.env.NEXT_PUBLIC_SHOPIFY_API_TOKEN,
  SHOPIFY_API_PASSWORD: process.env.SHOPIFY_API_PASSWORD,
  SHOPIFY_WEBHOOK_INTEGRITY: process.env.SHOPIFY_WEBHOOK_INTEGRITY,
  // Optional
  // KLAVIYO_API_KEY: process.env.KLAVIYO_API_KEY,
  // MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY,
  // MAILCHIMP_SERVER: process.env.MAILCHIMP_SERVER,
  // SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
}

export default guard(CONFIG_DECODER)(env)
