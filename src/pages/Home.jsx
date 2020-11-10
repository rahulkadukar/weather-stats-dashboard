import React, { Component } from 'react'
import Card from '../components/Card.jsx'
import CardSplit from '../components/CardSplit.jsx'
import styled from 'styled-components'

const RowDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`

const Home = () => {
  const splitData = [
    { "name": "Completed", "val": 200 },
    { "name": "To Do", "val": 3212 }
  ]

  return (
    <RowDiv>
      <Card header="Number of cities">4</Card>
      <CardSplit data={splitData} />
    </RowDiv>
  )
}

export default Home
