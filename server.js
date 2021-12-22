const express = require('express')
const app = express()
const pug = require('pug')
const userRouter = require('./routes/users')
const whitelistRouter = require('./routes/whitelist')
global.dotenv = require('dotenv')

app.use(express.static('public'))
app.use(express.static('images'))
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

app.set('view engine', 'pug')


app.use('/users', userRouter)
app.use('/whitelist', whitelistRouter)

const port = process.env.PORT || 3000

app.listen(port)