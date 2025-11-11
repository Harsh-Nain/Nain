const express = require("express");
const app = express();
const path = require("path");

const cookieParser = require('cookie-parser')
const mainRouter = require('./routers/main.js');
const authRouter = require('./routers/auth.js');
const schemRouter = require('./routers/schema.js');

require("dotenv").config();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set("view engine", "ejs");

app.use('/', mainRouter);
app.use('/Auth', authRouter);
app.use('/api/schema', schemRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started at 0.0.0.0:${PORT}`);
});