const express = require('express')
const router = express.Router()
const passport = require('passport')
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy
const twitch = require('../twitch/twitch')


router.get('/twitch', twitch.prepareAuthorization, passport.authenticate('twitch'), (req, res) => {
    
})


router.get('/twitch/callback', twitch.prepareAuthorization, passport.authenticate('twitch', { failureRedirect: "/errors" }), (req, res) => {
    res.redirect('/whitelist')
})


module.exports = router