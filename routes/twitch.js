const express = require('express')
const router = express.Router()



router.get('/', (req, res) => {
    res.redirect(`https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=g444oopnb330osfaplws1ldeql18kf&redirect_uri=http://localhost:3000/whitelist/&scope=user_read`)
})




module.exports = router