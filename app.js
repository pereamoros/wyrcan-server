const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const index = require('./routes/index')

const app = express()

// DB Setup
mongoose.Promise = Promise
mongoose.connect('mongodb://localhost/wyrcan', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
})

// Middlewares
app.use(cors({
  credentials: true,
  origin: ['http://localhost:4200']
}))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Session
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}))

app.use(function (req, res, next) {
  app.locals.user = req.session.currentUser
  next()
})

// Routes
app.use('/', index)

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
