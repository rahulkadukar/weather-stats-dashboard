import React from 'react'
import ThemeContext from './ThemeContext.jsx'
import styled from 'styled-components'

const PStyled = styled.p`
  color: ${props => props.theme === 'dark' ? '#ECEFF1' : 'black'};
  text-align: ${props => props.textAlign ? props.textAlign : ''};
  transition: color 0.5s ease-in-out;
`

const P = (props) => {
  return <ThemeContext.Consumer>
    { (value) =>
        <PStyled {...value} {...props}>
          {props.children}
        </PStyled>
    }
  </ThemeContext.Consumer>
}

export default P