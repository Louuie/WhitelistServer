const express = require('express')
const app = express()
const session = require('express-session')
const pug = require('pug')
const favicon = require('serve-favicon')
const path = require('path')
const userRouter = require('./routes/users')
const whitelistRouter = require('./routes/whitelist')
<<<<<<< HEAD
=======
const twitchRouter = require('./routes/twitch')
const passport = require('passport')
>>>>>>> 241e588 (users can be authed and and users can log out; users profile picture can be fitched)
global.dotenv = require('dotenv')

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))
app.use(session({secret: "SESSION_SECRET", resave: false, saveUninitialized: false}))
app.use(express.static('public'))
app.use(express.static('images'))
app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'pug')

app.use('/users', userRouter)
app.use('/whitelist', whitelistRouter)

const port = process.env.PORT || 3000

app.listen(port)