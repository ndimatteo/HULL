import { getAllProducts } from '../../../lib/api'

export default async function products(req, res) {
  const products = await getAllProducts()

  res.statusCode = 200
  res.json([...products])
}
