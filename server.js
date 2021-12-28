const express = require('express')
const app = express()
const session = require('express-session')
const pug = require('pug')
const favicon = require('serve-favicon')
const path = require('path')
const passport = require('passport')
global.dotenv = require('dotenv')
const userRouter = require('./routes/users')
const whitelistRouter = require('./routes/whitelist')
const authRouter = require('./routes/auth')
const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout')

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))
app.use(session({
    secret: "SESSION_SECRET", 
    resave: false, 
    saveUninitialized: false,
    cookie: {maxAge: 3600000}
}))
app.use(express.static('public'))
app.use(express.static('images'))
app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'pug')

app.use('/users', userRouter)
app.use('/whitelist', whitelistRouter)
app.use('/auth', authRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)

const port = process.env.PORT || 3000

app.listen(port)