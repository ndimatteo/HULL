import React from 'react'
import styled from 'styled-components'

const Logo = () => {
  return <LogoImg src="/static/logo.svg" alt="Studio Logo" />
}

const LogoImg = styled.img`
  display: block;
  width: auto;
  height: 1.5em;
  max-width: 100%;
  margin: -0.25em 0;
`

export default Logo
