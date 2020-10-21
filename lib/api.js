import axios from 'axios'
import client from './sanity'
import sanityImage from '@sanity/image-url'

const site = `
  "site": {
    "seo": *[_type == "seoSettings"][0]{
      title,
      description,
      handle,
      share
    },
		"social": *[_type == "generalSettings"][0]{
      "items": social[]{
        icon,
        url
      }
    },
  }
`

const menus = `
  "menus": {
    "header": *[_type == "menu" && slug.current == 'header'][0]{
      items[]{
        _key,
        _type,
        title,
        link,
        isButton,
        "type": page._ref,
        "page":page->{"slug":slug.current},
        items[]{
          _key,
          _type,
          title,
          link,
          isButton,
          "type": page._ref,
          "page":page->{"slug":slug.current},
        },
      },
    },
    "footer": *[_type == "menu" && slug.current == 'footer'][0]{
      items[]{
        _key,
        _type,
        title,
        link,
        isButton,
        "type": page._ref,
        "page":page->{"slug":slug.current},
        items[]{
          _key,
          _type,
          title,
          link,
          isButton,
          "type": page._ref,
          "page":page->{"slug":slug.current},
        },
      },
    }
  }
`

const blockContent = `
  ...,
  markDefs[]{
    ...,
    _type == "link" => {
      "type": @.page._ref,
      "slug": @.page->slug
    },
    _type == "button" => {
      "type": @.page._ref,
      "slug": @.page->slug
    }
  },
  _type == "figure" => {
    ...,
    alt,
    asset,
    "type": asset->mimeType,
    "aspectRatio": asset->metadata.dimensions.aspectRatio
  }
`

export const imageBuilder = sanityImage(client)

export async function getAllPagesWithSlug() {
  const data = await client.fetch(`*[_type == "page"]{ "slug": slug.current }`)
  return data
}

export async function getAllRedirects() {
  const data = await client.fetch(`*[_type == "redirect"]{ from, to }`)
  return data
}

export async function getStaticPage(doc) {
  const data = await client.fetch(
    `
    {
      "page": *[_type == $doc][0]{
        title,
        hero,
        carousel,
        seo
      },
      ${menus},
      ${site}
    }
    `,
    { doc }
  )

  return data
}

export async function getErrorPage() {
  const data = await client.fetch(
    `
    {
      "page": *[_type == 'errorPage'][0]{
        title,
        content[]{
          ${blockContent}
        }
      },
    }
    `
  )

  return data
}

export async function getPage(slug) {
  const slugs = [`/${slug}`, slug, `/${slug}/`]

  const data = await client.fetch(
    `
    {
      "page": *[_type == "page" && slug.current in $slugs][0]{
        title,
        "slug": slug.current,
        hero,
        content[]{
          _type == 'hero' => {
            _type,
            _key,
            photo
          },
          _type == 'textBlock' => {
            _type,
            _key,
            content[]{
              ${blockContent}
            }
          },
          _type == 'venuesList' => {
            _type,
			      _key,
            title,
            venues[]->{
              title,
              "slug": slug.current,
              "photo": photos[0],
              address,
              phone,
              website
            }
          },
          _type == 'eventsList' => {
            _type,
            _key,
            title,
            items[]{
              title,
              photo,
              date,
              description,
              website
            }
          },
          _type == 'accordionList' => {
            _type,
            _key,
            title,
            items[]{
              "id": _key,
              title,
              content[]{
                ${blockContent}
              }
            }
          },
          _type == 'formContact' => {
            _type,
            _key,
            formName,
            fromAddress,
            notificationEmails,
            templateID,
            submit,
            successMsg[]{
              ${blockContent}
            },
            errorMsg[]{
              ${blockContent}
            }
          },
          _type == 'formNewsletter' => {
            _type,
            _key,
            action,
            submit,
            successMsg[]{
              ${blockContent}
            },
            errorMsg[]{
              ${blockContent}
            },
            terms[]{
              ${blockContent}
            }
          }
        },
        seo
      },
      ${menus},
      ${site}
    }
    `,
    { slugs }
  )

  return data
}

export async function postEmail(apiKey, data) {
  const {
    formName = 'Contact Form',
    fromAddress,
    notificationEmails,
    templateID,
    name,
    email,
    subject,
    message,
  } = data

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

  const post = await axios(options)
    .then((response) => {
      console.log('SendGrid Success')
      return response
    })
    .catch((err) => {
      console.log('SendGrid Failed')
      return err.response
    })

  return post
}
