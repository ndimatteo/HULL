import React from 'react'

import Layout from '../components/layout'
import { getErrorPage } from '../lib/api'
import BlockContent from '@sanity/block-content-to-react'
import { serializers } from '../modules'

const ErrorPage = ({ data }) => {
  const { page } = data

  return (
    <Layout
      page={{
        title: page.title,
      }}
    >
      <section className="section is-error">
        <div className="section--content">
          {page.content ? (
            <BlockContent
              renderContainerOnSingleChild
              className="rc"
              blocks={page.content}
              serializers={serializers}
            />
          ) : (
            <>
              <h1 className="is-mb0">Fatal Error</h1>
              <p>Page not found</p>
            </>
          )}
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps(context) {
  const pageData = await getErrorPage()

  return {
    props: {
      data: pageData,
    },
  }
}

export default ErrorPage
