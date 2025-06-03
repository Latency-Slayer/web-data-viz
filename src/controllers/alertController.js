var alertModel = require("../models/alertModel")

async function registerAlert(req, res) {
    try {
        await alertModel.registerAlert(
            req.body.status,
            req.body.dateAlert,
            req.body.mensage,
            req.body.exceeded_limit,
            req.body.valor,
            req.body.fk_Metric,
            req.body.nivel,
            req.body.idJira
        )

        res.status(201).json({ message: "Alert successfully register." })
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

function getAlerts(req, res) {
    const motherboard = req.params.motherboard;
    console.log("getAlerts chamado com motherboard:", motherboard);

    alertModel.getAlerts(motherboard)
        .then((resultado) => {
            console.log("Resultado da query getAlerts:", resultado);
            res.status(200).json(resultado);
        })
        .catch((erro) => {
            console.error("Erro no getAlerts:", erro);
            res.status(500).json({ error: "Erro ao buscar alertas" });
        });
}


function getAlertsPorDia(req, res) {
    const motherboard = req.params.motherboard

    alertModel.getAlertsPorDia(motherboard)
        .then((resultado) => {
            console.log("Resultado da query getAlertsPorSemana:", resultado);
            res.status(200).json(resultado);  
        })
        .catch((erro) => {
            console.error(erro);
            res.status(500).json({ error: "Erro ao buscar alertas por dia" });
        });
}


module.exports = {
    registerAlert,
    getAlerts,
    getAlertsPorDia
}