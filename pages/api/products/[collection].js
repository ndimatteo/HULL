import { getCollectionProducts } from '../../../lib/api'

export default async function products(req, res) {
  const {
    query: { collection, preview },
  } = req

  if (!collection) {
    return res.status(401).json({ error: 'Missing collection...' })
  }

  const products = await getCollectionProducts(collection, JSON.parse(preview))

  res.statusCode = 200
  res.json([...products])
}
