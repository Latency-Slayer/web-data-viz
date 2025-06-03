var database = require("../database/config")

function registerAlert(status, dateAlert, mensage, exceeded_limit, fk_Metric, nivel) {
    var instrucaoSql = `
        INSERT INTO alert (status, dateAlert, mensage, exceeded_limit, fk_Metric, nivel) 
        VALUES ('${status}', '${dateAlert}', '${mensage}', '${exceeded_limit}', '${fk_Metric}', '${nivel}');
    `;
    console.log(instrucaoSql);
    return database.executar(instrucaoSql);
}

function getAlerts(){
    var instrucaoSql = `SELECT COUNT(id_Alert) FROM alert;`;
    console.log(instrucaoSql);
    return database.executar(instrucaoSql);
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
    getQuantidadeDeChamadosDoMesPassado
}
