import React, { Component } from 'react'

export default class Robots extends Component {
  static getInitialProps({ req, res }) {
    res.setHeader('Content-Type', 'text/plain')
    res.write(`Sitemap: https://${req.headers.host}/sitemap.xml
    
User-agent: *
Allow: /*
Disallow: /api/*`)
    res.end()
  }
}
