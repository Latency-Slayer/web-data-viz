var serverModel = require("../models/serverModel");

async function registerServer(req, res) {
    // console.log(req.body)

    try {
        const serverRegister = await serverModel.registerServer(req.body)

        res.send()
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = {
    registerServer
};