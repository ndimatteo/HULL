const sanityClient = require('@sanity/client')
const client = sanityClient({
  dataset: process.env.NEXT_PUBLIC_SANITY_PROJECT_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2022-08-30',
})

// see breakdown of code bloat
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// get redirects from Sanity for Vercel
async function fetchSanityRedirects() {
  const redirectData = await client.fetch(`
    *[_type == "redirect"]{
      "source": "/" + from,
      "destination": "/" + to,
      "permanent": isPermanent
    }
  `)

  return redirectData
}

module.exports = withBundleAnalyzer({
  swcMinify: true,
  async redirects() {
    const sanityRedirects = await fetchSanityRedirects()
    return sanityRedirects
  },
  async headers() {
    return [
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "connect-src 'self';",
          },
        ],
      },
    ]
  },
  images: {
    domains: ['i.vimeocdn.com', 'img.youtube.com'],
    deviceSizes: [
      400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800,
      3000, 3200, 3400,
    ],
    imageSizes: [
      20, 30, 40, 50, 60, 80, 100, 120, 140, 180, 220, 260, 300, 340, 380, 390,
    ],
  },
})
