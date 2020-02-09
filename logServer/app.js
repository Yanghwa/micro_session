const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
// const session = require('express-session')
// const uuidv4 = require('uuid/v4')

const app = express()
const port = 4003


const sess = {
  secret: 'keyboard cat',
  cookie: { maxAge: 60000, secure: true },
  resave: false,
  saveUninitialized: false
}


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())


// later
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
app.set('trust proxy', true)
// app.use(session(sess))

// app.use((req, res, next) => {
//   console.log(req.url)
//   next()
// })

let logRoute = app.route('/log*');

// to read log
// signRoute.get(async (req, res) => {
//   try {
//     response = await auth.get(req.url)
//     res.send(response.data)
//   } catch (error) {
//     logger.error(error.toJSON())
//     res.send(400)
//   }
// });

const logLevelMap = {
  1: 'TRACE',
  2: 'DEBUG',
  3: 'INFO',
  4: 'WARNING',
  5: 'ERROR'
}


logRoute.post(async (req, res) => {
  try {
    const content = {
      logTime: req.body.logTime,
      prefix: req.body.prefix,
      role: req.body.name + ':' + req.connection.remoteAddress + ':' + req.body.port,
      logLevel: req.body.logLevel,
      logMessage: req.body.logMessage,
      stacktrace: req.body.stacktrace
    }
    const stringTime = new Date(content.logTime).toLocaleDateString() + ' ' + new Date(content.logTime).toLocaleTimeString()
    
    console.log(stringTime, content.prefix, content.logMessage, "[" + JSON.stringify(content.stacktrace), "[" + content.role, logLevelMap[content.logLevel])
    res.sendStatus(200)
  } catch (error) {
    console.error(error)
    res.sendStatus(400)
  }
});

app.listen(port, () => console.log(`Log Server Example app listening on port ${port}!`))