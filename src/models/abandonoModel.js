const database = require("../database/config")

function buscarKPI3() {
    const instrucaoSql = `select count(id_alert) AS qtd, server.game from alert
join metric on fk_metric = id_metric
join component on fk_component = id_component
join server on fk_server = id_server
join company on fk_company = id_company
where alert.dateAlert between date_add(curdate(), interval - 30 day) and curdate()
group by server.game
order by qtd desc;`

    return database.executar(instrucaoSql)
}

function pesquisaJogo(nomeJogo) {
    const instrucaoSql = `select count(id_alert) AS qtd, server.game from alert
join metric on fk_metric = id_metric
join component on fk_component = id_component
join server on fk_server = id_server
join company on fk_company = id_company
where alert.dateAlert between date_add(curdate(), interval - 30 day) and curdate() 
and server.game like "${nomeJogo}"
group by server.game
order by qtd desc;`

    return database.executar(instrucaoSql)
}

function legendaIncidente(nomeJogo) {
    const instrucaoSql = `select count(id_alert) AS qtd, server.game from alert
join metric on fk_metric = id_metric
join component on fk_component = id_component
join server on fk_server = id_server
join company on fk_company = id_company
where alert.dateAlert between date_add(curdate(), interval - 60 day) 
and date_add(curdate(), interval - 30 day) and server.game like "${nomeJogo}"
group by server.game
order by qtd desc;`

    return database.executar(instrucaoSql)
}

function listaJogos(id_company) {
    const instrucaoSql = `select server.game from server
join company on fk_company = id_company
where company.id_company = ${id_company}
group by game
order by game;`

    return database.executar(instrucaoSql)
}

module.exports = {
    buscarKPI3, 
    pesquisaJogo,
    legendaIncidente,
    listaJogos
}