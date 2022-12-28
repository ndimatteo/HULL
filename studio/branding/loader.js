import React from 'react'
import styled from 'styled-components'

const Loader = ({ text = 'Loading...' }) => {
  return (
    <LoadingScreen>
      <LoadingScreenContent>
        <LoadingScreenIcon>
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
        </LoadingScreenIcon>
        <p>{text}</p>
      </LoadingScreenContent>
    </LoadingScreen>
  )
}

const LoadingScreen = styled.div`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  text-align: center;
  display: flex;
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background: #000000;
  color: #f4f4f0;
`

const LoadingScreenContent = styled.div`
  margin: auto;

  p {
    margin-top: 2rem;
    font-size: 13px;
    font-weight: 600;
  }
`

const LoadingScreenIcon = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 6rem;

  svg {
    display: block;
    width: 100%;
    max-width: none;
    height: auto;
    fill: currentColor;
  }
`

export default Loader
