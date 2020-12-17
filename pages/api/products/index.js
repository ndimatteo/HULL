import { getAllProducts } from '../../../lib/api'

export default async function products(req, res) {
  const {
    query: { preview },
  } = req

  const products = await getAllProducts(JSON.parse(preview))

  res.statusCode = 200
  res.json([...products])
}
