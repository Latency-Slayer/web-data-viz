const abandonoModel = require("../models/abandonoModel")

const buscarKPI3 = async(req,res) => {
    try {
        const select = await abandonoModel.buscarKPI3()
        return res.status(200).json(select);
    } catch(error) {
        return res.status(404).json(error.message);
    }
}

module.exports = {
    buscarKPI3
}
