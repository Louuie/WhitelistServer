const express = require('express')
const mongodb = require('../database/mongo')
const minecraft = require('../minecraft/minecraft')
const twitch = require('../twitch/twitch')
const router = express.Router()
const passport = require('passport')


// Get Route used to render the whitelist page to the user
router.get('/', twitch.isAuthenticated, twitch.refreshToken, twitch.getUser, mongodb.twitchIDExists, twitch.getSubscriptionStatus, (req, res) => {
    res.render('whitelist', {profilepicture: req.userprofileimg})
})

// Post Route of the whitelist form - used for what happens when a user tries to whitelist themselves
router.post('/', twitch.isAuthenticated, twitch.refreshToken, twitch.getUser, minecraft.getUUID, mongodb.insertUUID, minecraft.whitelistPlayer, (req, res) => {
    res.redirect(`whitelist/${req.body.minecraftUsername}`)
})


// Get Route of the user URL page - used when a player tries to go the user URL page
router.get('/:user', twitch.isAuthenticated, twitch.refreshToken, twitch.getUser, twitch.getSubscriptionStatus, mongodb.ifPlayerExists, minecraft.getWhitelistStatus, minecraft.getAvatar, (req, res) => {
    res.render('whitelist/user', {minecraftUsername: req.params.user, status: req.status, minecraftAvatar: req.minecraftAvatar, profilepicture: req.userprofileimg})
})


// Post Route of the user URL page - used for refreshing the players whitelist status
router.post('/:user', twitch.isAuthenticated, twitch.refreshToken, twitch.getUser, twitch.getSubscriptionStatus, minecraft.getWhitelistStatus, minecraft.getAvatar, (req, res) => {
    res.render('whitelist/user', {minecraftUsername: req.params.user, minecraftAvatar: req.minecraftAvatar, status: req.status, profilepicture: req.userprofileimg})
})


module.exports = router