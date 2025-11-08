const { saveapi, readapi } = require("../config/dbManager");

function trackApi(req, res, next) {
    const startTime = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const username = req.username
        const read = readapi()

        if (!read[username]) {
            read[username] = {
                totalRequest: 0,
                success: 0,
                fail: 0,
                activities: []
            };
        }

        const userData = read[username]
        userData.totalRequest++

        let stats
        if (res.statusCode >= 200 && res.statusCode < 300) {
            read[username].success++
            stats = 'Success'
        } else {
            read[username].fail++
            stats = "Fail"
        }

        read[username].activities.push({
            method: req.method,
            endpoint: req.originalUrl,
            responseStatus: stats,
            statuscode: res.statusCode,
            responseTimeMs: duration,
            timestamp: new Date().toISOString(),
            message: res.locals.responseData.message,
            ip: req.ip,
            request: {
                body: req.body,
                query: req.query
            }
        })

        saveapi(read)
    })
    next();
}

module.exports = { trackApi };