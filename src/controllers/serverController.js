var serverModel = require("../models/serverModel");

async function registerServer(req, res) {
    try {
        await serverModel.registerServer(req.body)

        res.status(201).json({ message: "Server and components successfully register." })
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = {
    registerServer
};