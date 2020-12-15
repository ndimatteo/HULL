import React from 'react'
import BlockContent from '@sanity/block-content-to-react'

import { getStaticPage, blockContent } from '../lib/api'

import Layout from '../components/layout'
import { serializers } from '../modules'
import VideoLoop from '../components/video-loop'

const ErrorPage = ({ data }) => {
  const { page } = data

  return (
    <Layout
      page={{
        seo: page.seo,
      }}
    >
      <section className="section is-error">
        <VideoLoop id={125635073} width={1} height={1} />

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

export async function getStaticProps() {
  const pageData = await getStaticPage(`
    *[_type == "errorPage"][0]{
      content[]{
        ${blockContent}
      },
      seo
    }
  `)

  return {
    props: {
      data: pageData,
    },
  }
}

export default ErrorPage
