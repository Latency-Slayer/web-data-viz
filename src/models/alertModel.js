var database = require("../database/config")

function registerAlert(status, dateAlert, mensage, exceeded_limit, valor, fk_Metric, nivel, idJira) {
    var instrucaoSql = `
    INSERT INTO alert (status, dateAlert, mensage, exceeded_limit, valor, fk_Metric, nivel, idJira)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
`;

    return database.executar(instrucaoSql, [status, dateAlert, mensage, exceeded_limit, valor, fk_Metric, nivel, idJira]);
}


function getAlerts(motherboard) {
    var instrucaoSql = `
    SELECT s.motherboard_id as motherboard, COUNT(alert.id_Alert) AS total_criados FROM server AS s
    JOIN component AS c ON c.fk_server = s.id_server 
    JOIN metric AS m ON m.fk_component = c.id_component
    JOIN alert AS alert ON alert.fk_Metric = m.id_metric 
    WHERE s.motherboard_id = ?
    GROUP BY s.motherboard_id 
    ORDER BY COUNT(alert.dateAlert) DESC;
`;

    return database.executar(instrucaoSql, [motherboard]);

}

function getAlertsPorDia(motherboard) {
    var instrucaoSql = `
    SELECT s.motherboard_id as motherboard, DATE(alert.dateAlert) AS data_criacao, COUNT(alert.id_Alert) AS total_criados
    FROM server AS s 
    JOIN component AS c ON c.fk_server = s.id_server 
    JOIN metric AS m ON m.fk_component = c.id_component
    JOIN alert AS alert ON alert.fk_Metric = m.id_metric 
    WHERE s.motherboard_id = ?
    GROUP BY s.motherboard_id, DATE(alert.dateAlert)
    ORDER BY DATE(alert.dateAlert) DESC;
`;

    return database.executar(instrucaoSql, [motherboard]);
}

function getQuantidadeDeChamadosDoMesPassado() {
    var instrucaoSql =
    `
    SELECT COUNT(*) AS total_alertas_mes_passado
    FROM alert
    WHERE dateAlert >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
    AND dateAlert < DATE_FORMAT(CURDATE(), '%Y-%m-01');
    `

    return database.executar(instrucaoSql);
}

module.exports = {
    registerAlert,
    getAlerts,
    getQuantidadeDeChamadosDoMesPassado,
    getAlertsPorDia
}
