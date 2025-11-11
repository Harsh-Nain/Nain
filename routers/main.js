const express = require('express')
const routes = express.Router();
const { islogin } = require("../middleware/authmid");
const { maindb, readapi, readuser, saveuser, saveDb } = require("../config/dbManager");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const utilsPath = path.resolve(__dirname, '..');

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

routes.get('/', islogin, (req, res) => {
    const username = req.user.username;
    const db = maindb();
    const userpath = path.join(utilsPath, process.env.User_db, username)
    const files = fs.readdirSync(path.join(userpath, 'Schema'))
    const files1 = fs.readdirSync(path.join(userpath, 'MainDataBase'))
    let total = 0

    files.forEach(file => {
        const store = fs.statSync(path.join(userpath, 'Schema', `${file}`)).size
        total += store
    });

    files1.forEach(file => {
        const store = fs.statSync(path.join(userpath, 'MainDataBase', `${file}`)).size
        total += store
    });

    const read = readapi();
    const saveusers = readuser();
    const saved = Object.keys(saveusers)
    let api = null
    let addeduser = []
    let post = []
    let dat = {}

    saved.slice(-2).forEach(element => {
        addeduser.push(db[element].password);
        post.push(db[element].src);
        dat[element] = { save: true }
    })
    saveuser(dat)

    if (!read[username]) {
        api = read['guest']
    } else {
        api = read[username]
    }
    const sc = api.success / api.totalRequest * 100
    sc.toString().split('.')[0] 
    const fa = api.fail / api.totalRequest * 100
    fa.toString().split('.')[0] 

    const data = db[username];
    if (!data) res.redirect('/login')

    res.render('index', { data, username, api, fa, sc, saved, addeduser, post, total });
});

routes.get('/update', islogin, (req, res) => {
    const username = req.user.username;
    const db = maindb();
    const user = db[username]
    res.render('update', { user })
})

routes.post('/update', upload.single("image"), islogin, (req, res) => {
    const username = req.user.username;
    const { fullname, appname, number } = req.body;
    const src = req.file.path || ''
    const db = maindb();
    db[username].fullname = fullname
    db[username].appname = appname
    db[username].number = number
    db[username].src = src
    saveDb(db)

    return res.json({ success: true, redirect: '/' });
})

routes.get('/login', (req, res) => {
    res.render('login');
});

routes.get('/logout', (req, res) => {
    res.cookie('token', '');
    res.redirect('login');
});

routes.post('/login', (req, res) => {
    const { username, password } = req.body;
    const db = maindb();
    const us = readuser()

    if (!Object.keys(db).includes(username)) return res.json({ success: false, redirect: '/login' });

    if ((password.includes('$') && password.length == 60) && password == db[username].password) {
        const token = jwt.sign({ username }, process.env.sc_key);
        res.cookie('token', token);
        res.json({ success: true, redirect: '/' });
    }

    bcrypt.compare(password, db[username].password, (err, result) => {
        if (err || !result) return res.json({ success: false, redirect: '/login' });

        us[username] = { save: true }
        saveuser(us)
        const token = jwt.sign({ username }, process.env.sc_key);
        res.cookie('token', token);
        res.json({ success: true, redirect: '/' });
    });
});

module.exports = routes;