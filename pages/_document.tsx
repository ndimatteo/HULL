import Document, { Html, Head, Main, NextScript } from 'next/document'

class _Document extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
          <div id="drawer" />
        </body>
      </Html>
    )
  }
}

export default _Document
