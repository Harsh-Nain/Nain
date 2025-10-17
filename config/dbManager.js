const fs = require('fs')
const path = require('path')
const utilsPath = path.resolve(__dirname, '..');

const read = 'uploads'
function uplodes() {
    const fil = fs.readdirSync(read)
    return fil
}

function maindb() {
    const db = JSON.parse(fs.readFileSync(path.join(utilsPath, process.env.Main_db, "db.json"), 'utf8'));
    return db
}

function saveDb(db) {
    try {
        fs.writeFileSync(path.join(utilsPath, process.env.Main_db, "db.json"), JSON.stringify(db))
        return true
    } catch (err) {
        return err
    }
}

module.exports = { saveDb, maindb, uplodes }