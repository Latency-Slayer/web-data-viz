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

    getQuantActiveServers(req, res) {
        const companyRegister = req.params["registerNumber"];
        const continent = req.query["continent"];

        if(!companyRegister) {
            throw new AppError("Mandatory data missing.", 400);
        }

        const activeServers = service.getQuantServerActive(companyRegister, continent);

        if(activeServers instanceof AppError) {
            throw activeServers;
        }

        return res.status(200).json({ quantActiveServers: activeServers });
    }

    getTopGamesOfMoment(req, res) {
        const companyRegister = req.params["registerNumber"];
        const continent = req.query["continent"];

        if(!companyRegister) {
            throw new AppError("Mandatory data missing.", 400);
        }

        const topGames = service.getTopGames(companyRegister, continent);

        if(topGames instanceof AppError) {
            throw topGames;
        }

        return res.status(200).json({ topGames: topGames });
    }

    getTopContinents(req, res) {
        const companyRegister = req.params["registerNumber"];

        if(!companyRegister) {
            throw new AppError("Mandatory data missing.", 400);
        }

        const topContinents = service.getTopContinents(companyRegister);

        return res.status(200).json({ topContinents });
    }

    getTopCountries(req, res) {
        const companyRegister = req.params["registerNumber"];
        const continent = req.query["continent"];

        if(!companyRegister || !continent) {
            throw new AppError("Mandatory data missing.", 400);
        }

        const topCountries = service.getTopCountries(companyRegister, continent);

        return res.status(200).json({ topCountries: topCountries });
    }

    getFarPlayers(req, res) {
        const companyRegister = req.params["registerNumber"];
        const continent = req.query["continent"];

        if(!companyRegister || !continent) {
            throw new AppError("Mandatory data missing.", 400);
        }

        const farPlayers = service.getFarPlayers(companyRegister, continent);

        if(farPlayers instanceof AppError) {
            throw farPlayers;
        }

        return res.status(200).json({ farPlayers: farPlayers });
    }

    getPlayerLocations(req, res) {
        const companyRegister = req.params["registerNumber"];
        const continent = req.query["continent"];

        if(!companyRegister) {
            throw new AppError("Mandatory data missing.", 400);
        }

        const playerLocations = service.getPlayerLocations(companyRegister, continent);

        return res.status(200).json({ playerLocations });
    }
}

module.exports = RealTimeConnectionController;