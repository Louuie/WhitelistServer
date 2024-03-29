const isEmpty = require('lodash.isempty')
const mc = require('mc-player-api')
const rcon = require('rcon')
const env = require('dotenv').config()

// Middleware function that gets the user UUID and stores it in a request variable
async function getUUID(req, res, next){
    if(isEmpty(req.body.minecraftUsername)) { return res.redirect('whitelist') }
    const user = await mc.getUser(req.body.minecraftUsername)
    req.mcuser = [{name: user.username, uuid: user.uuid}]
    req.mcname = user.username
    next()
}

// Middleware function that gets the user avatar and stores it in a request variable
async function getAvatar(req, res, next) {
    const user = await mc.getUser(req.params.user)
    const fetchedAvatarURL = user.skin.avatar
    req.minecraftAvatar = fetchedAvatarURL
    next()
}


// Middleware function that uses rcon to whitelist a player to our server
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



// Middleware function that retrieves the whitelist status
async function getWhitelistStatus(req, res, next) {
    const server = new rcon(process.env.SERVER_IP, process.env.SERVER_PORT, process.env.SERVER_PASSWORD)
    server.on('auth', function() {  
        server.send('whitelist list')
    }).on('response', function(str) {
        const users = str.substr(33)
        if(users.includes(req.params.user)) { 
            req.status = 'Whitelisted'
            console.log(`${req.params.user} is in the whitelist array`)
            return next() 
        } 
        else { console.log(`${req.params.user} is not whitelisted`); req.status = 'Not Whitelisted'; return next() }
    }).on('err', function(err) {
        console.log(`Error from the server ${err}`)
    }).on('end', function() {
        console.log('Connection Closed from the server')
        process.exit()
    })

    server.connect()
}





module.exports = {getUUID, getAvatar, getWhitelistStatus, whitelistPlayer}