const express = require('express')
const router = express.Router()
const twitch = require('../twitch/twitch')

router.post('/', twitch.isAuthenticated, twitch.getUser, twitch.logUserOut, (req, res) => {})

module.exports = router