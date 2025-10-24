const fs = require('fs')
const path = require('path')
require('dotenv').config();
const baseDir = path.resolve(__dirname, "..")
const userDB = path.join(baseDir, process.env.User_db)


function createSchema(username, name, bodyData) {
    try {
        if (!name || Object.keys(bodyData).length === 0) {
            return { status: 400, data: { message: "Invalid or empty request data" } }
        }

        const safeName = name.trim().toLowerCase().replace(/[^a-z0-9_\-]/g, "");
        if (!safeName) {
            return { status: 400, data: { error: "Invalid schema name" } }
        }

        const userFolder = path.join(userDB, username);
        const schemaFolder = path.join(userFolder, "schema");
        const schemaFile = path.join(schemaFolder, `${safeName}.json`);

        if (!fs.existsSync(schemaFolder)) {
            fs.mkdirSync(schemaFolder, { recursive: true });
        }

        if (fs.readdirSync(schemaFolder).includes(`${safeName}.json`)) {
            return {
                status: 409, data: {
                    sucess: false,
                    message: `${safeName}.json file already exist!`
                }
            }
        }

        const jsonData = JSON.stringify({ name: safeName, ...bodyData }, null, 2);
        fs.writeFileSync(schemaFile, jsonData, "utf-8");

        return {
            status: 201, data: {
                success: true,
                message: "Data saved successfully",
            }
        };
    }
    catch (err) {
        return {
            status: 500, data: {
                sucess: false,
                message: "Internal server error", err
            }
        };
    }
}
    
function list(username) {
    try {
        const schemaDir = path.join(userDB, username, 'schema');

        if (!fs.existsSync(schemaDir)) {
            return {
                status: 404,
                data: { message: "Schema directory not found" }
            };
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
                console.error(`Error parsing file: ${filePath}`, parseErr);
            }
        }

        return {
            status: 200,
            data: {
                success: true,
                message: "Data accessed successfully",
                collection
            }
        };

    } catch (err) {
        console.error('Unexpected error:', err);
        return {
            status: 500,
            data: {
                success: false,
                message: "Internal server error"
            }
        };
    }
}

function getschema(username, name) {
    try {
        const schemaDir = path.join(userDB, username, 'schema');

        if (!fs.existsSync(schemaDir)) {
            return { status: 404, data: { message: "Schema directory not found" } };
        }

        const filePath = path.join(schemaDir, `${name}.json`);

        if (!fs.existsSync(schemaDir)) {
            return { status: 404, data: { message: "Schema directory not found" } };
        }

        const schemaData = fs.readFileSync(filePath, 'utf8');
        return { status: 200, data: JSON.parse(schemaData) };


    } catch (error) {
        console.error(error);
        return { status: 500, data: { message: "Internal server error" } };
    }
}

function deleteSchema(username, name) {
    try {
        const schemaDir = path.join(userDB, username, 'schema');

        if (!fs.existsSync(schemaDir)) {
            return { status: 404, data: { message: "Schema directory not found" } };
        }

        const filePath = path.join(schemaDir, `${name}.json`);

        if (!fs.existsSync(schemaDir)) {
            return { status: 404, data: { message: "Schema directory not found" } };
        }

        const schemaData = fs.readFileSync(filePath, 'utf8');

        return { status: 200, data: JSON.parse(schemaData) };


    } catch (error) {
        console.error(error);
        return { status: 500, data: { message: "Internal server error" } };
    }
}

module.exports = { getschema, list, createSchema, deleteSchema }