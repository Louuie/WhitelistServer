const express = require('express')
const app = express()
const pug = require('pug')
const favicon = require('serve-favicon')
const path = require('path')
const userRouter = require('./routes/users')
const whitelistRouter = require('./routes/whitelist')
const twitchRouter = require('./routes/twitch')
global.dotenv = require('dotenv')

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))
app.use(express.static('public'))
app.use(express.static('images'))
app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.set('view engine', 'pug')

app.use('/users', userRouter)
app.use('/whitelist', whitelistRouter)
app.use('/twitch', twitchRouter)

const port = process.env.PORT || 3000

app.listen(port)