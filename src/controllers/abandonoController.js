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


const legendaIncidente = async(req,res) => {
    try {
        const nomeJogo = req.params.nomeJogo
        const select = await abandonoModel.legendaIncidente(nomeJogo)
        return res.status(200).json(select);
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

module.exports = {
    buscarKPI3, 
    pesquisaJogo,
    legendaIncidente,
    listaJogos
}
