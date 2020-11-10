const express = require('express')
const router = express.Router()
const { sqlQuery } = require('./postgres')

// Middleware that is specific to this router

// API functions
async function fetchWeatherSummary() {
  const returnData = {
    returnCode: 0,
    errMessage: '',
    name: 'Rahul Kadukar'
  }

  const t = `"public".darksky_dailyweather`

  try {
    const fetchCities = `SELECT DISTINCT cityname FROM ${t}`
    const numberOfCities = await sqlQuery(fetchCities)
    if (numberOfCities.returnCode === 0) {
      returnData.numberOfCities = numberOfCities.dbResult
    }

    const fetchIncomplete = `SELECT cityname, COUNT(*) FROM ${t} WHERE rawdata = '{}' GROUP BY cityname`
    const dataUnProc = await sqlQuery(fetchIncomplete)
    if (dataUnProc.returnCode === 0) {
      returnData.unProcessed = dataUnProc.dbResult
    }

    const fetchComplete = `SELECT cityname, COUNT(*) FROM ${t} WHERE rawdata != '{}' GROUP BY cityname`
    const dataProc = await sqlQuery(fetchComplete)
    if (dataProc.returnCode === 0) {
      returnData.processed = dataProc.dbResult
    }
  } catch (excp) {
    console.log(excp.message)
  } finally {

  }

  return returnData
}
// define the home page route
router.post('/fetchSummary', async function (req, res) {
  const weatherData = await fetchWeatherSummary()
  res.send(weatherData)
})

module.exports = router