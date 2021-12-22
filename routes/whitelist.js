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
    res.render('whitelist/user', {minecraftUsername: req.params.user, status: req.status, minecraftAvatar: req.minecraftAvatar})
})



module.exports = router