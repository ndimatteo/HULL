import createSanityClient from '@sanity/client'
import sanityImage from '@sanity/image-url'
import conf from '@/lib/publicConf'

const options = {
  dataset: conf.SANITY_PROJECT_DATASET,
  projectId: conf.SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2021-03-25',
}

export const sanityClient = createSanityClient(options)
export const imageBuilder = sanityImage(sanityClient)

export function createPreviewClient(token: string) {
  return createSanityClient({
    ...options,
    useCdn: false,
    token,
  })
}

export type PreviewOpts = {
  active?: boolean
  token?: string
}

export function getSanityClient(preview?: PreviewOpts) {
  if (preview?.active && preview.token) {
    return createPreviewClient(preview.token)
  } else {
    return sanityClient
  }
}
