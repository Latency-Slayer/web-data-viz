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
and server.game like ?
group by server.game
order by qtd desc;`

    return database.executar(instrucaoSql, [nomeJogo])
}

function legendaIncidente(nomeJogo) {
    const instrucaoSql = `select count(id_alert) AS qtd, server.game from alert
join metric on fk_metric = id_metric
join component on fk_component = id_component
join server on fk_server = id_server
join company on fk_company = id_company
where alert.dateAlert between date_add(curdate(), interval - 60 day) 
and date_add(curdate(), interval - 30 day) and server.game like ?
group by server.game
order by qtd desc;`

    return database.executar(instrucaoSql, [nomeJogo])
}

async function legendaAbandono(nomeJogo) {
    const instrucaoSql = `SELECT dados_diarios.continent_code as continente,
ROUND(AVG(total_jogadores), 0) as media_jogadores_sem_alerta
FROM (SELECT cc.fk_server, cc.continent_code, DATE(cc.date_time) as dia,
COUNT(*) as total_jogadores FROM connection_capturing cc
WHERE DAYOFWEEK(cc.date_time) IN (1, 6, 7)
AND DATE(cc.date_time) IN (SELECT DISTINCT DATE(dateAlert) 
FROM alert) GROUP BY cc.fk_server, cc.continent_code, DATE(cc.date_time)) as dados_diarios
INNER JOIN server s ON dados_diarios.fk_server = s.id_server
where game like ? AND DATE(dia) >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) AND DATE(dia) <= DATE_SUB(CURDATE(), INTERVAL 30 DAY) 
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
where game like ? AND DATE(dia) >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) AND DATE(dia) <= DATE_SUB(CURDATE(), INTERVAL 30 DAY) 
GROUP BY dados_diarios.continent_code
ORDER BY dados_diarios.continent_code;`

    const result1 = await database.executar(instrucaoSql, [nomeJogo])
    const result2 = await database.executar(instrucaoSql2, [nomeJogo])

    return {result1, result2}
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

async function dados_abandono(nomeJogo) {
    const instrucaoSql = `SELECT dados_diarios.continent_code as continente,
ROUND(AVG(total_jogadores), 0) as media_jogadores_sem_alerta
FROM (SELECT cc.fk_server, cc.continent_code, DATE(cc.date_time) as dia,
COUNT(*) as total_jogadores FROM connection_capturing cc
WHERE DAYOFWEEK(cc.date_time) IN (1, 6, 7)
AND DATE(cc.date_time) IN (SELECT DISTINCT DATE(dateAlert) 
FROM alert) GROUP BY cc.fk_server, cc.continent_code, DATE(cc.date_time)) as dados_diarios
INNER JOIN server s ON dados_diarios.fk_server = s.id_server
where game like ? AND DATE(dia) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
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
where game like ? AND DATE(dia) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY dados_diarios.continent_code
ORDER BY dados_diarios.continent_code;`

    const result1 = await database.executar(instrucaoSql, [nomeJogo])
    const result2 = await database.executar(instrucaoSql2, [nomeJogo])

    return {result1, result2}
}

async function grafico2(nomeJogo) {
    const instrucaoSql = `SELECT ROUND(AVG(total_jogadores), 0) as media_jogadores_sem_alerta, MONTH(dia) as mes
FROM (SELECT cc.fk_server, DATE(cc.date_time) as dia,
COUNT(*) as total_jogadores FROM connection_capturing cc
WHERE DAYOFWEEK(cc.date_time) IN (1, 6, 7)
AND DATE(cc.date_time) IN (SELECT DISTINCT DATE(dateAlert) 
FROM alert) GROUP BY cc.fk_server, DATE(cc.date_time)) as dados_diarios
INNER JOIN server s ON dados_diarios.fk_server = s.id_server
where game like ? AND DATE(dia) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) 
GROUP BY mes;`

    const instrucaoSql2 = `SELECT ROUND(AVG(total_jogadores), 0) as media_jogadores_com_alerta, MONTH(dia) as mes
