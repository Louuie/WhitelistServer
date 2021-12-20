const isEmpty = require('lodash.isempty')
const mc = require('mc-player-api')
const rcon = require('rcon')
const env = require('dotenv').config()

// Function used for mc-player-api --- TODO: move this to a seperate folder and .js file then require it in this and call the method in the post route of the form
async function getUUID(req, res, next){
    if(isEmpty(req.body.minecraftUsername)) { return res.redirect('whitelist') }
    const user = await mc.getUser(req.body.minecraftUsername)
    req.mcuser = [{name: user.username, uuid: user.uuid}]
    next()
}


async function getAvatar(req, res, next) {
    const user = await mc.getUser(req.params.user)
    const fetchedAvatarURL = user.skin.avatar
    req.minecraftAvatar = fetchedAvatarURL
    next()
}



// THIS FUNCTION IS BEING USED IN A TESTING MANNER NOT ACTUALLY BEING USED IN EXPRESS
async function whitelistPlayer(req, res, next) {
    const server = new rcon(process.env.SERVER_IP, process.env.SERVER_PORT, process.env.SERVER_PASSWORD)
    server.on('auth', function() {  
        console.log('Authenticated into the server!')
        server.send('whitelist list')
    }).on('response', function(str) {
        const users = [str.substr(33)]
        if(users.includes(req.params.user)) { console.log(`${req.params.user} is in the whitelist array`); }
        console.log('Not in the array!')
    }).on('err', function(err) {
        console.log(`Error from the server ${err}`)
    }).on('end', function() {
        console.log('Connection Closed from the server')
        process.exit()
    })

    server.connect()
    next()
}





module.exports = {getUUID, getAvatar, whitelistPlayer}