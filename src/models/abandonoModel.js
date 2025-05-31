const database = require("../database/config")

function buscarKPI3() {
    const instrucaoSql = `select count(*) AS qtd_servidores_sobrecarregados from (select count(id_server), server.tag_name AS server from alert
join metric on fk_metric = id_metric
join component on fk_component = id_component
join server on fk_server = id_server
join company on fk_company = id_company
group by server.id_server) AS Qtd_Servidores_Sobrecarregados;`

    return database.executar(instrucaoSql)
}

module.exports = {
    buscarKPI3
}