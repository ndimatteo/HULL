import recharge from '../../../../lib/recharge'

export default async function send(req, res) {
  const {
    query: { id },
  } = req

  if (!id) {
    return res.status(401).json({ error: 'Missing customer ID' })
  }

  const customer = await recharge.get(`customers?shopify_customer_id=${id}`)

  res.statusCode = 200
  res.json(customer.data)
}
