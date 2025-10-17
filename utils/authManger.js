const { maindb } = require("../config/dbManager")
const path = require("path");
const fs = require("fs");

const dataBasePath = path.resolve(__dirname, "..");

function createusername(fullname) {
    const username = fullname.split(' ')[0] + Math.floor(Math.random() * 9999 + 100);
    let db = maindb()
    if (Object.keys(db).includes(username)) return createusername(fullname)
    return username
}

function createDir(username) {
    const userDbFolder = process.env.User_db
    const userDir = path.join(dataBasePath, userDbFolder, username);
    const userSchema = path.join(userDir, "Schema");
    const userMainDataBase = path.join(userDir, "MainDataBase");
    const userAuthDataBase = path.join(userDir, "AuthDataBase");

    fs.mkdirSync(userSchema, { recursive: true });
    fs.mkdirSync(userMainDataBase, { recursive: true });
    fs.mkdirSync(userAuthDataBase, { recursive: true });
    return true;
}

module.exports = { createusername, createDir };