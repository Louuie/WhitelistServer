const error = require('../errors/errors.json')

// Middleware function that catches error for the users page
const Handler = (req, res, next) => {
    if(req.query.error === `${error.codes['null-table']}`) return res.send('Sorry the table you are trying to query to does not exist, please contact the admistrator of the server!')
    if(req.query.error === `${error.codes['failed-login']}`) return res.send('Incorrect username or password!')
    res.send('Whoops some error happened!')
    next()
};


module.exports = { Handler }