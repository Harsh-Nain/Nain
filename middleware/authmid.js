const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js");

function islogin(req, res, next) {
    const token = req.cookies.token

    if (token == '' || token == undefined) return res.redirect('/login')

    const userData = jwt.verify(token, process.env.sc_key)
    req.user = userData;
    next()
}

function checkapi(req, res, next) {
    try {
        const apiKey = req.headers["api-key"];

        if (!apiKey) {
            return res.status(401).json({ error: "API key not found" });
        }

        const bytes = CryptoJS.AES.decrypt(apiKey, process.env.JS_SCR);
        const username = bytes.toString(CryptoJS.enc.Utf8);

        if (!username) {
            return res.status(403).json({ error: "Invalid or expired API key" });
        }

        req.username = username;

        next();
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" ,err});
    }
}

module.exports = { islogin, checkapi }