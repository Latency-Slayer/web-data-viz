var serverModel = require("../models/serverModel");

async function registerServer(req, res) {
    try {
        await serverModel.registerServer(req.body)

        res.status(201).json({ message: "Server and components successfully register." })
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function getServerComponentsData(req, res) {
    try {
        const server = await serverModel.getServerComponentsData(req.query.motherboardID);
        return res.status(200).json(server);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

function getServerBytagName(req, res){

    var tagName = req.body.tagName
    serverModel.getServerBytagName.then((resultado) => {
        res.status(200).json(resultado);
    })
}
function listarServer(req, res){
    serverModel.listarServer().then((resultado) => {
        res.status(200).json(resultado);
    })
}

module.exports = {
    registerServer,
    getServerComponentsData,
    getServerBytagName,
    listarServer
};