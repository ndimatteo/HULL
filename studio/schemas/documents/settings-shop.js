import React from 'react'

export default {
  title: 'Shop Settings',
  name: 'shopSettings',
  type: 'document',
  // __experimental_actions: ['update', 'publish'], // disable for initial publish
  fields: [
    {
      title: 'Shopify Store URL',
      name: 'storeURL',
      type: 'url',
      description: (
        <>
          The{' '}
          <a
            href="https://help.shopify.com/en/manual/online-store/domains"
            target="_blank"
            rel="noopener noreferrer"
          >
            custom domain or subdomain
          </a>{' '}
          connected to your Shopify store
        </>
      ),
      validation: Rule =>
        Rule.uri({
          scheme: ['https']
        })
    },
    {
      title: 'Filter',
      name: 'filter',
      type: 'shopFilter'
    },
    {
      title: 'Sort',
      name: 'sort',
      type: 'shopSort'
    },
    {
      title: 'Cart Message',
      name: 'cartMessage',
      type: 'string',
      description: 'Display a message below the cart checkout button'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Shop Settings'
      }
    }
  }
}
