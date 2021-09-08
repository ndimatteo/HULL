import axios from 'axios'

const apiKey = process.env.SENDGRID_API_KEY

export default async function send(req, res) {
  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'Must be a POST request' })
  }

  const {
    body: {
      formName = 'Contact Form',
      fromAddress,
      notificationEmails,
      templateID,
      name,
      email,
      subject,
      message,
    },
  } = req

  // honeypot
  if (req.body.fullname !== '') {
    console.warn('Stuck in honey 🍯')
    return res.status(200).json({ status: 202 })
  }

  const toAddresses = notificationEmails.map((email) => ({
    email: email,
  }))

  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    data: {
      personalizations: [
        {
          to: toAddresses,
          subject: subject,
          dynamic_template_data: {
            formName: formName,
            name: name,
            email: email,
            subject: subject,
            message: message,
          },
        },
      ],
      from: {
        email: fromAddress,
      },
      template_id: templateID,
    },
    url: 'https://api.sendgrid.com/v3/mail/send',
  }

  const sendData = await axios(options)
    .then((response) => {
      console.info('Data sent to SendGrid successfully!')
      return response
    })
    .catch((err) => {
      console.error('Data sent to SendGrid failed')
      return err.response
    })

  res.statusCode = 200
  res.json({ errors: sendData.data.errors, status: parseInt(sendData.status) })
}
