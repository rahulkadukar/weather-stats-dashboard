import React, { Component , useState } from 'react'
import ThemeContext from '../core/ThemeContext.jsx'
import styled from 'styled-components'

const DivStyled = styled.div`
  border-radius: 2px;
  box-shadow: 0 1px 4px rgba(0,0,0,1);
  color: ${props => props.theme === 'light' ? '#ECEFF1' : 'black'};
  flex: 1 1 0px;
  max-width: 240px;
  font-size: 20px;
  text-align: center;
  transition: color 0.5s ease-in-out;
  @media (max-width: 480px) {
    max-width: 420px;
  }
`

const CardBody = styled.div`
  background-color: #e57373;
  padding: 10px;
  font-size: 200px;
`

const CardHeader = styled.div`
  background-color: #f44336;
  padding: 10px;
  font-size: 20px;
`

const Card = (props) => {
  return <ThemeContext.Consumer>
    { (value) =>
        <DivStyled {...value} {...props}>
          <CardHeader>
            {props.header}
          </CardHeader>
          <CardBody>
            {props.children}
          </CardBody>
        </DivStyled>
    }
  </ThemeContext.Consumer>
}

export default Card