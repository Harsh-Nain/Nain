const express = require('express');
const router = express.Router();
require('dotenv').config();
// const { checkapi } = require("../middleware/checkValidApi");
const { getschema, list, createSchema, deleteSchema } = require("../controllers/schemaControl")


router.post('/create', checkapi, (req, res) => {
    const { name, ...bodyData } = req.body;
    const result = createSchema(req.username, name, bodyData)
    return res.status(result.status).json(result.data);
});

function checkapi(req, res, next) {
    console.log(req);
}

router.get('/list', checkapi, (req, res) => {

    const result = list(req.username);
    return res.status(result.status).json(result.data);
});

router.get('/getschema', checkapi, (req, res) => {

    const result = getschema(req.username, req.query.name);
    return res.status(result.status).json(result.data);
});


router.get('/delete', checkapi, (req, res) => {
    const result = deleteSchema(req.username, req.query.name);
    console.log(result);
    res.json({ data: 'deleted' })
})

module.exports = router;