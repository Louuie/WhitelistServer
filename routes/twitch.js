const express = require('express')
const router = express.Router()
const passport = require('passport')
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy
const twitchapi = require('../twitchapi/twitchapi')


router.get('/', twitchapi.prepareAuthorization, passport.authenticate('twitch'))


router.get('/callback', twitchapi.prepareAuthorization, passport.authenticate('twitch', { failureRedirect: "/errors" }), (req, res) => {
    res.redirect('/whitelist')
})


module.exports = router