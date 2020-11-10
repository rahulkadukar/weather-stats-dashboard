import React, { Component , useState } from 'react'
import ThemeContext from '../core/ThemeContext.jsx'
import styled from 'styled-components'

const DivStyled = styled.div`
  border-radius: 2px;
  box-shadow: 0 1px 4px rgba(0,0,0,1);
  color: ${props => props.theme === 'light' ? '#ECEFF1' : 'black'};
  flex: 1 1 0px;
  max-width: 240px;
  display: flex;
  flex-direction: column;
  font-size: 20px;
  text-align: center;
  transition: color 0.5s ease-in-out;
  @media (max-width: 480px) {
    max-width: 420px;
  }
`

const CardHeader = styled.div`
  background-color: #f44336;
  padding: 10px;
  height: 20px;
  font-size: 20px;
`

const CardBody = styled.div`
  background-color: #e57373;
  padding: 10px;
  flex: 1;
  font-size: 50px;
`

const CardItem = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: space-between;
`

const Card = (props) => {
  return <ThemeContext.Consumer>
    { (value) =>
        <DivStyled {...value} {...props}>
        {
          props.data.map((r) => {
            return <CardItem>
              <CardHeader>{r.name}</CardHeader>
              <CardBody>{r.val}</CardBody>
            </CardItem>
          })
        }
        </DivStyled>
    }
  </ThemeContext.Consumer>
}

export default Card