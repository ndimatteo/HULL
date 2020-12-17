import React, { useState } from 'react'

import Layout from '../components/layout'
import { getStaticPage, modules } from '../lib/api'

import { Module } from '../modules'
import Marquee from '../components/marquee'
import Carousel from '../components/carousel'
import Photo from '../components/photo'
import Drawer from '../components/drawer'
import CursorFollow from '../components/cursor-follow'

import Icon from '../components/icon'

const SixSixSix = ({ data }) => {
  const [showDrawer, setShowDrawer] = useState(false)

  const { site, menus, page } = data

  return (
    <Layout
      site={{
        seo: site.seo,
        social: site.social,
        menus: menus,
      }}
      page={{
        seo: page.seo,
      }}
    >
      <div className="section border-b">
        <div className="section--wrapper">
          <div className="section--content text-center">
            <h2 className="mb-8 font-serif text-7xl">The Marquee</h2>

            <Marquee line="The Magician / The Devil / The Emperor / The Hermit / The Fool / Justice / The High Priestess / Death / The Hierophant /" />
            <Marquee
              reverse
              className="is-white"
              line="The Magician / The Devil / The Emperor / The Hermit / The Fool / Justice / The High Priestess / Death / The Hierophant /"
            />
          </div>
        </div>
      </div>

      <div className="section border-b">
        <div className="section--wrapper">
          <div className="section--content text-center">
            <h2 className="mb-8 font-serif text-7xl">The Gallery</h2>

            {page.carousel && page.carousel?.length > 0 ? (
              <Carousel hasArrows hasCounter>
                {page.carousel.map((photo, key) => (
                  <Photo
                    key={key}
                    photo={photo}
                    aspect="landscape"
                    width={1200}
                    className="carousel--photo"
                  />
                ))}
              </Carousel>
            ) : (
              <p>[add carousel photos in sanity]</p>
            )}
          </div>
        </div>
      </div>

      <div className="section border-b">
        <div className="section--wrapper">
          <div className="section--content text-center">
            <h2 className="mb-8 font-serif text-7xl">The Carousel</h2>
          </div>
        </div>

        {page.carousel2 && page.carousel2?.length > 0 ? (
          <Carousel className="is-mini" hasArrows hasCounter>
            {page.carousel2.map((photo, key) => (
              <Photo
                key={key}
                photo={photo}
                aspectCustom={{ paddingTop: '128.5%' }}
                width={1200}
                className="carousel--photo"
              />
            ))}
          </Carousel>
        ) : (
          <p>[add carousel photos in sanity]</p>
        )}
      </div>

      <div className="section border-b">
        <div className="section--wrapper">
          <div className="section--content text-center">
            <h2 className="mb-8 font-serif text-7xl">The Drawer</h2>

            <button className="btn" onClick={() => setShowDrawer(true)}>
              The Dope Show
            </button>
            <Drawer
              open={showDrawer}
              toggle={setShowDrawer}
              title="The Dope Show"
            >
              <div className="mb-4">
                <div
                  className="has-ar has-ar--custom"
                  style={{ paddingTop: `${(315 / 410) * 100}%` }}
                >
                  <iframe
                    width="410"
                    height="315"
                    src="https://www.youtube.com/embed/5R682M3ZEyk?modestbranding=1&autoplay=1"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <p>
                The music video, directed by Paul Hunter and co-directed by
                Manson, was filmed during the week of August 8, 1998, and
                premiered on August 20, 1998. In scenes reminiscent of The Man
                Who Fell to Earth, Manson appears — red-haired, with his entire
                body, including prosthetic rubber breasts, covered in white
                grease paint — as an androgynous extraterrestrial wandering
                around the Hollywood Hills.
              </p>
              <p>
                He is captured, studied in a laboratory, and eventually
                transported by limousine to a stage where he and the other
                members of the band — the fictional band Omēga and the
                Mechanical Animals — perform the song in concert before
                hysterical fans who end up rioting and crossing the security
                barriers. The music video also features a direct homage to a
                sequence in the Alejandro Jodorowsky film The Holy Mountain,
                involving the destruction of plaster casts of the main
                character's body in a crucifixion pose. Actor Billy Zane makes a
                cameo appearance in the limo sequence, as a recording industry
                executive. This same sequence features parodies of SPIN magazine
                and The National Enquirer.
              </p>
            </Drawer>
          </div>
        </div>
      </div>

      <div className="section border-b">
        <div className="section--wrapper">
          <div className="section--content text-center">
            <h2 className="mb-8 font-serif text-7xl">The Cursor Follow</h2>

            <div className="border max-w-lg mx-auto">
              <CursorFollow
                cursorContent={
                  <span>
                    <Icon name="666" viewBox="0 0 666 666" />
                  </span>
                }
              >
                <Photo
                  isPlaceholder
                  aspect="square"
                  className="product-item--photo"
                />
              </CursorFollow>
            </div>
          </div>
        </div>
      </div>

      {page.content?.map((module, key) => (
        <Module key={key} module={module} />
      ))}
    </Layout>
  )
}

export async function getStaticProps({ preview, previewData }) {
  const pageData = await getStaticPage(
    `
    *[_type == "samplePage"] | order(_updatedAt desc)[0]{
      title,
      content[]{
        ${modules}
      },
      carousel,
      carousel2,
      seo
    }
  `,
    {
      active: preview,
      token: previewData?.token,
    }
  )

  return {
    props: {
      data: pageData,
    },
  }
}

export default SixSixSix
