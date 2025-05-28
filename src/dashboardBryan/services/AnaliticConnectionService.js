const Model = require("../models/AnaliticConnectionModel.js");

const model = new Model();

class AnaliticConnectionService {
    async getDailyAverageConnectionsInPeriod (companyRegisterNumber, continent, period) {
        if(!companyRegisterNumber || !period) {
            return null;
        }

        const avarageMonth = await model.getDailyAverageConnectionsInPeriod(companyRegisterNumber, continent, period);



        return Math.round(avarageMonth.reduce((accumulator, currentValue) => {
            return accumulator + Number(currentValue.media_mensal)
        }, 0) / avarageMonth.length, 0) || 0;
    }


    async getPeakOfSimultaneousConnections (companyRegisterNumber, continent, period) {
        if(!companyRegisterNumber || !period) {
            return null;
        }

        const data = await model.getPeakOfSimultaneousConnections(companyRegisterNumber, continent, period);

        return data;
    }
}


module.exports = AnaliticConnectionService;