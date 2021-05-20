import React from 'react'

// TODO: type this
const generateSchema = (data: any) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export default generateSchema
