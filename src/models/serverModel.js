var database = require("../database/config")


async function registerServer(serverData) {
    const { motherboard_id, tag_name, type, instance_id, so, game, port, city, auth: { email, password }, country_code, components } = serverData;

    if (!motherboard_id || !tag_name || !type || !so || !game || !port || !city || !email || !password || !country_code) {
        throw new Error("Missing required fields: motherboard_id, tag_name, type, so, game, port city, auth, country_code");
    }

    if (typeof motherboard_id !== 'string' || typeof tag_name !== 'string' || typeof type !== 'string' || typeof so !== 'string' || typeof game !== "string" || typeof port !== "number"|| typeof city !== 'string' || typeof email !== 'string' || typeof password !== "string" || typeof country_code !== 'string') {
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

    const serverInsert = await database.executar("INSERT INTO server (motherboard_id, tag_name, type, instance_id, so, game, port,  city, fk_company, fk_country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [motherboard_id, tag_name, type, instance_id, so, game, port, city, userData.fk_company, country.id_country]
    );

    registerComponent(components, serverInsert.insertId);

    return serverInsert;
}


function registerComponent(componentData, serverId) {
    componentData.forEach(async (component) => {
        const { tag_name, type, metrics } = component;

        const componentInsert = await database.executar("INSERT INTO component (tag_name, type, fk_server) VALUE (?, ?, ?)", [tag_name, type, serverId]);

        for (const sentMetric of metrics) {
            const { metric, max_limit, min_limit, total } = sentMetric;

            database.executar("INSERT INTO metric (metric, max_limit, min_limit, total, fk_component) VALUE (?, ?, ?, ?, ?)",
                [metric, max_limit, min_limit, total, componentInsert.insertId]);
        }
    });
 }


async function getServerComponentsData(motherBoardId) {
        const [server] = await database.executar(
            `SELECT server.motherboard_id, tag_name, type 
                       FROM server WHERE motherboard_id = ?`, [motherBoardId]);

        const component = await database.executar(
            `SELECT c.id_component, c.tag_name, c.type, c.active, m.metric, m.max_limit, m.min_limit, m.total
                    FROM server AS s JOIN component c on s.id_server = c.fk_server
                    JOIN metric m on c.id_component = m.fk_component
                    WHERE s.motherboard_id = ?`,
            [motherBoardId]
        );

        if(!server) {
            throw new Error("No server found for motherboard");
        }

        if(component.length === 0) {
            throw new Error("Server Components not found");
        }

        return {
            server,
            components: component,
        };
}

module.exports = {
    registerServer,
    getServerComponentsData
};