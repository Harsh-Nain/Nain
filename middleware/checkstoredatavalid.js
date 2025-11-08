function checkstore(schemaData, info) {
    const { fields } = schemaData;

    for (const field of fields) {
        const name = field.name;
        const value = info[name]

        if (value == undefined) {

            for (let i = 0; i < info.length; i++) {
                const value = info[i][name]

                if (field.required) {

                    if (value === '' || value === undefined || value === null) {
                        return {
                            status: 400,
                            data: {
                                success: false,
                                message: `${name} as Key is required `
                            }
                        };
                    }
                }

                if (field.default !== undefined && (value === '' || value === undefined || value === null)) {
                    info[i][name] = field.default;
                }

                if (field.type) {

                    if (typeof info[i][name] !== field.type) {

                        if ((typeof info[i][name] == ("string" || "number")) && field.type === "boolean") {
                            info[i][name] = Boolean(info[i][name])
                        }
                        else if ((typeof info[i][name] == ("string" || "boolean")) && field.type == "number") {

                            info[i][name] = Number(info[i][name])
                            if (Number.isNaN(info[i][name])) {
                                return {
                                    status: 400,
                                    data: {
                                        success: false,
                                        message: `Type of "${name}" should be "${field.type}" but you give "string"`
                                    }
                                };
                            }
                        }
                        else if ((typeof info[i][name] == ("number" || "boolean")) && field.type === "string") {
                            info[i][name] = info[i][name].toString()
                        }
                        else {
                            return {
                                status: 400,
                                data: {
                                    success: false,
                                    message: `Type of "${name}" should be "${field.type}" but you give "${typeof info[i][name]}"`
                                }
                            };
                        }
                    }
                }

            }
        }
        else {

            if (field.required) {

                if (value === '' || value === undefined || value === null) {
                    return {
                        status: 400,
                        data: {
                            success: false,
                            message: `${name} as Key is required `
                        }
                    };
                }
            }

            if (field.default !== undefined && (value === '' || value === undefined || value === null)) {
                info[name] = field.default;
            }

            if (field.type) {

                if (typeof info[name] !== field.type) {

                    if ((typeof info[name] == "string" || "number") && field.type === "boolean") {
                        info[name] = Boolean(info[name])
                    }
                    else if ((typeof info[name] == "string" || "boolean") && field.type == "number") {

                        info[name] = Number(info[name])
                        if (Number.isNaN(info[name])) {
                            return {
                                status: 400,
                                data: {
                                    success: false,
                                    message: `Type of "${name}" should be "${field.type}" but you give "string"`
                                }
                            };
                        }
                    }
                    else if ((typeof info[name] == "number" || "boolean") && field.type === "string") {
                        info[name] = info[name].toString()
                    }
                    else {
                        return {
                            status: 400,
                            data: {
                                success: false,
                                message: `Type of "${name}" should be "${field.type}" but you give "${typeof info[name]}"`
                            }
                        };
                    }
                }
            }
        }
    }

    return { info }

}

module.exports = { checkstore }