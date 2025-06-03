let ultimaMetrica = new Map() // guardar os ultimos dados advindos do python
let ultimaChamadaJira = new Map()

const serverModel = require("../models/serverModel")
const alertModel = require("../models/alertModel")
const { abrirChamado } = require("../routes/jira.js")

//Função para receber os dados do Python via POST
async function receberDados(req, res) {
    const id = req.body.motherboardId;
    const metrics = req.body.metrics;

    const limites = await serverModel.getLimitComponent(id);
    const fk_metrics = await serverModel.getMetric(id);

    const alertas = await alertModel.getAlerts(id);
    const alertasPorDia = await alertModel.getAlertsPorDia(id);

    console.log("Alertas: " + alertas)
    console.log("Alertas por Dia: " + alertasPorDia)

    const limitesMap = {};
    const fk_metricsMaps = {};

    limites.forEach(item => {
        limitesMap[item.type] = item.max_limit;
    });

    fk_metrics.forEach(item => {
        fk_metricsMaps[item.type] = item.fk_metric;
    })

    const alertasMap = {};
    if (alertas.length > 0) {
        alertas.forEach(alerta => {
            alertasMap[alerta.motherboard] = alerta.total_criados;
        });
    }

    console.log("Map ALERTAS: " + JSON.stringify(alertasMap));

    ultimaMetrica.set(id, { metrics, limites: limitesMap, alertas: alertasMap, fk_metrics: fk_metricsMaps });
    if (metrics.cpu_percent > limitesMap.cpu) {
        const nivel = 'Crítico'
        const idJira = await abrirChamadoJira('cpu', metrics.cpu_percent, limitesMap.cpu, nivel, id);

        await registrarAlerta(
            {
                componente: 'cpu',
                valorAtual: metrics.cpu_percent,
                limite: limitesMap.cpu,
                nivel: nivel,
                idJira: idJira,
                motherboardId: id
            });
    }

    if (metrics.cpu_percent <= limitesMap.cpu && metrics.cpu_percent >= limitesMap.cpu - 20) {
        const nivel = 'Atenção'
        const idJira = await abrirChamadoJira('cpu', metrics.cpu_percent, limitesMap.cpu, nivel, id);

        await registrarAlerta(
            {
                componente: 'cpu',
                valorAtual: metrics.cpu_percent,
                limite: limitesMap.cpu,
                nivel: nivel,
                idJira: idJira,
                motherboardId: id
            });
    }

    console.log(metrics.ram_percent, limitesMap.ram)
    if (metrics.ram_percent > limitesMap.ram) {

        const nivel = 'Crítico'
        const idJira = await abrirChamadoJira('ram', metrics.ram_percent, limitesMap.ram, nivel, id);

        await registrarAlerta(
            {
                componente: 'ram',
                valorAtual: metrics.ram_percent,
                limite: limitesMap.ram,
                nivel: nivel,
                idJira: idJira,
                motherboardId: id
            });
    }

    if (metrics.ram_percent <= limitesMap.ram && metrics.ram_percent >= limitesMap.ram - 20) {
        const nivel = 'Atenção'
        const idJira = await abrirChamadoJira('ram', metrics.ram_percent, limitesMap.ram, nivel, id);

        await registrarAlerta(
            {
                componente: 'ram',
                valorAtual: metrics.ram_percent,
                limite: limitesMap.ram,
                nivel: nivel,
                idJira: idJira,
                motherboardId: id
            });
    }

    if (metrics.disk_percent > limitesMap.disk) {

        const nivel = 'Crítico'
        const idJira = await abrirChamadoJira('storage', metrics.disk_percent, limitesMap.storage, nivel, id);

        await registrarAlerta({
            componente: 'storage',
            valorAtual: metrics.disk_percent,
            limite: limitesMap.storage,
            nivel: nivel,
            idJira: idJira,
            motherboardId: id
        });
    }

    if (metrics.disk_percent <= limitesMap.storage && metrics.disk_percent >= limitesMap.storage - 20) {
        const nivel = 'Atenção'
        const idJira = await abrirChamadoJira('storage', metrics.disk_percent, limitesMap.storage, nivel, id);

        await registrarAlerta(
            {
                componente: 'storage',
                valorAtual: metrics.disk_percent,
                limite: limitesMap.storage,
                nivel: nivel,
                idJira: idJira,
                motherboardId: id
            });
    }

    console.log("Métricas recebidas:", ultimaMetrica);

    console.log("Métricas recebidas e verificadas:", ultimaMetrica);
    res.status(200).json({ mensagem: "Métricas processadas com sucesso" });
}


function enviarDados(req, res) {
    console.log([...ultimaMetrica])
    res.json([...ultimaMetrica])
}

async function abrirChamadoJira(componente, valor, limite, nivel, motherboardId) {
    const mensagem = `O componente ${componente.toUpperCase()} atingiu nível ${nivel}: ${valor}% (Limite: ${limite}%) no servidor ${motherboardId}`;

    try {
        const chamado = await abrirChamado(
            `Alerta: ${componente.toUpperCase()} - ${valor}% ${nivel} no Servidor ${motherboardId}`,
            mensagem
        )

        return chamado;

    } catch (err) {
        console.error('Erro ao criar chamado:', err);
        return null;
    }
}

async function registrarAlerta({ componente, valorAtual, limite, nivel, idJira, motherboardId}) {
    try {
        const metrics = await serverModel.getMetric(motherboardId);

        for (const metric of metrics) {
            const fk_Metric = metric.fk_metric;

            const res = await alertModel.registerAlert(
                "aberto",
                formatData(new Date()),
                `O componente ${componente.toUpperCase()} ${nivel === "Crítico" ? "ultrapassou" : "está próximo do"} limite. Valor: ${valorAtual}%, Limite: ${limite}% no servidor ${motherboardId}`,
                limite,
                valorAtual,
                fk_Metric,
                nivel,
                idJira,
            )
            console.log("Alerta: " + res)
            return res;
        }

    } catch (err) {
        console.error("Erro ao registrar alerta:", err);
    }
}



function formatData(date) {
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0') + ':' +
        String(date.getSeconds()).padStart(2, '0');
}

module.exports = {
    receberDados,
    enviarDados
};