const AppError = require('../error/AppError.js');
const Service = require("../services/RealTimeConnectionService.js")

const service = new Service();

class RealTimeConnectionController {
    receiveServerConnectionsData (req, res) {
        const { data } = req.body;

        if(!data) {
            throw new AppError("Mandatory data missing.", 400);
        }

        const mapper = service.receiveServerConnectionsData(data);

        if(mapper instanceof AppError) {
            throw mapper;
        }

        return res.status(200).json({message: "Successfully received server connections data"});
    }

    getQuantConnections(req, res) {
        const companyRegister = req.params["registerNumber"];
        const continent = req.query["continent"];

        if(!companyRegister) {
            throw new AppError("Mandatory data missing.", 400);
        }

        const connections = service.getQuantConnections(companyRegister, continent);

        if(connections instanceof AppError) {
            throw connections;
        }

        return res.status(200).json({ quantConnections: connections });
    }
}

module.exports = RealTimeConnectionController;