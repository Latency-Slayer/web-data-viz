var database = require("../database/config")


async function registerServer(serverData) {
    const { motherboard_id, tag_name, type, instance_id, so, game, port, city, auth: { email, password }, country_code, components } = serverData;

    if (!motherboard_id || !tag_name || !type || !so || !game || !port || !city || !email || !password || !country_code) {
        throw new Error("Missing required fields: motherboard_id, tag_name, type, so, game, port city, auth, country_code");
    }

    if (typeof motherboard_id !== 'string' || typeof tag_name !== 'string' || typeof type !== 'string' || typeof so !== 'string' || typeof game !== "string" || typeof port !== "number" || typeof city !== 'string' || typeof email !== 'string' || typeof password !== "string" || typeof country_code !== 'string') {
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

function getServerBytagName(tagName) {
    var instrucaoSql = `SELECT * FROM server WHERE server.tag_name = ${tagName};`

    return database.executar(instrucaoSql);
}
function listarServer() {
    var instrucaoSql = `SELECT * FROM server;`

    return database.executar(instrucaoSql);
}

function getLimitComponent(motherboard) {
    var instrucaoSql = `
    SELECT s.motherboard_id as motherboardid,c.type, m.max_limit, m.min_limit FROM server AS s
    JOIN component AS c ON c.fk_server = s.id_server JOIN metric AS m ON m.fk_component = c.id_component
	WHERE s.motherboard_id = '${motherboard}' AND m.metric = '%';
    `
    return database.executar(instrucaoSql)
}

function getMetric(motherboard) {
    const instrucaoSql = `
        SELECT s.motherboard_id as motherboard, m.id_metric as fk_metric, m.max_limit, m.min_limit,c.tag_name as tag_name, c.type as type
        FROM server AS s
        JOIN component AS c ON c.fk_server = s.id_server
        JOIN metric AS m ON m.fk_component = c.id_component
        WHERE s.motherboard_id = '${motherboard}'
        AND m.metric = '%';
    `;
    return database.executar(instrucaoSql);
}

function getAlertsPerServer() {
    var instrucaoSql =
        `SELECT s.id_server as id,s.tag_name as tag_name,COUNT(a.id_alert) AS total_alertas,s.game as game FROM server s
    JOIN component c ON s.id_server = c.fk_server
    JOIN metric m ON c.id_component = m.fk_component
    JOIN alert a ON m.id_metric = a.fk_metric
    GROUP BY s.id_server, s.tag_name, s.game;`

    return database.executar(instrucaoSql)
}

function getTopTresServersComMaisOcorrencias() {
    var instrucaoSql =
    `
        SELECT COUNT(a.id_Alert) as qtd_alertas, s.tag_name as tag_name FROM alert a
        JOIN metric m on a.fk_Metric = m.id_metric
        JOIN component c on m.fk_component = c.id_component
        JOIN server s on c.fk_server = s.id_server
        GROUP BY s.tag_name ORDER BY COUNT(a.id_Alert) DESC LIMIT 3;
    `

    return database.executar(instrucaoSql);
}

function getRelatorioDeChamadosDoMesPassado() {
    var instrucaoSql =
    `
    WITH RECURSIVE dias AS (
    SELECT DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01') AS dia
    UNION ALL
    SELECT dia + INTERVAL 1 DAY
    FROM dias
    WHERE dia + INTERVAL 1 DAY <= LAST_DAY(CURDATE() - INTERVAL 1 MONTH)
)
    SELECT 
    DATE_FORMAT(dias.dia, '%d') AS dia,
    COUNT(alert.id_Alert) AS total_alertas
    FROM dias
    LEFT JOIN alert ON DATE(alert.dateAlert) = dias.dia
    GROUP BY dias.dia
    ORDER BY dias.dia;
    `
    return database.executar(instrucaoSql);
}

function getChamadosSemResponsavel() {
    var instrucaoSql =
        `
    SELECT 
    MIN(a.id_Alert) AS idJira,
    s.tag_name as tag_name,
    s.id_server as id,
    MIN(a.nivel) AS nivel
    FROM server s
    JOIN component c ON s.id_server = c.fk_server
    JOIN metric m ON c.id_component = m.fk_component
    JOIN alert a ON m.id_metric = a.fk_metric
    GROUP BY s.tag_name, s.id_server;
    `

    return database.executar(instrucaoSql)
}

async function getServerComponentsData(motherBoardId) {
    const [server] = await database.executar(
        `SELECT server.motherboard_id, tag_name, type, game, port, legal_name, registration_number
                       FROM server JOIN latency_slayer.company c on c.id_company = server.fk_company 
                       WHERE motherboard_id = ?`, [motherBoardId]);

    const component = await database.executar(
        `SELECT c.id_component, c.tag_name, c.type, c.active, m.metric, m.max_limit, m.min_limit, m.total
                    FROM server AS s JOIN component c on s.id_server = c.fk_server
                    JOIN metric m on c.id_component = m.fk_component
                    WHERE s.motherboard_id = ?`,
        [motherBoardId]
    );

    if (!server) {
        throw new Error("No server found for motherboard");
    }

    if (component.length === 0) {
        throw new Error("Server Components not found");
    }

    return {
        server,
        components: component,
    };
}

module.exports = {
    registerServer,
    getServerComponentsData,
    getServerBytagName,
    listarServer,
    getLimitComponent,
    getMetric,
    getAlertsPerServer,
    getChamadosSemResponsavel,
    getRelatorioDeChamadosDoMesPassado,
    getTopTresServersComMaisOcorrencias
};