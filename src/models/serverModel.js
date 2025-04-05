var database = require("../database/config")


async function registerServer(serverData) {
    const { motherboard_id, tag_name, type, instance_id, so, city, auth: { email, password }, country_code } = serverData;

    // console.log(motherboard_id, tag_name, type, instance_id, so, city, email, password, country_code)

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

    const country = await database.executar("SELECT * FROM country WHERE country_code = ?", [country_code]);

    if (!country.length) {
        throw new Error("The system does not cover this country.");
    }

    database.executar("INSERT INTO server (motherboard_id, tag_name, type, instance_id, so, city, fk_company, country_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    [motherboard_id, tag_name, type, instance_id, so, city, fk_company, country_code]
    )


}


function registerComponent(componentData, serverId) {

}

module.exports = {
    registerServer
};