const fs = require('fs')
const path = require('path')
const utilsPath = path.resolve(__dirname, '..');

function maindb() {
    const db = JSON.parse(fs.readFileSync(path.join(utilsPath, process.env.Main_db, "db.json"), 'utf8'));
    return db
}

function readapi() {
    const db = JSON.parse(fs.readFileSync(path.join(utilsPath, process.env.Main_db, "apiData.json"), 'utf8'));
    return db
}

function readuser() {
    const db = JSON.parse(fs.readFileSync(path.join(utilsPath, process.env.Main_db, "saveuser.json"), 'utf8'));
    return db
}

function saveuser(user) {
    fs.writeFileSync(path.join(utilsPath, process.env.Main_db, "saveuser.json"), JSON.stringify(user))
    return true
}

function saveapi(api) {
    fs.writeFileSync(path.join(utilsPath, process.env.Main_db, "apiData.json"), JSON.stringify(api))
    return true
}

function saveDb(db) {
    fs.writeFileSync(path.join(utilsPath, process.env.Main_db, "db.json"), JSON.stringify(db))
    return true
}

module.exports = { saveDb, maindb, readapi, saveapi, readuser, saveuser }