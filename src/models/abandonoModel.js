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
    const instrucaoSql = `select server.game, count(id_alert) AS qtd from alert
join metric on fk_metric = id_metric
join component on fk_component = id_component
join server on fk_server = id_server
join company on fk_company = id_company
where company.id_company like ${id_company}
group by game
order by qtd desc;`

    return database.executar(instrucaoSql)
}

function buscarKPI2() {
    const instrucaoSql = ``

    return database.executar(instrucaoSql)
}

function buscarKPI1() {
    const instrucaoSql = ``

    return database.executar(instrucaoSql)
}

async function grafico1(nomeJogo) {
    const instrucaoSql = `SELECT dados_diarios.continent_code as continente,
ROUND(AVG(total_jogadores), 0) as media_jogadores_sem_alerta
FROM (SELECT cc.fk_server, cc.continent_code, DATE(cc.date_time) as dia,
COUNT(*) as total_jogadores FROM connection_capturing cc
WHERE DAYOFWEEK(cc.date_time) IN (1, 6, 7)
AND DATE(cc.date_time) IN (SELECT DISTINCT DATE(dateAlert) 
FROM alert) GROUP BY cc.fk_server, cc.continent_code, DATE(cc.date_time)) as dados_diarios
INNER JOIN server s ON dados_diarios.fk_server = s.id_server
where game like '${nomeJogo}'
GROUP BY dados_diarios.continent_code
ORDER BY dados_diarios.continent_code;`

    const instrucaoSql2 = `SELECT dados_diarios.continent_code as continente,
ROUND(AVG(total_jogadores), 0) as media_jogadores_com_alerta
FROM (SELECT cc.fk_server, cc.continent_code, DATE(cc.date_time) as dia,
COUNT(*) as total_jogadores FROM connection_capturing cc
WHERE DAYOFWEEK(cc.date_time) IN (1, 6, 7) 
AND DATE(cc.date_time) NOT IN (SELECT DISTINCT DATE(dateAlert) 
FROM alert) GROUP BY cc.fk_server, cc.continent_code, DATE(cc.date_time)) as dados_diarios
INNER JOIN server s ON dados_diarios.fk_server = s.id_server
where game like '${nomeJogo}'
GROUP BY dados_diarios.continent_code
ORDER BY dados_diarios.continent_code;`

    const result1 = await database.executar(instrucaoSql)
    const result2 = await database.executar(instrucaoSql2)

    return {result1, result2}
}

function grafico2() {
    const instrucaoSql = ``

    return database.executar(instrucaoSql)
}

module.exports = {
    buscarKPI3, 
    pesquisaJogo,
    legendaIncidente,
    listaJogos,
    buscarKPI2,
    buscarKPI1,
    grafico1,
    grafico2
}