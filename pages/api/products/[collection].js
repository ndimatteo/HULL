import { getCollectionProducts } from '../../../lib/api'

export default async function products(req, res) {
  const {
    query: { collection },
  } = req

  if (!collection) {
    return res.status(401).json({ error: 'Missing collection...' })
  }

  const products = await getCollectionProducts(collection)

  res.statusCode = 200
  res.json([...products])
}
