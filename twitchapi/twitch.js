const request = require('request')
const isEmpty = require('lodash.isempty')



async function validateUser(req, res, next) {
    const options = {
        url: 'https://id.twitch.tv/oauth2/validate',
        method: 'GET',
        headers: { 'Authorization': 'Oauth ' +  req.query.access_token}
    }
    request(options, function(error, response, body) {
        console.log(req.query.access_token)
        const userData = JSON.parse(body)
        if(userData.status === 401) { res.redirect('/twitch') }
        next()
    })
}



async function checkUser(req, res, next) {
    console.log(req.query.user_read)
    if(isEmpty(req.query.user_read)) { res.redirect('/twitch') }
}


module.exports = { checkUser }