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

const grafico1 = async(req,res) => {
    try {
        const nomeJogo = req.params.nomeJogo
        const selects = await abandonoModel.grafico1(nomeJogo)
        const resultFinal = []
        for (let i = 0; i < selects.result1.length; i++) {
            const semAlerta = selects.result1[i].media_jogadores_sem_alerta
            const comAlerta = selects.result2[i].media_jogadores_com_alerta
            resultFinal.push({
                continent: selects.result1[i].continente, 
                media_abandono: semAlerta - comAlerta
            })
        }
        return res.json(resultFinal)
    } catch(error) {
        return res.status(404).json(error.message);
    }
}

const buscarKPI1 = async(req,res) => {
    try {
        const select = await abandonoModel.buscarKPI1(nomeJogo)
        return res.status(200).json(select);
    } catch(error) {
        return res.status(404).json(error.message);
    }
}

module.exports = {
    buscarKPI3, 
    pesquisaJogo,
    listaJogos, 
    grafico1,
    buscarKPI1
}
