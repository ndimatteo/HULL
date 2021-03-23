import React from 'react'
import styled, { css } from 'styled-components'

const Logo = ({ projectName }) => {
  return (
    <Icon isLogin={projectName}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="215"
        height="150"
        viewBox="0 0 215 150"
      >
        <path d="M50.741,148.621H33.978V66.509H16.9V148.6H.118V0H16.884V51.518h17.06V.013h16.8Z" />
        <path d="M116.358,148.622H99.609v-9.77l-16.653,9.774-17.234-9.87V.017H82.5v129.2l17.081,9.4V.014h16.782Z" />
        <path d="M131.692,142.211V.012h16.834V130.8l21.184,6.024L158.676,150Z" />
        <path d="M176.9,0h16.785V130.795l21.2,6.028c-3.7,4.417-7.347,8.774-11.035,13.177L176.9,142.22Z" />
      </svg>
    </Icon>
  )
}

const Icon = styled.div`
  display: block;
  width: auto;
  height: 2em;
  max-width: 100%;
  margin: -1em auto;
  color: white;

  ${props =>
    props.isLogin &&
    css`
      display: block;
      margin: 0 auto;
      height: 4em;
      color: black;
    `}

  svg {
    display: block;
    margin: 0 auto;
    height: 100%;
    width: auto;
    fill: currentColor;
  }
`

export default Logo
