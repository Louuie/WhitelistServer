const isEmpty = require('lodash.isempty')
const mc = require('mc-player-api')
const axios = require('axios')
const rcon = require('rcon')
const env = require('dotenv').config()

const getUserInformation = async (username) => {
    try {
        const response = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`)
        return response.data
    } catch (err) { console.log(err) }
}



// Middleware function that gets the user UUID and stores it in a request variable
const storeUUID = async (req, res, next) => {
    if(isEmpty(req.body.minecraftUsername)) { return res.redirect('whitelist') }
    const user = getUserInformation(req.body.minecraftUsername)
    user.then(function (response) {
        const twitch_id = req.userid
        req.user = [{twitch_user_id: twitch_id, name: response.name, uuid: response.id}]
        req.mcname = response.name
        next()
    })
};

// Middleware function that gets the user avatar and stores it in a request variable
const getAvatar = async (req, res, next) => {
    const user = getUserInformation(req.params.user)
    user.then(function (response) { req.minecraftAvatar = `https://crafatar.com/avatars/${response.id}`; next()})
};

// Middleware function that uses rcon to whitelist a player to our server
const whitelistPlayer = (req, res, next) => {
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
};

const removeWhitelistedPlayer = (req, res, next) => {
    const server = new rcon(process.env.SERVER_IP, process.env.SERVER_PORT, process.env.SERVER_PASSWORD)
    server.on('auth', function() {
        server.send(`whitelist remove ${name}`)
        console.log(`${name} has been removed from the whitelist`)
    }).on('response', function(str) {
        console.log(str)
    }).on('err', function(err) {
        console.log(`Error from the server ${err}`)
    }).on('end', function() {
        console.log('Connection Closed from the server')
    })
    server.connect()
    next()
};


const getWhitelistStatus = (req, res, next) => {
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
};


module.exports = {storeUUID, getAvatar, getWhitelistStatus, whitelistPlayer, removeWhitelistedPlayer}