var database = require("../database/config")


async function registerServer(serverData) {
    const { motherboard_id, tag_name, type, instance_id, so, city, auth: { email, password }, country_code, components } = serverData;

    if (!motherboard_id || !tag_name || !type || !so || !city || !email || !password || !country_code) {
        throw new Error("Missing required fields: motherboard_id, tag_name, type, so, city, auth, country_code");
    }

    if (typeof motherboard_id !== 'string' || typeof tag_name !== 'string' || typeof type !== 'string' || typeof so !== 'string' || typeof city !== 'string' || typeof email !== 'string' || typeof password !== "string" || typeof country_code !== 'string') {
        throw new Error("Invalid data types: motherboard_id, tag_name, type, so, city, country_code must be strings; fk_company must be a number");
    }

    if (motherboard_id.length > 150 || tag_name.length > 45 || city.length > 60 || country_code.length > 2) {
        throw new Error("Field length exceeded: motherboard_id, tag_name, city, country_code must be within specified limits");
    }

    if (so !== "macos" && so !== "windows" && so !== "linux") {
        throw new Error("so not valid, so must be: 'macos', 'windows', 'linux'");
    }

    if (type !== "cloud" && type !== "on-premise") {
        throw new Error("Type not valid, type must be: 'on-premise or 'cloud'");
    }

    const [country] = await database.executar("SELECT * FROM country WHERE country_code = ?", [country_code]);

    if (!country) {
        throw new Error("The system does not cover this country.");
    }


    const [userData] = await database.executar("SELECT c.email, e.password, e.fk_company FROM contact AS c JOIN employee as e ON e.fk_contact = c.id_contact WHERE c.email = ?",
        [email]
    );

    if (!userData) {
        throw new Error("Incorrect email or password");
    }

    if (userData.password !== password) {
        throw new Error("Incorrect email or password");
    }

    const [serverSelect] = await database.executar("SELECT * FROM server WHERE motherboard_id = ?", [motherboard_id]);

    if (serverSelect) {
        throw new Error("Duplicate entry. This server already exists")
    }

    const serverInsert = await database.executar("INSERT INTO server (motherboard_id, tag_name, type, instance_id, so, city, fk_company, fk_country) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
        [motherboard_id, tag_name, type, instance_id, so, city, userData.fk_company, country.id_country]
    );

    registerComponent(components, serverInsert.insertId);

    return serverInsert;
}


function registerComponent(componentData, serverId) {
    componentData.forEach(async (component) => {
        const { tag_name, type, metrics } = component;

        const componentInsert = await database.executar("INSERT INTO component (tag_name, type, fk_server) VALUE (?, ?, ?)", [tag_name, type, serverId]);

        metrics.forEach(async (sentMetric) => {
            const { metric, max_limit, min_limit, total } = sentMetric;

            database.executar("INSERT INTO metric (metric, max_limit, min_limit, total, fk_component) VALUE (?, ?, ?, ?, ?)",
                [metric, max_limit, min_limit, total, componentInsert.insertId]);
        });
    });
}

module.exports = {
    registerServer
};