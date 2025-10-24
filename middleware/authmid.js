const jwt = require('jsonwebtoken')

function islogin(req, res, next) {
    const token = req.cookies.token

    if (token == '' || token == undefined) return res.redirect('/login')

    const userData = jwt.verify(token, process.env.sc_key)
    req.user = userData;
    next()
}



module.exports={islogin}