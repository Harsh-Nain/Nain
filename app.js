const express = require("express");
const app = express();
const path = require("path");

const cookieParser = require('cookie-parser')
const mainRouter = require('./routers/main.js');
const authRouter = require('./routers/auth.js');
const schemRouter = require('./routers/schema.js');

const PORT = process.env.PORT || 7000;
require("dotenv").config();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set("view engine", "ejs");

app.use('/', mainRouter);
app.use('/', authRouter);
app.use('/api/schema', schemRouter);

app.listen(PORT);