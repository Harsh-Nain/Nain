const express = require('express');
const router = express.Router();
require('dotenv').config();
const { checkapi } = require("../middleware/checkapi");
const { getschema, list, createSchema, deleteSchema, savedata, getdata, datadelete, updatedata } = require("../controllers/schemaControl")
const { trackApi } = require("../middleware/apiTracker")

router.use(trackApi)

router.post('/create', checkapi, (req, res) => {
    const { name, ...bodyData } = req.body;
    const result = createSchema(req.username, name, bodyData)
    res.locals.responseData = {
        sucess: result.data.success,
        message: result.data.message
    }
    return res.status(result.status).json(res.locals.responseData);
});

router.get('/list', checkapi, (req, res) => {

    const result = list(req.username);
    res.locals.responseData = {
        sucess: result.data.success,
        message: result.data.message
    }
    return res.status(result.status).json(res.locals.responseData);
});

router.get('/getschema', checkapi, (req, res) => {

    const result = getschema(req.username, req.query.name);
    res.locals.responseData = {
        sucess: result.data.success,
        message: result.data.message
    }
    return res.status(result.status).json(res.locals.responseData);
});

router.get('/delete', checkapi, (req, res) => {

    const result = deleteSchema(req.username, req.query.name);
    res.locals.responseData = {
        sucess: result.data.success,
        message: result.data.message
    }
    return res.json({ result })
})

router.get('/datadelete', checkapi, (req, res) => {

    const result = datadelete(req.username, req.query.name);
    res.locals.responseData = {
        sucess: result.data.success,
        message: result.data.message
    }
    return res.json(result)
})

router.post('/createdata', checkapi, (req, res) => {

    const result = savedata(req.username, req.body);
    res.locals.responseData = {
        sucess: result.data.success,
        message: result.data.message
    }
    return res.status(result.status).json(res.locals.responseData);
})

router.post('/updatedata', checkapi, (req, res) => {

    const result = updatedata(req.username, req.query.name, req.body);
    res.locals.responseData = {
        sucess: result.data.success,
        message: result.data.message
    }
    return res.status(result.status).json(res.locals.responseData);
})

router.get('/getdata', checkapi, (req, res) => {

    const result = getdata(req.username, req.query.name);
    res.locals.responseData = {
        sucess: result.data.success,
        message: result.data.message
    }
    return res.status(result.status).json(res.locals.responseData);
})

module.exports = router;