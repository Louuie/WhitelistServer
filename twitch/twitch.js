const passport = require('passport');
const axios = require('axios');
const request = require('request');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const dotenv = require('dotenv').config();
const minecraft = require('../minecraft/minecraft');
let userData = {  };

const passportInitialization = () => {
    passport.use('twitch', new OAuth2Strategy({
        authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
        tokenURL: 'https://id.twitch.tv/oauth2/token',
        clientID: `${process.env.CLIENT_ID}`,
        clientSecret: `${process.env.CLIENT_SECRET}`,
        callbackURL: "http://localhost:3000/auth/twitch/callback/",
        scope: "user:read:subscriptions",
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
};

const prepareAuthorization = (req, res, next) => {
    passportInitialization()
    next()   
};

const getUser = (req, res, next) => {
    const options = {
        url: 'https://api.twitch.tv/helix/users',
        method: 'GET',
        headers: {
            'Client-ID': process.env.CLIENT_ID,
            'Authorization': 'Bearer ' + req.user.accessToken
        }
    }
    axios(options)
    .then(function (response) {
        const fetchUser = response.data
        if(fetchUser.error === 'Unauthorized') { res.redirect('/login') } else {
            userData = (fetchUser.data[0])
            req.userid = userData.id
            req.displayName = userData.display_name
            req.userprofileimg = userData.profile_image_url
            req.token = req.user.accessToken
            return next()
        }
    })
    .catch(function (err) {
        console.log(err);
    });
};

const getFollowingStatus = (req, res, next) => {
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
      axios(options)
      .then(function (response) {
        const followData = response
        console.log(followData.total)
        console.log(followData.data[0].is_gift)
        if(followData.total === 0) { res.send("Sorry you don't have access to this webpage, please follow that person") } else { return next() }
      })
      .catch(function (err) {
          console.log(err);
      });
};

const getSubscriptionStatus = (req, res, next) => {
    passportInitialization()
    const options = {
        url: `https://api.twitch.tv/helix/subscriptions/user?broadcaster_id=71092938&user_id=${req.userid}`,
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Authorization': 'Bearer ' + req.user.accessToken,
            'Client-ID': process.env.CLIENT_ID
        }
      }
      axios(options)
      .then(function (response) {
        const subscriptionData = response
        if(subscriptionData.status === 404) { minecraft.removeWhitelistedPlayer(req.mcname); res.send("Sorry you don't have access to this webpage, please subscribe to xQcOW on twitch.tv to access this page"); } else { return next() }
      })
      .catch(function (err) {
          console.log(err);
      });
};

const logUserOut = (req, res, next) => {
    const options = {
        url: `https://id.twitch.tv/oauth2/revoke?client_id=${process.env.CLIENT_ID}&token=${req.token}`,
        method: 'POST'
      }
      axios(options)
      .then(function (response) {
        req.session.destroy(function (err) {
            res.redirect('/login')
        })
      })
      .catch(function (err) {
          console.log(err);
      });
    next()
};

const refreshToken = (req, res, next) => {
    const options = {
        url: `https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${req.user.refreshToken}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
        method: 'POST'
      }
      request(options, function(error, response, body) {
        const refreshData = JSON.parse(body)
        req.user.accessToken = refreshData.access_token
        return next()
      })
};

const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) { return next() } else { res.redirect('/login') }
    //console.log(`first token ${req.user.refreshToken}`)
};

const notAuthenticated = (req, res, next) => {
    console.log(`Visiting the login page status ${req.isAuthenticated()}`)
    if(req.isUnauthenticated()) { return next() } else { res.redirect('/whitelist') }
};


module.exports = { prepareAuthorization, getUser, getFollowingStatus, getSubscriptionStatus, logUserOut, isAuthenticated, notAuthenticated, refreshToken}