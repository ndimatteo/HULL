import { postEmail } from '@lib/api'

var apiKey = process.env.SENDGRID_API_KEY

export default async function send(req, res) {
  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'must be a POST request' })
  }

  // honeypot
  if (req.body.fullname !== '') {
    console.log('stuck in honey')
    return res.status(200).json({ status: 202 })
  }

  const sendData = await postEmail(apiKey, req.body)

  res.statusCode = 200
  res.json({ errors: sendData.data.errors, status: parseInt(sendData.status) })
}
