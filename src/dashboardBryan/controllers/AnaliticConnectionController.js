const Service = require("../services/AnaliticConnectionService.js");

const service = new Service();

class AnaliticConnectionController {
    async getDailyAverageConnectionsInPeriod (req, res) {
        const companyRegisterNumber = req.params["registerNumber"];
        const period = req.params["period"];
        const continent = req.query.continent;

        const result = await service.getDailyAverageConnectionsInPeriod(companyRegisterNumber, continent, period);

        return res.json(result);
    }
}

module.exports = AnaliticConnectionController;