const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3003

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/signin', async (req, res) => {
    // response = await host.get(req.url)
    console.log(req.body)
    // console.log(req.headers)
    res.send(req.body)
})

app.get('/signout', async (req, res) => {
    // response = await host.get(req.url)
    res.send("not yet")
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))