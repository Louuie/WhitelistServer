const express = require('express')
const mongodb = require('../database/mongo')
const minecraft = require('../minecraft/minecraft')
const router = express.Router()

// Get Route used to render the whitelist page to the user
router.get('/', (req, res) => {
    res.render('whitelist')
})

// Post Route of the whitelist form - used for what happens when a user tries to whitelist themselves
router.post('/', minecraft.getUUID, mongodb.insertUUID, minecraft.whitelistPlayer, (req, res) => {
    res.redirect(`whitelist/${req.body.minecraftUsername}`)
})


// Get Route of the user URL page - used when a player tries to go the user URL page
router.get('/:user', mongodb.ifPlayerExists, minecraft.getWhitelistStatus, minecraft.getAvatar, (req, res) => {
    res.render('whitelist/user', {minecraftUsername: req.params.user, minecraftAvatar: req.minecraftAvatar, status: req.status})
})

// Post Route of the user URL page - used for refreshing the players whitelist status
router.post('/:user', minecraft.getWhitelistStatus, minecraft.getAvatar, (req, res) => {
    res.render('whitelist/user', {minecraftUsername: req.params.user, minecraftAvatar: req.minecraftAvatar, status: req.status})
})




module.exports = router