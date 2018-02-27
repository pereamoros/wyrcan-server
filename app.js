var express = require('express')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
// require cors

var index = require('./routes/index')
var users = require('./routes/users')

var app = express()

// DB Setup

// Session

// Middlewares
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Routes
app.use('/', index)
app.use('/users', users)

// Error handlers
app.use((req, res, next) => {
  res.status(404).json({error: 'not found'})
})

app.use((err, req, res, next) => {
  console.error('ERROR', req.method, req.path, err)

  if (!res.headersSent) {
    res.status(500).json({error: 'unexpected'})
  }
})

module.exports = app
