import type { NextApiRequest, NextApiResponse } from 'next'
import { getStaticRoute, getDynamicRoute } from '@/lib/routes'
import conf from '@/lib/privateConfig'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Bail if no secret or slug defined
  if (req.query.token !== 'HULL' || !req.query.type) {
    return res.status(401).json({ message: 'Invalid preview request' })
  }

  // determine if it's a dynamic route
  const isStatic = getStaticRoute(req.query.type.toString())
  const isDynamic = getDynamicRoute(req.query.type.toString())

  // Enable Preview Mode by setting the cookies and passing the sanity token for fetching
  res.setPreviewData(
    { token: conf.SANITY_API_TOKEN },
    {
      maxAge: 20,
    }
  )

  // Redirect to the associated page
  res.redirect(
    isStatic
      ? `/${isStatic}`
      : `/${isDynamic ? `${isDynamic}/` : ''}${req.query.slug}`
  )
}
