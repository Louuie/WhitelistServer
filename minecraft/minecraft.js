const mc = require('mc-player-api')

// Function used for mc-player-api --- TODO: move this to a seperate folder and .js file then require it in this and call the method in the post route of the form
async function getUUID(req, res, next){
    const user = await mc.getUser(req.body.minecraftUsername)
    req.mcuser = [{name: user.username, uuid: user.uuid}]
    next()
}


async function getAvatar(req, res, next) {
    const user = await mc.getUser(req.query.name)
    const fetchedAvatarURL = user.skin.avatar
    req.minecraftAvatar = fetchedAvatarURL
    next()
}


module.exports = {getUUID, getAvatar}