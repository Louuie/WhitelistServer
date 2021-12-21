const { MongoClient } = require('mongodb')
const error = require('../errors/errors.json')
const env = require('dotenv').config()
const uri = process.env.MONGODB_URI

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

// This middleware function is used for creating the collection as well as creating the unique index.
async function createUniqueIndex() {
    client.connect(err => {
        const db = client.db(process.env.DB_NAME)
        db.createCollection('players', function(err, res) {})
        const collection = db.collection(process.env.DB_COLLECTION)
        collection.createIndex({name: 1, uuid: 1}, {unique: true}, function(err, result) {})
    })
}

// This middleware function inserts the UUID of the player into the database so they can be whitelisted, if the player already exists it will just send them to that user page.
async function insertUUID(req, res, next) {
    createUniqueIndex()
    const db = client.db(process.env.DB_NAME)
    const collection = db.collection(process.env.DB_COLLECTION)
    try {
        await client.connect()
        await collection.insertMany(req.mcuser)
        console.log(`${req.mcname} has been inserted!`)
        client.close()
        return next()
    } catch(err) {
        client.close()
        res.redirect(`whitelist/${req.body.minecraftUsername}`)
        console.log('dupped user')
    }
}


// This middleware function will get essentially list all the players in the DB and send in json form on localhost:3000/users/list page (used only for admins)
async function getAllWhitelistedPlayers(req, res, next) {
    const collection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION)
    try {
        await client.connect()
        collection.find({}, {projection: { _id: 0, name: 1, uuid: 1}}).toArray(function(err, result) {
            if (err) throw err
            res.json(result)
            return next()
        })
    } catch(err) {
        res.redirect(`failure?error=${error.codes['null-table']}`)
    }    
}


// This middleware function is used when checking if a player exists in the DB, this is used in the get middleware function of whitelist/user page. Redirects the user to the main whitelist page if they try to go to a user that is not in the DB 
async function ifPlayerExists(req, res, next) {
    const collection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION)
    try {
        await client.connect()
        collection.findOne({name: req.params.user}, function(err, result) {
            //console.log(result)
            if(result != null) {
                return next()
            } else { res.redirect('/whitelist') }
        })
    } catch(err) {
        res.redirect(`failure?error=${error.codes['null-table']}`)
    }
 }


module.exports = { insertUUID, getAllWhitelistedPlayers, ifPlayerExists }