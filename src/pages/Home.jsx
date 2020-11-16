import React from 'react'
import Card from '../components/Card.jsx'
import CardSplit from '../components/CardSplit.jsx'
import styled from 'styled-components'

const colorList = {
  blue: {h: '#26c6da', b: '#b3e5fc'},
  green: {h: '#2e7d32', b: '#81c784'},
  orange: {h: '#f57c00', b: '#ffb74d'},
  red: {h: '#f44336', b: '#e57373' },
  yellow: {h: '#ffeb3b', b: '#fff59d' }
}

const RowDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`

const Table = styled.table`
  box-shadow: 0 1px 4px rgba(0,0,0,1);
  width: 100%;
  margin-top: 40px;
`

const Th = styled.th`
  background-color: #b2ff59;
  color: black;
  font-size: 20px;
  padding: 10px;
  text-align: left;
`

const Td = styled.td`
  background-color: ${props => colorList[props.color] ? colorList[props.color].b : '#b2ff59'};
  color: black;
  padding: 10px;
  font-size: 20px;
`

const ColoredTd = (props) => {
  let cellColor = 'red'
  const itemValue = parseFloat(props.children).toFixed(0)
  if (itemValue > 80) { cellColor = 'green' }
  else if (itemValue >= 60) { cellColor = 'blue' }
  else if (itemValue >= 40) { cellColor = 'yellow' }
  else if (itemValue >= 20) { cellColor = 'orange' }
  return <Td color={cellColor}>{props.children}</Td>
}

const Home = (props) => {
  const d = props.data

  const w = {}
  w.numberOfCities = d.numberOfCities
  w.splitData = [
    {
      'name': 'Processed',
      'val': d.processed.reduce(function (a,b) { return a + parseInt(b.count, 10) },0)
    },
    {
      'name': 'Not Done',
      'val': d.unProcessed.reduce(function (a,b) { return a + parseInt(b.count, 10) },0)
    },
  ]
  const cityList = {}
  const yearList = {}
  d.summaryData.forEach((r) => {
    const cityName = r.cityname
    const yearInfo = r.year.toString().slice(-2)
    if (!(yearList[yearInfo])) { yearList[yearInfo] = { y:0, n:0 } }
    if (!(cityList[cityName])) { cityList[cityName] = { y:0, n:0 } }
    if (!(cityList[cityName][yearInfo])) { cityList[cityName][yearInfo] = { y:0, n:0 } }
    cityList[cityName][yearInfo].y += parseInt(r.proc, 10)
    cityList[cityName][yearInfo].n += parseInt(r.unproc, 10)

    yearList[yearInfo].y += parseInt(r.proc, 10)
    yearList[yearInfo].n += parseInt(r.unproc, 10)

    cityList[cityName].y += parseInt(r.proc, 10)
    cityList[cityName].n += parseInt(r.unproc, 10)
  })

  w.yearList = Object.keys(yearList).sort()
  w.yearListStats = yearList

  w.stats = {
    min: 100,
    max: 0,
    y: 0,
    n: 0
  }

  w.cityList = []

  for (const [k, v] of Object.entries(cityList)) {
    const tempObj = {}
    tempObj.data = Object.assign({}, { name: k }, v)
    w.cityList.push(tempObj)

    if ((v.y * 100 / (v.n + v.y)).toFixed(2) < w.stats.min) {
      w.stats.min = (v.y * 100 / (v.n + v.y)).toFixed(2)
      w.stats.minCity = `${capitalizeCity(k)} [Least done]`
    }

    if ((v.y * 100 / (v.n + v.y)).toFixed(2) > w.stats.max) {
      w.stats.max = (v.y * 100 / (v.n + v.y)).toFixed(2)
      w.stats.maxCity = `${capitalizeCity(k)} [Most done]`
    }
    w.stats.y += v.y
    w.stats.n += v.n
  }

  w.stats.overall = ((100 * w.stats.y) / (w.stats.y + w.stats.n)).toFixed(2)

  function capitalizeCity(city) {
    return city.split(`_`).map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(' ')
  }

  return (
    <div>
      <RowDiv>
        <Card header="Number of cities" color="red">{w.numberOfCities.length}</Card>
        <Card color="orange" header="Overall">{parseFloat(w.stats.overall).toFixed(0)}</Card>
        <Card color="green" header={w.stats.maxCity} >{parseFloat(w.stats.max).toFixed(0)}</Card>
        <Card color="red" header={w.stats.minCity}>{parseFloat(w.stats.min).toFixed(0)}</Card>
        <CardSplit data={w.splitData}/>
      </RowDiv>
      <RowDiv>
      <Table>
        <thead>
          <tr>
            <Th key="header">City</Th>
            {
              w.yearList.map((y) => {
                const yearKey = `header_${y}`
                return <Th key={yearKey}>{y}</Th>
              })
            }
            <Th key="summary">Total</Th>
          </tr>
        </thead>
        <tbody>
        {
          w.cityList.map((r) => {
            const d = r
            const rowKey = `row_${r.data.name}`
            return <tr key={rowKey}>
              <Td key={d.data.name}>{capitalizeCity(d.data.name)}</Td>
              {
                w.yearList.map((y) => {
                  const itemKey = `item_${d.data.name}_${y}`
                  const percentDone = (d.data[y].y * 100 / (d.data[y].y + d.data[y].n)).toFixed(2)
                  return <ColoredTd key={itemKey}>
                    { percentDone === '100.00' ? '100' : percentDone }
                  </ColoredTd>
                })
              }


              <ColoredTd key={`footer${d.data.name}`}>
                {(d.data.y * 100 / (d.data.y + d.data.n)).toFixed(2) === '100.00' ? '100' : (d.data.y * 100 / (d.data.y + d.data.n)).toFixed(2) }
              </ColoredTd>
            </tr>
          })
        }
        <tr>
          <Th key="header">Summary</Th>
          {
            w.yearList.map((y) => {
              const yearKey = `footer_${y}`
              const percentDone = ( w.yearListStats[y].y * 100 / (w.yearListStats[y].y + w.yearListStats[y].n)).toFixed(2)
              return <ColoredTd key={yearKey}>
                { percentDone === '100.00' ? '100' : percentDone }
              </ColoredTd>
            })
          }

          <ColoredTd>{parseFloat(w.stats.overall).toFixed(2)}</ColoredTd>
        </tr>
        </tbody>
      </Table>
      </RowDiv>
    </div>
  )
}

export default Home
