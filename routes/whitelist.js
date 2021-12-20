const express = require('express')
const mongodb = require('../database/mongo')
const minecraft = require('../minecraft/minecraft')
const router = express.Router()

// Get Route used to Render a Form to a user - essentially taking them to localhost:3000/whitelist
router.get('/', (req, res) => {
    res.render('whitelist')
})

// Post Route is what happens after the user submits a name/data
router.post('/', minecraft.getUUID, mongodb.insertUUID, (req, res) => {
    res.redirect(`whitelist/${req.body.minecraftUsername}`)
})


// localhost:3000/whitelist/username instead of localhost:3000/whitelist/user?name=username
router.get('/:user', mongodb.ifPlayerExists, minecraft.getAvatar, (req, res) => {
    res.render('whitelist/user', {minecraftUsername: req.params.user, minecraftAvatar: req.minecraftAvatar})
})

router.post('/:user', minecraft.whitelistPlayer, (req, res) => {
    res.send('test')
})




module.exports = router