const express = require('express')
const routes = express.Router();
const { islogin } = require("../middleware/authmid");
const { maindb } = require("../config/dbManager");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


routes.get('/', islogin, (req, res) => {
    const username = req.user.username;
    const db = maindb();
    const data = db[username];
    if (!data) res.redirect('/login')

    res.render('index', { data, username });
});

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

    if (!Object.keys(db).includes(username)) return res.json({ success: true, redirect: '/login' });

    bcrypt.compare(password, db[username].password, (err, result) => {
        if (err || !result) return res.json({ success: true, redirect: '/login' });

        const token = jwt.sign({ username }, process.env.sc_key);
        res.cookie('token', token);
        res.json({ success: true, redirect: '/' });
    });
});

module.exports = routes;