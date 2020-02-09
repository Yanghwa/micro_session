const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const uuidv4 = require('uuid/v4')

const app = express()
const port = 3003

const sess = {
  secret: 'keyboard cat',
  cookie: { maxAge: 60000, secure: true },
  resave: false,
  saveUninitialized: false,
  genid: (req) => uuidv4()
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser('fvnslfjslkfjslfjslf'))
app.use(session(sess))

app.post('/signin', async (req, res) => {
  if (req.body.username) {

  } else {
    res.sendStatus(401)
    return
  }

  if (req.body.password) {

  } else {
    res.sendStatus(401)
    return
  }
  console.log(req.body)
  // console.log(req.headers)
  // 0elY1tQX15
  const key =  uuidv4()
  console.log(key)
  res.cookie("aaaaaaaa", key, {
    signed: true,
    maxAge: 10000
  })
  res.status(200).send(key)
  // res.sendStatus(200) 
})

app.get('/signout', async (req, res) => {
  // response = await host.get(req.url)
  res.send("not yet")
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))