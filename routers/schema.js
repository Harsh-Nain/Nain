const express = require('express');
const fs = require('fs')
const path = require('path')
const router = express.Router();
require('dotenv').config();
const baseDir = path.resolve(__dirname, "..")
const userDB = path.join(baseDir, process.env.User_db)
const { checkapi } = require("../middleware/authmid");


router.post('/create', checkapi, (req, res) => {
    try {
        const username = req.username;
        const { name, ...bodyData } = req.body;

        if (!name || Object.keys(bodyData).length === 0) {
            return res.status(400).json({ message: "Invalid or empty request data" });
        }

        const safeName = name.trim().toLowerCase().replace(/[^a-z0-9_\-]/g, "");
        if (!safeName) {
            return res.status(400).json({ error: "Invalid schema name" });
        }

        const userFolder = path.join(userDB, username);
        const schemaFolder = path.join(userFolder, "schema");
        const schemaFile = path.join(schemaFolder, `${safeName}.json`);

        if (!fs.existsSync(schemaFolder)) {
            fs.mkdirSync(schemaFolder, { recursive: true });
        }

        if (fs.readdirSync(schemaFolder).includes(`${safeName}.json`)) {
            res.status(409).json({
                sucess: false,
                message: `${safeName}.json file already exist!`
            })
        }

        const jsonData = JSON.stringify({ name: safeName, ...bodyData }, null, 2);
        fs.writeFileSync(schemaFile, jsonData, "utf-8");

        return res.status(201).json({
            success: true,
            message: "Data saved successfully",
        });
    }
    catch (err) {
        return res.status(500).json({
            sucess: false,
            message: "Internal server error", err
        });
    }
});

router.get('/list', checkapi, (req, res) => {
    try {
        const username = req.username;

        const schemaDir = path.join(userDB, username, 'schema');

        if (!fs.existsSync(schemaDir)) {
            return res.status(404).json({ message: "Schema directory not found" });
        }

        const files = fs.readdirSync(schemaDir);
        const collection = [];

        for (const fileName of files) {
            const filePath = path.join(schemaDir, fileName);

            if (!fs.statSync(filePath).isFile() || !fileName.endsWith('.json')) continue;

            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const jsonData = JSON.parse(content);
                collection.push(jsonData);

            } catch (parseErr) {
                console.error(`Error reading/parsing file: ${filePath}`, parseErr);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Data accessed successfully",
            collection
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

})

module.exports = router;