var database = require("../database/config")

function registerAlert(status, dateAlert, mensage, exceeded_limit, valor, fk_Metric, nivel) {
    var instrucaoSql = `
    INSERT INTO alert (status, dateAlert, mensage, exceeded_limit, valor, fk_Metric, nivel)
    VALUES (?, ?, ?, ?, ?, ?, ?);
`;

    return database.executar(instrucaoSql, [status, dateAlert, mensage, exceeded_limit, valor, fk_Metric, nivel]);
}


function getAlerts() {
    var instrucaoSql = `SELECT COUNT(id_Alert) FROM alert;`;
    console.log(instrucaoSql);
    return database.executar(instrucaoSql);
}

function getAlertsPorDia() {
    var instrucaoSql = `
    SELECT
  DATE(dateAlert) AS data_criacao,
  COUNT(id_Alert) AS total_criados
FROM alert
GROUP BY DATE(dateAlert)
ORDER BY DATE(dateAlert) DESC;
`;
    console.log(instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    registerAlert,
    getAlerts,
    getAlertsPorDia
}
