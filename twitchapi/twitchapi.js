const passport = require('passport')
const request = require('request')
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy
const dotenv = require('dotenv').config()
let userData = {  }


async function passportInitialization() {
    passport.use('twitch', new OAuth2Strategy({
        authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
        tokenURL: 'https://id.twitch.tv/oauth2/token',
        clientID: `${process.env.CLIENT_ID}`,
        clientSecret: `${process.env.CLIENT_SECRET}`,
        callbackURL: "http://localhost:3000/twitch/callback/",
        state: true
    },
    function(accessToken, refreshToken, profile, done) {
        profile.accessToken = accessToken
        profile.refreshToken = refreshToken
    
        done(null, profile)
    }
    ))
    
    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });
}


async function prepareAuthorization(req, res, next) {
    passportInitialization()
    next()
}


async function getUser(req, res, next) {
  const options = {
      url: 'https://api.twitch.tv/helix/users',
      method: 'GET',
      headers: {
          'Client-ID': process.env.CLIENT_ID,
          'Authorization': 'Bearer ' + req.user.accessToken
      }
    }

    request(options, function(error, response, body) {
        const fetchUser = JSON.parse(body)
        userData = (fetchUser.data[0])
        req.userid = userData.id
        req.userprofileimg = userData.profile_image_url
        req.token = req.user.accessToken
        next()
    })
}



async function getFollowingStatus(req, res, next) {
    passportInitialization()
      const options = {
          url: `https://api.twitch.tv/helix/users/follows?from_id=${req.userid}&to_id=71092938`,
          method: 'GET',
          headers: {
              'Accept': 'application/vnd.twitchtv.v5+json',
              'Authorization': 'Bearer ' + req.user.accessToken,
              'Client-ID': process.env.CLIENT_ID
          }
        }
    
        request(options, function(error, response, body) {
            const followData = JSON.parse(body)
            console.log(followData.total)
            if(followData.total === 0) { res.send("Sorry you don't have access to this webpage, please follow that person") } else { return next() }
        })
}



async function logUserOut(req, res, next) {
    console.log(req.user.accessToken)
    const options = {
        url: `https://id.twitch.tv/oauth2/revoke?client_id=${process.env.CLIENT_ID}&token=${req.token}`,
        method: 'POST'
      }
      request(options, function(error, response, body) {})
    next()
}



async function isAuthenticated(req, res, next) {
    //console.log(req.isAuthenticated())
    if(req.isAuthenticated()) { return next() } else { res.redirect('/twitch/callback') }
}




module.exports = { prepareAuthorization, getUser, getFollowingStatus, logUserOut, isAuthenticated }