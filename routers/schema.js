const express = require('express');
const router = express.Router();
require('dotenv').config();
const { checkapi } = require("../middleware/checkapi");
const { getschema, list, createSchema, deleteSchema } = require("../controllers/schemaControl")


router.post('/create', checkapi, (req, res) => {
    const { name, ...bodyData } = req.body;
    const result = createSchema(req.username, name, bodyData)
    return res.status(result.status).json(result.data);
});

router.get('/list', checkapi, (req, res) => {

    const result = list(req.username);
    console.log(result);
    return res.status(result.status).json(result.data);
});

router.get('/getschema', checkapi, (req, res) => {

    const result = getschema(req.username, req.query.name);
    return res.status(result.status).json(result.data);
});

router.get('/delete', checkapi, (req, res) => {

    const result = deleteSchema(req.username, req.query.name);
    res.json({ result })
})

module.exports = router;