FROM (SELECT cc.fk_server, DATE(cc.date_time) as dia,
COUNT(*) as total_jogadores FROM connection_capturing cc
WHERE DAYOFWEEK(cc.date_time) IN (1, 6, 7) 
AND DATE(cc.date_time) NOT IN (SELECT DISTINCT DATE(dateAlert) 
FROM alert) GROUP BY cc.fk_server, DATE(cc.date_time)) as dados_diarios
INNER JOIN server s ON dados_diarios.fk_server = s.id_server
where game like ? AND DATE(dia) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) 
GROUP BY mes;`

    const instrucaoSql3 = `SELECT ROUND(AVG(total_jogadores), 0) as media_jogadores_sem_alerta, MONTH(dia) as mes
FROM (SELECT cc.fk_server, DATE(cc.date_time) as dia,
COUNT(*) as total_jogadores FROM connection_capturing cc
WHERE DAYOFWEEK(cc.date_time) IN (1, 6, 7)
AND DATE(cc.date_time) IN (SELECT DISTINCT DATE(dateAlert) 
FROM alert) GROUP BY cc.fk_server, DATE(cc.date_time)) as dados_diarios
INNER JOIN server s ON dados_diarios.fk_server = s.id_server
where game like ? AND DATE(dia) >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) AND DATE(dia) <= DATE_SUB(CURDATE(), INTERVAL 30 DAY) 
GROUP BY mes;`

    const instrucaoSql4 = `SELECT ROUND(AVG(total_jogadores), 0) as media_jogadores_com_alerta, MONTH(dia) as mes
FROM (SELECT cc.fk_server, DATE(cc.date_time) as dia,
COUNT(*) as total_jogadores FROM connection_capturing cc
WHERE DAYOFWEEK(cc.date_time) IN (1, 6, 7) 
AND DATE(cc.date_time) NOT IN (SELECT DISTINCT DATE(dateAlert) 
FROM alert) GROUP BY cc.fk_server, DATE(cc.date_time)) as dados_diarios
INNER JOIN server s ON dados_diarios.fk_server = s.id_server
where game like ? AND DATE(dia) >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) AND DATE(dia) <= DATE_SUB(CURDATE(), INTERVAL 30 DAY) 
GROUP BY mes;`

    const instrucaoSql5 = `SELECT ROUND(AVG(total_jogadores), 0) as media_jogadores_sem_alerta, MONTH(dia) as mes
FROM (SELECT cc.fk_server, DATE(cc.date_time) as dia,
COUNT(*) as total_jogadores FROM connection_capturing cc
WHERE DAYOFWEEK(cc.date_time) IN (1, 6, 7)
AND DATE(cc.date_time) IN (SELECT DISTINCT DATE(dateAlert) 
FROM alert) GROUP BY cc.fk_server, DATE(cc.date_time)) as dados_diarios
INNER JOIN server s ON dados_diarios.fk_server = s.id_server
where game like ? AND DATE(dia) >= DATE_SUB(CURDATE(), INTERVAL 90 DAY) AND DATE(dia) <= DATE_SUB(CURDATE(), INTERVAL 60 DAY) 
GROUP BY mes;`

    const instrucaoSql6 = `SELECT ROUND(AVG(total_jogadores), 0) as media_jogadores_com_alerta, MONTH(dia) as mes
FROM (SELECT cc.fk_server, DATE(cc.date_time) as dia,
COUNT(*) as total_jogadores FROM connection_capturing cc
WHERE DAYOFWEEK(cc.date_time) IN (1, 6, 7) 
AND DATE(cc.date_time) NOT IN (SELECT DISTINCT DATE(dateAlert) 
FROM alert) GROUP BY cc.fk_server, DATE(cc.date_time)) as dados_diarios
INNER JOIN server s ON dados_diarios.fk_server = s.id_server
where game like ? AND DATE(dia) >= DATE_SUB(CURDATE(), INTERVAL 90 DAY) AND DATE(dia) <= DATE_SUB(CURDATE(), INTERVAL 60 DAY) 
GROUP BY mes;`

    const result1 = await database.executar(instrucaoSql, [nomeJogo])
    const result2 = await database.executar(instrucaoSql2, [nomeJogo])
    const result3 = await database.executar(instrucaoSql3, [nomeJogo])
    const result4 = await database.executar(instrucaoSql4, [nomeJogo])
    const result5 = await database.executar(instrucaoSql5, [nomeJogo])
    const result6 = await database.executar(instrucaoSql6, [nomeJogo])

    return {result1, result2, result3, result4, result5, result6,}
} 

module.exports = {
    buscarKPI3, 
    pesquisaJogo,
    legendaIncidente,
    listaJogos,
    dados_abandono,
    legendaAbandono,
    grafico2
}