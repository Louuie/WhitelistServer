const isEmpty = require('lodash.isempty')
const mc = require('mc-player-api')
const rcon = require('rcon')
const env = require('dotenv').config()

// Function used for mc-player-api --- TODO: move this to a seperate folder and .js file then require it in this and call the method in the post route of the form
async function getUUID(req, res, next){
    if(isEmpty(req.body.minecraftUsername)) { return res.redirect('whitelist') }
    const user = await mc.getUser(req.body.minecraftUsername)
    req.mcuser = [{name: user.username, uuid: user.uuid}]
    req.mcname = user.username
    next()
}


async function getAvatar(req, res, next) {
    const user = await mc.getUser(req.params.user)
    const fetchedAvatarURL = user.skin.avatar
    req.minecraftAvatar = fetchedAvatarURL
    next()
}


async function whitelistPlayer(req, res, next) {
    const server = new rcon(process.env.SERVER_IP, process.env.SERVER_PORT, process.env.SERVER_PASSWORD)
    server.on('auth', function() {
        server.send(`whitelist add ${req.mcname}`)
    }).on('response', function(str) {
        console.log(str)
    }).on('err', function(err) {
        console.log(`Error from the server ${err}`)
    }).on('end', function() {
        console.log('Connection Closed from the server')
    })
    server.connect()
    next()
}


async function getWhitelistStatus(req, res, next) {
    const server = new rcon(process.env.SERVER_IP, process.env.SERVER_PORT, process.env.SERVER_PASSWORD)
    server.on('auth', function() {  
        server.send('whitelist list')
    }).on('response', function(str) {
        const users = str.substr(33)
        if(users.includes(req.params.user)) { 
            req.status = 'Whitelisted'
            console.log(`${req.params.user} is in the whitelist array`) 
        } 
        else { console.log(`${req.params.user} is not whitelisted`); req.status = 'Not Whitelisted' }
    }).on('err', function(err) {
        console.log(`Error from the server ${err}`)
    }).on('end', function() {
        console.log('Connection Closed from the server')
        process.exit()
    })

    server.connect()
    next()
}





module.exports = {getUUID, getAvatar, getWhitelistStatus, whitelistPlayer}