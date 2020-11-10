import React,  { useEffect, useState } from 'react'
import Card from '@material-ui/core/Card';

const Container = (props) => {
  return (<div className="App">{props.children}</div>)
}

export default function Weather() {
  const initState = {
    'allData': {
      'minutely': {
        'data': []
      }
    },
    'currData': {
      'tempFeels': ''
    },
    'currTemp': '',
    'hourlyData': {
      'data': []
    },
    'dailyData': []
  }

  const [data, updateData] = useState(initState)
  const url = `api/fetchSummary`

  // Empty array as second argument equivalent to componentDidMount
  /*
  useEffect(() => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      return response.json();
    }).then(function(json) {
      console.log(json)
    });
  }, [])

   */

  return ( <Container>
    <Card>Rahul</Card>
  </Container>)
}