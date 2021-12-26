const express = require('express')
const router = express.Router()
const passport = require('passport')
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy
const twitchapi = require('../twitchapi/twitchapi')


router.get('/', twitchapi.prepareAuthorization, passport.authenticate('twitch'))


router.get('/logout', twitchapi.logoutInitialization, passport.authenticate('twitch'), twitchapi.getUser, twitchapi.logUserOut, (req, res) => {

})

router.get('/logout/success', (req, res) => {
    res.redirect('/')
})





module.exports = router