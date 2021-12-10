const mc = require('mc-player-api')
const sql = require('../database/database')

// Function used for mc-player-api --- TODO: move this to a seperate folder and .js file then require it in this and call the method in the post route of the form
async function insertUUID(req, res, next){
    sql.createTable()
    const user = await mc.getUser(req.body.minecraftUsername)
    const sqlQuery = `INSERT INTO ${process.env.DB_TABLE} (uuid) VALUES (?)`
    sql.MySQLConn.query(sqlQuery, [user.uuid], function(err, result) {
        if (err) {
            // checks for duplication; if true than redrict to the duplication page and if its not just go to the next thing
            if(err.errno === 1062) {
                res.redirect(`whitelist/duplicate?name=${req.body.minecraftUsername}`)
            }
        } else { 
            console.log(`Successfully stored ${user.uuid} in the database`)
            next() 
        }
    })
}


async function getAvatar(req, res, next) {
    const user = await mc.getUser(req.query.name)
    const fetchedAvatarURL = user.skin.avatar
    req.minecraftAvatar = fetchedAvatarURL
    next()
}


module.exports = {insertUUID, getAvatar}