const express = require('express')
const mongodb = require('../database/mongo')
const minecraft = require('../minecraft/minecraft')
const router = express.Router()

// Get Route used to Render a Form to a user - essentially taking them to localhost:3000/whitelist
router.get('/', (req, res) => {
    res.render('whitelist')
})

// Post Route is what happens after the user sumbits a name/data
router.post('/', minecraft.getUUID, mongodb.insertUUID, (req, res) => {
    res.redirect(`whitelist/user?name=${req.body.minecraftUsername}`)
})

router.get('/user', mongodb.ifPlayerExists, minecraft.getAvatar, (req, res) => {
    res.render('whitelist/user', {minecraftUsername: req.query.name, minecraftAvatar: req.minecraftAvatar})
})


// Get router request for the duplicate page that is used if the player is already whitelisted
router.get('/duplicate', (req, res) => {
    res.render('whitelist/duplicate')
})

// Post router request for the duplicate page that is used when the button is pressed to render the whitelist form again
router.post('/duplicate', (req, res) => {
    res.render('whitelist', {minecraftUsername: req.query.name})
})


module.exports = router