const Service = require("../services/AnaliticConnectionService.js");

const service = new Service();

class AnaliticConnectionController {
    async getDailyAverageConnectionsInPeriod (req, res) {
        const companyRegisterNumber = req.params["registerNumber"];
        const period = req.params["period"];
        const continent = req.query.continent;

        const result = await service.getDailyAverageConnectionsInPeriod(companyRegisterNumber, continent, period);

        return res.json({ result });
    }

    async getPeakOfSimultaneousConnections (req, res) {
        const companyRegisterNumber = req.params["registerNumber"];
        const period = req.params["period"];
        const continent = req.query.continent;

        const result = await service.getPeakOfSimultaneousConnections(companyRegisterNumber, continent, period);

        return res.json({ peak: result[0] });
    }

    async getTopGameOfPeriod(req, res) {
        const companyRegisterNumber = req.params["registerNumber"];
        const period = req.params["period"];
        const continent = req.query.continent;

        const result = await service.getTopGameOfPeriod(companyRegisterNumber, continent, period);

        return res.json({ result });
    }

    async getAllTopGamesOfPeriod(req, res) {
        const companyRegisterNumber = req.params["registerNumber"];
        const period = req.params["period"];
        const continent = req.query.continent;

        const result = await service.getAllTopGamesOfPeriod(companyRegisterNumber, continent, period);

        return res.json({ result });
    }

    async getTopContinentsOfPeriod(req, res) {
        const companyRegisterNumber = req.params["registerNumber"];
        const period = req.params["period"];
        const continent = req.query.continent;

        const result = await service.getTopContinentsOfPeriod(companyRegisterNumber, continent, period);

        return res.json({ result });
    }

    async getConnectionsVariation(req, res) {
        const companyRegisterNumber = req.params["registerNumber"];
        const period = req.params["period"];
        const continent = req.query.continent;

        const result = await service.getConnectionsVariation(companyRegisterNumber, continent, period);

        return res.json({ result });
    }

    async getConnectionLocations(req, res) {
        const companyRegisterNumber = req.params["registerNumber"];
        const period = req.params["period"];
        const continent = req.query.continent;

        const result = await service.getConnectionLocations(companyRegisterNumber, continent, period);

        return res.json({ playerLocations: result });
    }

    async getGameVariationOnPeriod(req, res) {
        const companyRegisterNumber = req.params["registerNumber"];
        const period = req.params["period"];
        const continent = req.query.continent;

        console.log(period);

        const result = await service.getGameVariationOnPeriod(companyRegisterNumber, continent, period);

        return res.json({ result });
    }
}

module.exports = AnaliticConnectionController;