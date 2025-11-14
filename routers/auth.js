const express = require("express");
const routes = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const multer = require("multer")

const { createDir, createusername } = require("../utils/authManger");
const { saveDb, maindb } = require("../config/dbManager");
const { generateOtp, sendMail } = require("../utils/otp-manager");
let otpStore = {};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
const upload = multer({ storage: storage })

routes.get("/signup", (req, res) => {
    res.render("signup");
});

routes.get("/verifyotp", (req, res) => {
    const email = req.query.email;
    res.render("verifyotp", { email });
});

routes.post("/signup", upload.single("image"), async (req, res) => {
    const { fullname, password, email, appname, number } = req.body;
    const src = req.file.path || ''
    const generatedOtp = generateOtp();
    const username = createusername(fullname);

    otpStore[email] = {
        otp: generatedOtp,
        expired: Date.now() + 5 * 60 * 1000,
        username,
        fullname,
        appname,
        number,
        password,
        email,
        src
    };

    const mail = await sendMail(email, generatedOtp);

    if (mail) {
        return res.json({ success: true, redirect: `/Auth/verifyotp?email=${email}` });
    }
});

routes.post("/verifyotp", async (req, res) => {
    const { otp, email } = req.body;

    const data = otpStore[email];
    const db = maindb();

    if (!data) {
        return res.json({ success: false, redirect: `/Auth/verifyotp?email=${email}` });
    }

    const isValid = data.otp === otp && Date.now() < data.expired;
    let apikey = cryptoJs.AES.encrypt(data.username, process.env.JS_SCR).toString();

    if (isValid) {
        const slant = await bcrypt.genSalt(10);
        const has = await bcrypt.hash(data.password, slant);
        const username = data.username;

        db[data.username] = {
            fullname: data.fullname,
            password: has,
            email: data.email,
            number: data.number,
            appname: data.appname,
            apikey: apikey,
            src: data.src,
            save: true
        };

        let result = saveDb(db);
        let result2 = createDir(data.username);

        if (result && result2) delete otpStore[email];

        const token = jwt.sign({ username }, process.env.sc_key);
        res.cookie('token', token);
        res.json({ success: true, redirect: '/' });
    }
    else {
        return res.json({ success: false, redirect: `/Auth/verifyotp?email=${email}` });
    }
});

module.exports = routes;