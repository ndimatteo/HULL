import sanityClient from '@sanity/client'

const options = {
  dataset: process.env.SANITY_PROJECT_DATASET,
  projectId: process.env.SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
}

export default sanityClient(options)

export const sanityPreview = (token) =>
  sanityClient({
    ...options,
    useCdn: false,
    token: token,
  })
