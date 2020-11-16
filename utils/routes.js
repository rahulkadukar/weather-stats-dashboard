const chalk = require('chalk')
const express = require('express')

const router = express.Router()
const { level0, sqlQuery } = require('./postgres')

const cl = console.log

// Middleware that is specific to this router
router.use(function (req, res, next) {
  const returnData = initReturnData()
  const apiRoute = req.url.slice(1)

  switch (apiRoute) {
    case 'fetchSummary': {
      const summaryData = level0.get('summaryData')
      if (!summaryData) { } else {
        printExecutionTime('cacheFetchWeather', returnData, true)
        res.send(Object.assign(returnData, summaryData))
        return
      }
      break
    }
    default: {
      console.log(`[${chalk.cyan(d())}]:[${chalk.yellow(apiRoute)}] [${chalk.red('ERROR')}]`)
    }
  }

  next()
})

// Helper functions
function d() { return new Date().toISOString() }

function calculateTimeTaken(startTime) {
  const t = process.hrtime(startTime)
  return Math.round((t[0] * 1e9 + t[1])/1e6)
}

function initReturnData() {
  return {
    returnCode: 0,
    errMessage: '',
    startTime: process.hrtime()
  }
}

function printExecutionTime(funcName, timeInfo, isCached) {
  const timeTaken = calculateTimeTaken(timeInfo.startTime)
  timeInfo.timeTaken = timeTaken
  const cached = isCached ? chalk.green('[CACHE]') : ''
  cl(`[${chalk.cyan(d())}]:[${funcName}] ${cached} ${timeTaken}ms`)
}

// API functions
async function fetchWeatherSummary() {
  const returnData = initReturnData()
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
    } else {
      returnData.returnCode = dataProc.returnCode
      returnData.errMessage = dataProc.errMessage
    }

    const summaryByYear = `SELECT cityname, year, COUNT(*) AS proc, 0::numeric AS unproc FROM (` +
      `SELECT cityname, extract('year' FROM to_timestamp(cast(rawdata->'currently'->'time' as bigint))::date) AS year ` +
      `FROM darksky_dailyweather WHERE rawdata != '{}') AS a GROUP BY cityname, year ` +
      `UNION ` +
      `SELECT cityname, year, 0::numeric AS proc, COUNT(*) AS unproc FROM (` +
      `SELECT cityname, extract('year' FROM eventtime) AS year FROM darksky_dailyweather WHERE rawdata = '{}') AS a ` +
      `GROUP BY cityname, year ORDER BY cityname, year`

    const summaryData = await sqlQuery(summaryByYear)
    if (summaryData.returnCode === 0) {
      returnData.summaryData = summaryData.dbResult
    } else {
      returnData.returnCode = summaryData.returnCode
      returnData.errMessage = summaryData.errMessage
    }
  } catch (excp) {
    const excpMessage = excp.message ? excp.message : `Error in processing fetchSummary`
    returnData.returncode = -1
    returnData.errMessage = excpMessage
  } finally {
    if (returnData.returnCode === 0) {
      const cacheData = {
        numberOfCities: returnData.numberOfCities,
        processed: returnData.processed,
        summaryData: returnData.summaryData,
        unProcessed: returnData.unProcessed
      }

      level0.set(`summaryData`, cacheData, 900)
    }

    printExecutionTime(`fetchSummary`, returnData, false)
  }

  return returnData
}
// define the home page route
router.post('/fetchSummary', async function (req, res) {
  const weatherData = await fetchWeatherSummary()
  res.send(weatherData)
})

module.exports = router