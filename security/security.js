const env = require('dotenv').config()
const bcrypt = require('bcrypt')
const users = []

async function hashPassword(req, res, next) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const hashedUser = {name: req.body.username, password: hashedPassword}
        users.push(hashedUser)
        const user = users.find(user => user.name === req.body.username)
        if(user == null) { return res.send('Cannot find null user') }
        try {
            if(hashedUser.name === process.env.DB_ADMINUSER && req.body.password === process.env.DB_ADMINPASSWORD) {
                if(await bcrypt.compare(req.body.password, user.password)){
                    res.redirect(`list?username=${user.name}&id=${user.password}`)
                    return next()
                }
            } else {
                console.log('Incorrect username and password')
                res.redirect('failure')
                return next()
            }
        } catch {
            res.status(500).send()
        }
    } catch {
        res.status(500).send()
    }
}


async function fetchHashedPassword(req, res, next) {
    if(req.query.user === null && req.user.id === null) return res.redirect('users/login')
    if(req.query.username === process.env.DB_ADMINUSER && await bcrypt.compare(process.env.DB_ADMINPASSWORD, req.query.id)){
        next()
    } else { res.send('You do not have permission to view this page!') }
}


module.exports = {hashPassword, fetchHashedPassword}