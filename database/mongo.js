const { MongoClient } = require('mongodb')
const error = require('../errors/errors.json')
const env = require('dotenv').config()
const uri = process.env.MONGODB_URI

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

async function createUniqueIndex() {
    client.connect(err => {
        const db = client.db(process.env.DB_NAME)
        db.createCollection('players', function(err, res) {
            console.log('creating collection if it doesnt already exist')
        })
      })
    client.connect(err => {
        const db = client.db(process.env.DB_NAME)
        const collection = db.collection(process.env.DB_COLLECTION)
        collection.createIndex({name: 1, uuid: 1}, {unique: true}, function(err, result) {
            console.log('creating unique index if it doesnt already exist')
        })
    })
}


async function insertUUID(req, res, next) {
    createUniqueIndex()
    const db = client.db(process.env.DB_NAME)
    const collection = db.collection(process.env.DB_COLLECTION)
    try {
        await client.connect()
        await collection.insertMany(req.mcuser)
        console.log(`${req.mcuser.name} has been inserted!`)
        client.close()
        return next()
    } catch(err) {
        client.close()
        res.redirect(`whitelist/duplicate?name=${req.body.minecraftUsername}`)
    }
}


async function getWhitelistedPlayers(req, res, next) {
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


module.exports = { insertUUID, getWhitelistedPlayers }