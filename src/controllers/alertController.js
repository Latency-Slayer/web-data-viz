var alertModel = require("../models/alertModel")

async function registerAlert(req, res) {
    try {
        await alertModel.registerAlert(req.body.status, req.body.dateAlert,req.body.mensage, req.body.exceeded_limit,req.body.valor,req.body.fk_Metric,req.body.nivel)

        res.status(201).json({ message: "Alert successfully register." })
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

function getAlerts(req, res){
    alertModel.getAlerts()
        .then((resultado) => {
            const total = resultado[0]["COUNT(id_Alert)"];
            res.status(200).json({ total: total });
        })
        .catch((erro) => {
            console.error(erro);
            res.status(500).json({ error: "Erro ao buscar alertas" });
        });
}


module.exports = {
    registerAlert,
    getAlerts
}