const fs = require('fs')
const path = require('path')
require('dotenv').config();
const baseDir = path.resolve(__dirname, "..")
const userDB = path.join(baseDir, process.env.User_db)
const { v4: uuidv4 } = require('uuid')
const { checkstore } = require("../middleware/checkstoredatavalid.js");
const { json } = require('stream/consumers');

function createSchema(username, name, bodyData) {
    try {
        if (!name || Object.keys(bodyData).length === 0) {
            return { status: 400, data: { message: "Invalid or empty request data" } }
        }

        const safeName = name.trim().toLowerCase().replace(/[^a-z0-9_\-]/g, "");
        if (!safeName) {
            return { status: 400, data: { message: "Invalid schema name" } }
        }

        const userFolder = path.join(userDB, username);
        const schemaFolder = path.join(userFolder, "Schema");
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
                message: "Schema saved successfully",
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

        if (!fs.existsSync(filePath)) {
            return { status: 404, data: { message: "Schema File not found" } };
        }

        fs.unlinkSync(filePath)
        return { status: 204, message: "Schema was deleted" };

    } catch (error) {
        console.error(error);
        return { status: 500, data: { message: "Internal server error" } };
    }
}

function savedata(username, bodyData) {
    try {
        let data = {}
        const name = bodyData.name;
        const info = bodyData.info;

        if (!name || !info || Object.keys(info).length === 0) return { status: 400, data: { message: "Invalid or empty request data" } };

        const safeName = name.trim().toLowerCase().replace(/[^a-z0-9_\-]/g, "");
        if (!safeName) return { status: 400, data: { message: "Invalid schema name" } };

        const userFolder = path.join(userDB, username);
        const maindatabase = path.join(userFolder, "MainDataBase");
        const schema = path.join(userFolder, "Schema");
        const mainfile = path.join(maindatabase, `${safeName}.json`);
        const schemafile = path.join(schema, `${safeName}.json`);

        if (!fs.existsSync(schemafile)) return { status: 400, data: { message: "Invalid schema name" } };

        if (!fs.existsSync(maindatabase)) {
            fs.mkdirSync(maindatabase, { recursive: true });
        }

        if (!fs.existsSync(mainfile)) {
            fs.writeFileSync(mainfile, JSON.stringify({}));
        }

        const newfile = JSON.parse(fs.readFileSync(mainfile, "utf-8"));
        if (newfile != {}) {
            data = newfile
        }

        data.name = safeName
        if (!data.data) {
            data.data = []
        }

        const schemadata = JSON.parse(fs.readFileSync(schemafile, "utf-8"))
        const result = checkstore(schemadata, info)
        if (!result.info) return result

        if (Array.isArray(result.info)) {
            result.info.forEach(d => {
                d['id'] = uuidv4()
                data.data.push(d)
            });
        }
        else {
            result.info['id'] = uuidv4()
            data.data.push(result.info)
        }

        fs.writeFileSync(mainfile, JSON.stringify(data, null, 2), "utf-8");

        return {
            status: 201,
            data: {
                success: true,
                message: "Data added successfully",
                added: result,
            },
        };
    }
    catch (err) {
        return {
            status: 500,
            data: {
                success: false,
                message: "Internal server error",
                error: err.message,
            },
        };
    }
}

function getdata(username, name) {
    try {

        if (name == undefined || '') return { status: 404, data: { message: "Query Name Could not found" } };

        const id = name.split(',')[0]
        const maindatabase = path.join(userDB, username, 'MainDataBase');

        if (!fs.existsSync(maindatabase)) return { status: 404, data: { message: "maindatabase directory not found" } };

        const filePath = path.join(maindatabase, `${name.split(',')[1]}.json`);

        if (!fs.existsSync(filePath)) return { status: 404, data: { message: "Datafile directory not found" } };

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        for (let i = 0; i < data.data.length; i++) {
            if (data.data[i].id === id) return { status: 200, data: data.data[i] };
        }
        return { status: 400, data: { message: "Data not Found please check id or file name" } };
    }
    catch (error) {
        return { status: 500, data: { message: "Internal server error", err: error } };
    }
}

function datadelete(username, name) {
    try {
        if (name == undefined || '') return { status: 404, data: { message: "Query Name Could not found" } };

        const id = name.split(',')[0]
        const MainDataBase = path.join(userDB, username, 'MainDataBase');

        if (!fs.existsSync(MainDataBase)) return { status: 404, data: { message: "Schema directory not found" } };

        const filePath = path.join(MainDataBase, `${name.split(',')[1]}.json`);

        if (!fs.existsSync(filePath)) return { status: 404, data: { message: "Datafile directory not found" } };

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        data.data = data.data.filter(item => item.id !== id);

        fs.writeFileSync(filePath, JSON.stringify(data));
        return { status: 204, message: "Schema was deleted" };

    } catch (error) {
        console.error(error);
        return { status: 500, data: { message: "Internal server error" } };
    }
}

function updatedata(username, id, bodyData) {
    try {
        const maindatabase = path.join(userDB, username, 'MainDataBase');

        if (id == undefined || '') return { status: 404, data: { message: "Query Data-Id Could not found" } };
        if (!fs.existsSync(maindatabase)) return { status: 404, data: { message: "maindatabase directory not found" } };

        const filePath = path.join(maindatabase, `${bodyData.name}.json`);
        if (!fs.existsSync(filePath)) return { status: 404, data: { message: "Datafile directory not found" } };
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        for (let i = 0; i < data.data.length; i++) {
            if (data.data[i].id === id) {

                data.data[i] = bodyData.info
                data.data[i]['id'] = id
                fs.writeFileSync(filePath, JSON.stringify(data), "utf-8")

                return {
                    status: 201,
                    data: {
                        success: true,
                        message: "Data Updated successfully",
                        Updated: data.data[i],
                    },
                }
            };
        }

    }
    catch (error) {
        return { status: 500, data: { message: "Internal server error", err: error } };
    }
}

module.exports = { getschema, list, createSchema, deleteSchema, savedata, getdata, datadelete, updatedata }