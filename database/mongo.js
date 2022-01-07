const { MongoClient } = require('mongodb')
const error = require('../errors/errors.json')
const env = require('dotenv').config()
const isEmpty = require('lodash.isempty')
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

// This middleware function is used for creating the collection as well as creating the unique index.
const createUniqueIndex = () => {
    client.connect(err => {
        const db = client.db(process.env.DB_NAME)
        db.createCollection('players', function(err, res) {})
        const collection = db.collection(process.env.DB_COLLECTION)
        collection.createIndex({twitch_user_id: 1, name: 1, uuid: 1}, {unique: true}, function(err, result) {})
    })
};

// This middleware function inserts the UUID of the player into the database so they can be whitelisted, if the player already exists it will just send them to that user page.
const insertUUID = async (req, res, next) => {
    createUniqueIndex()
    const db = client.db(process.env.DB_NAME)
    const collection = db.collection(process.env.DB_COLLECTION)
    try {
        await client.connect()
        await collection.insertMany(req.user)
        console.log(`Twitch user ${req.displayName}(${twitch_id}) with minecraft name ${req.mcname} has been inserted!`)
        await client.close()
        return next()
    } catch(err) {
        client.close()
        res.redirect(`whitelist/${req.body.minecraftUsername}`)
        console.log('dupped user')
    }
};

// This middleware function will get essentially list all the players in the DB and send in json form on localhost:3000/users/list page (used only for admins)
const getAllWhitelistedPlayers = async (req, res, next) => {
    const collection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION)
    try {
        await client.connect()
        collection.find({}, {projection: { _id: 0, twitch_user_id: 1, name: 1, uuid: 1}}).toArray(function(err, result) {
            if (err) throw err
            res.json(result)
            return next()
        })
    } catch(err) {
        res.redirect(`failure?error=${error.codes['null-table']}`)
    } 
};

// This middleware function is used when checking if a player exists in the DB, this is used in the get middleware function of whitelist/user page. Redirects the user to the main whitelist page if they try to go to a user that is not in the DB 
const ifPlayerExists = async (req, res, next) => {
    const collection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION)
    try {
        await client.connect()
        collection.findOne({name: req.params.user}, function(err, result) {
            if(result != null) {
                return next()
            } else { res.redirect('/whitelist') }
        })
    } catch(err) {
       
    }
};

 // This middleware function is used to check if a twitch user already has a whitelisted minecraft player attached to there account
const twitchIDExists = async (req, res, next) => {
    const collection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION)
    try {
        await client.connect()
        collection.find({twitch_user_id: req.userid}, {projection: { _id: 0, twitch_user_id: 1, name: 1, uuid: 1}}).toArray(function(err, result) {
            req.mcuser = result[0].name
            if(isEmpty(result)) {
                return next()
            } else { res.redirect(`/whitelist/${result[0].name}`) }
        })
    } catch(err) {
        console.log(err)
        res.redirect(`failure?error=${error.codes['null-table']}`)
    } 
};




module.exports = { insertUUID, getAllWhitelistedPlayers, ifPlayerExists, twitchIDExists}