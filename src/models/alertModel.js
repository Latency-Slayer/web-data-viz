var database = require("../database/config")

function registerAlert(status, dateAlert, mensage, exceeded_limit,valor, fk_Metric, nivel) {
    var instrucaoSql = `
        INSERT INTO alert (status, dateAlert, mensage, exceeded_limit, valor, fk_Metric, nivel) 
        VALUES ('${status}', '${dateAlert}', '${mensage}', '${exceeded_limit}', '${valor}', '${fk_Metric}', '${nivel}');
    `;
    console.log(instrucaoSql);
    return database.executar(instrucaoSql);
}

function getAlerts(){
    var instrucaoSql = `SELECT COUNT(id_Alert) FROM alert;`;
    console.log(instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    registerAlert,
    getAlerts
}
