const express = require('express')
const router = express.Router()
const error = require('../errors/errors')
const mongodb = require('../database/mongo')
const security = require('../security/security')

// Get Route that essentaily is taking them to localhost:3000/users that list all the users
router.get('/', (req, res) => {
    res.redirect('users/login')
})


// Get Route for the login page that will be displayed when the user tries to go to the users page
router.get('/login', (req, res) => {
    res.render('users/login')
})

// Post route for the login page
router.post('/login', security.hashPassword, () => {})

// Get Route for the users/list page that essentialy list of all the whitelisted players in json format
router.get('/list', security.fetchHashedPassword, mongodb.getAllWhitelistedPlayers, () => {})

// Get route for the user/failure page that gets rendered when the user enters a incorrect password for the users page
router.get('/failure', error.Handler, () => {})


module.exports = router