const abandonoModel = require("../models/abandonoModel")

const buscarKPI3 = async(req,res) => {
    try {
        const select = await abandonoModel.buscarKPI3()
        return res.status(200).json(select);
    } catch(error) {
        return res.status(404).json(error.message);
    }
}

const pesquisaJogo = async(req,res) => {
    try {
        const nomeJogo = req.params.nomeJogo
        const select = await abandonoModel.pesquisaJogo(nomeJogo)
        const selectmespass = await abandonoModel.legendaIncidente(nomeJogo)
        return res.status(200).json({select, selectmespass});
    } catch(error) {
        return res.status(404).json(error.message);
    }
}

const listaJogos = async(req,res) => {
    try {
        const id_company = req.params.id_company
        const select = await abandonoModel.listaJogos(id_company)
        return res.status(200).json(select);
    } catch(error) {
        return res.status(404).json(error.message);
    }
}

const dados_abandono = async(req,res) => {
    try {
        console.log("controller")
        const nomeJogo = req.params.nomeJogo
        const selects = await abandonoModel.dados_abandono(nomeJogo)
        const resultFinal = []
        console.log(selects)
        for (let i = 0; i < selects.result1.length; i++) {
            const semAlerta = selects.result1[i].media_jogadores_sem_alerta
            const comAlerta = selects.result2[i].media_jogadores_com_alerta
            resultFinal.push({
                continent: selects.result1[i].continente, 
                media_abandono: semAlerta - comAlerta
            })
        }
        return res.status(200).json(resultFinal)
    } catch(error) {
        return res.status(404).json(error.sqlMessage);
    }
}

const dados_abandono_kpi = async(req,res) => {
    try {
        console.log("controller")
        const nomeJogo = req.params.nomeJogo
        const selects = await abandonoModel.dados_abandono(nomeJogo);
        const selectsMesAnterior = await abandonoModel.legendaAbandono(nomeJogo);
        let totalAbandono = 0;
        let totalAbandonoPass = 0;

        for (let i = 0; i < selectsMesAnterior.result1.length; i++) {
            const semAlerta = selectsMesAnterior.result1[i].media_jogadores_sem_alerta
            const comAlerta = selectsMesAnterior.result2[i].media_jogadores_com_alerta

            const abandono = semAlerta - comAlerta;

            totalAbandonoPass += abandono;

        }
        
        for (let i = 0; i < selects.result1.length; i++) {
            console.log("laiza", selects)
            const semAlerta = selects.result1[i].media_jogadores_sem_alerta
            const comAlerta = selects.result2[i].media_jogadores_com_alerta
            
            const abandono = semAlerta - comAlerta;

            totalAbandono += abandono;
        }

        return res.json({totalAbandono, totalAbandonoPass})
    } catch(error) {
        return res.status(404).json(error.sqlMessage);
    }
}

module.exports = {
    buscarKPI3, 
    pesquisaJogo,
    listaJogos, 
    dados_abandono,
    dados_abandono_kpi,
}