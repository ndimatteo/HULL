const sanityClient = require('@sanity/client')
const client = sanityClient({
  dataset: process.env.SANITY_PROJECT_DATASET,
  projectId: process.env.SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
})

// see breakdown of code bloat
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// get redirects from Sanity for Vercel
async function fetchSanityRedirects() {
  const data = await client.fetch(
    `*[_type == "redirect"]{ from, to, isPermanent }`
  )

  const redirects = data.map((redirect) => {
    return {
      source: `/${redirect.from}`,
      destination: `/${redirect.to}`,
      permanent: redirect.isPermanent,
    }
  })

  return redirects
}

module.exports = withBundleAnalyzer({
  env: {
    SANITY_PROJECT_DATASET: process.env.SANITY_PROJECT_DATASET,
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
  },
  async redirects() {
    const sanityRedirects = await fetchSanityRedirects()
    return sanityRedirects
  },
})
