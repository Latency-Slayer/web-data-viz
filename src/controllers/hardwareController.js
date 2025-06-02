let ultimaMetrica = new Map() // guardar os ultimos dados advindos do python
let ultimaChamadaJira = new Map()

const serverModel = require("../models/serverModel")

//Função para receber os dados do Python via POST
async function receberDados(req, res) {
    const id = req.body.motherboardId;
    const metrics = req.body.metrics;

    const limites = await serverModel.getLimitComponent(id);
    const limitesMap = {};

    limites.forEach(item => {
        limitesMap[item.type] = item.max_limit;
    });

    ultimaMetrica.set(id, { metrics, limites: limitesMap });

    console.log("Métricas recebidas:", ultimaMetrica);

    const agora = new Date();
    const date = formatData(agora);

    for (const componente of ['cpu', 'ram', 'disk']) {
        const valorAtual = parseFloat(metrics[`${componente}_percent`]);
        const limite = limitesMap[componente];

        if (valorAtual >= limite) {
            if (podeAbrirChamado(id, componente, date)) {
                const nivel = 'Crítico';

                const idJira = await abrirChamadoJira(componente, valorAtual, limite, nivel, id);

                await registrarAlerta({
                    componente,
                    valorAtual,
                    limite,
                    nivel,
                    idJira,
                    motherboardId: id
                });

                atualizarUltimaChamada(id, componente, date);
            }
        } else if (valorAtual >= 65) { // atenção padrão
            if (podeAbrirChamado(id, componente, date)) {
                const nivel = 'Atenção';

                const idJira = await abrirChamadoJira(componente, valorAtual, limite, nivel, id);

                await registrarAlerta({
                    componente,
                    valorAtual,
                    limite,
                    nivel,
                    idJira,
                    motherboardId: id
                });

                atualizarUltimaChamada(id, componente, date);
            }
        }
    }

    console.log("Métricas recebidas e verificadas:", ultimaMetrica);
    res.status(200).json({ mensagem: "Métricas processadas com sucesso" });
}


function enviarDados(req, res) {
    console.log([...ultimaMetrica])
    res.json([...ultimaMetrica])
}


function podeAbrirChamado(id, componente, agora) {
    const chave = `${id}_${componente}`;
    const ultima = ultimaChamadaJira.get(chave) || 0;
    return (agora - ultima) >= 30000; // 30 segundos
}

function atualizarUltimaChamada(id, componente, agora) {
    const chave = `${id}_${componente}`;
    ultimaChamadaJira.set(chave, agora);
}

async function abrirChamadoJira(componente, valor, limite, nivel, motherboardId) {
    const mensagem = `O componente ${componente.toUpperCase()} atingiu nível ${nivel}: ${valor}% (Limite: ${limite}%) no servidor ${motherboardId}`;

    try {
        const res = await fetch('/jira/criar-chamado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                summary: `Alerta: ${componente.toUpperCase()} - ${valor}% ${nivel} no Servidor ${motherboardId}`,
                description: mensagem,
                assignee: "712020:46bc3ab4-b0da-4a73-9cd5-8b395c3e3678"
            })
        });

        if (!res.ok) {
            console.error(`Erro HTTP: ${res.status}`);
            const text = await res.text();
            console.error('Detalhes do erro:', text);
            return null;
        }

        const data = await res.json();
        console.log('Chamado criado com ID:', data.data.id);
        return data.data.id;

    } catch (err) {
        console.error('Erro ao criar chamado:', err);
        return null;
    }
}

async function registrarAlerta({ componente, valorAtual, limite, nivel, idJira, motherboardId }) {
    const fk_Metric = componente === "cpu" ? 5 : componente === "ram" ? 3 : 2;

    const payload = {
        status: "aberto",
        dateAlert: new Date().toISOString(),
        mensage: `O componente ${componente.toUpperCase()} ${nivel === "Crítico" ? "ultrapassou" : "está próximo do"} limite. Valor: ${valorAtual}%, Limite: ${limite}% no servidor ${motherboardId}`,
        exceeded_limit: limite,
        valor: valorAtual,
        fk_Metric: fk_Metric,
        nivel: nivel,
        idJira: idJira,
        motherboardId: motherboardId
    };

    try {
        const res = await fetch('/alert/registerAlert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const json = await res.json();
        console.log("Alerta registrado:", json);
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