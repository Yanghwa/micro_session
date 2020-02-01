const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const session = require('express-session')
const uuidv5 = require('uuid/v5')
const uuidv4 = require('uuid/v4')

const app = express()
const port = 3001

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


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// later
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}
app.set('trust proxy', 1)
app.use(session(sess))

app.use((req, res, next) => {
    console.log(req.session)
    console.log(req.sessionID)
    next()
})

app.get('/', async (req, res) => {
    response = await host.get(req.url)
    res.send(response.data)
})

app.route('/api/*', async (req, res) => {
    response = await api.get(req.url)
    res.send(response.data)
})

app.route('/sign*')
    .get(async (req, res) => {
        response = await auth.get(req.url)
        res.send(response.data)
    })
    .post(async (req, res) => {
        response = await auth.post(req.url, req.body)
        res.cookie("fhfhf", req.session.cookie)
        res.send(response.data)
    })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))