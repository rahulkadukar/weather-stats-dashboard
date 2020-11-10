const bunyanMiddleware = require('bunyan-middleware')
const compression = require('compression')
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const logPath = './logs'
const logger = require('./utils/logger')
const routes = require('./utils/routes')

if (!(fs.existsSync(logPath))) {
  try {
    fs.mkdirSync(logPath)
  } catch (excp) {
    console.log(excp.message)
  }
}

const app = express()

app.use(compression())

app.use(
    bunyanMiddleware({
      headerName: 'X-Request-Id',
      propertyName: 'reqId',
      logName: 'req_id',
      obscureHeaders: ['cookie'],
      logger: logger,
      additionalRequestFinishData: function(req, res) {
        return { 'req': req }
      }
    })
)

// parse application/json
app.use(bodyParser.json())

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '/build')))

// All API routes are handled here
app.use('/api', routes)

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/build/index.html'))
})

const port = process.env.PORT || 4000
app.listen(port)

console.log('App is listening on port ' + port)