const express = require('express')
const router = express.Router()
const twitch = require('../twitch/twitch')

router.get('/', twitch.notAuthenticated, (req, res) => {
    res.render('twitch/login')
})

router.post('/', (req, res) => {
    res.redirect('/auth/twitch')
})


module.exports = router