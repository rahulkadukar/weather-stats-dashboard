import React, { useState, useEffect } from 'react'
import './App.css'
import ThemeContext from './core/ThemeContext'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import styled  from 'styled-components'
import "./App.css"

import Toggle from './core/Toggle.jsx'
import P from './core/P'
import Home from './pages/Home.jsx'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
`

const Main = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#303030' : '#FFFFFF'};
  color: ${props => props.theme === 'dark' ? '#ECEFF1' : 'black'};
  transition: background-color 0.75s ease-in-out;
  min-height: 100vh;
  min-width: 100vw;
`

const Navbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
`

const App = (props) => {
  const url = `/api/fetchSummary`

  const initData = {
    numberOfCities: 0,
    processed: [],
    summaryData: [],
    unProcessed: []
  }

  const [ weatherData, updateWeather ] = useState(initData)

  useEffect(() => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json()
    }).then((d) => {
      if (d.returnCode === 0) {
        const dbData = {}
        const keys = ['numberOfCities', 'processed', 'summaryData', 'unProcessed']
        keys.forEach((k) => {
          dbData[k] = d[k]
        })
        updateWeather(dbData)
      }
    })
  },[url])

  return <ThemeContext.Consumer>
    { (value) =>
      <Router>
        <Main theme={value.theme}>
          <Navbar>
            <P style={{fontSize: '24px'}}>Weather Dashboard</P>
            <Toggle callBack={(x) => {this._darkMode(x)}} />
          </Navbar>
          <Container>
            <Switch>
              <Route exact path="/"><Home data={weatherData}/></Route>
            </Switch>
          </Container>
        </Main>
      </Router>
    }
  </ThemeContext.Consumer>
}

export default App;
