const express = require('express')
const pug = require('pug')
global.dotenv = require('dotenv')
const app = express()

app.use(express.static('public'))
app.use(express.static('images'))
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

app.set('view engine', 'pug')


const userRouter = require('./routes/users')
const whitelistRouter = require('./routes/whitelist')

app.use('/users', userRouter)
app.use('/whitelist', whitelistRouter)

app.listen(3000)