const express = require('express')
const router = express.Router()
const passport = require('passport')
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy
const twitch = require('../twitch/twitch')


router.get('/twitch', twitch.prepareAuthorization, passport.authenticate('twitch'), (req, res) => {
    
})


router.get('/twitch/callback', twitch.prepareAuthorization, passport.authenticate('twitch', { failureRedirect: "/auth/twitch" }), (req, res) => {
    // I can just render a page and after a few seconds of the delay I can redirect the user
    res.render('twitch/spinner')
})


module.exports = router