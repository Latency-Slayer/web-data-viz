const Model = require("../models/AnaliticConnectionModel.js");

const model = new Model();

class AnaliticConnectionService {
    async getDailyAverageConnectionsInPeriod (companyRegisterNumber, continent, period) {
        if(!companyRegisterNumber || !period) {
            return null;
        }

        const avarageMonth = await model.getDailyAverageConnectionsInPeriod(companyRegisterNumber, continent, period);

        return avarageMonth.reduce((accumulator, currentValue) => {
            return accumulator + Number(currentValue.media_mensal)
        }, 0) / avarageMonth.length;
    }
}


module.exports = AnaliticConnectionService;