const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const uuidv5 = require('uuid/v5')
const uuidv4 = require('uuid/v4')

const logger = require("./lib/logger")

const app = express()
const port = 3001
logger.setSource("GATEWAY", port)


const host = axios.create({
  baseURL: "http://localhost:3002"
})

const auth = axios.create({
  baseURL: "http://localhost:3003"
})

const api = axios.create({
  baseURL: "http://localhost:3004"
})

const sess = {
  secret: 'keyboard cat',
  cookie: { maxAge: 60000, secure: true },
  resave: false,
  saveUninitialized: false,
  genid: (req) => uuidv4()
}

const keyMap = {}
const signInNotRequiedUriPattern = [
  // '/signin',
  /^\/signin$/,
  'asfasf'
]


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser('fvnslfjslkfjslfjslf'))


// later
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
app.set('trust proxy', 1)
app.use(session(sess))

app.use((req, res, next) => {
  
  const urlhit = signInNotRequiedUriPattern.filter( ( pattern ) => {
    let matched = req.url.match(pattern)
    if (matched != null) {
      return true
    } else {
      return false
    }
  })

  if (urlhit.length <= 0) {
    logger.warning('unexpected url request ', req.url)
    res.sendStatus(401)
    return
  } else {
    logger.debug('valid url request ', req.url)
    next()
  }
})

app.get('/', async (req, res) => {
  response = await host.get(req.url)
  res.send(response.data)
})

app.route('/api/*', async (req, res) => {
  response = await api.get(req.url)
  res.send(response.data)
})

let signRoute = app.route('/sign*');

signRoute.get(async (req, res) => {
  try {
    response = await auth.get(req.url)
    res.send(response.data)
  } catch (error) {
    logger.error('singn in ', error.toJSON())
    res.sendStatus(400)
  }
});

signRoute.post(async (req, res) => {
  try {
    response = await auth.post(req.url, req.body)
    keyMap[response.body] = true
    res.header(response.headers)
    res.sendStatus(200)
    logger.debug('singn in done', req.body.username)
  } catch (error) {
    console.error(error)
    logger.error('singn in ', error)
    res.sendStatus(400)
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))