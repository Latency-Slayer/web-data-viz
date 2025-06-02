const Model = require("../models/AnaliticConnectionModel.js");
const {regexpToText} = require("nodemon/lib/utils");

const model = new Model();

class AnaliticConnectionService {
    async getDailyAverageConnectionsInPeriod (companyRegisterNumber, continent, period) {
        if(!companyRegisterNumber || !period) {
            return null;
        }

        const dailyConnections = await model.getDailyAverageConnectionsInPeriod(companyRegisterNumber, continent, period);

        return (dailyConnections.reduce((acc, v) => acc += v.total_connections, 0) / dailyConnections.length).toFixed(0);
    }

    async getPeakOfSimultaneousConnections (companyRegisterNumber, continent, period) {
        if(!companyRegisterNumber || !period) {
            return null;
        }

        return await model.getPeakOfSimultaneousConnections(companyRegisterNumber, continent, period);
    }

    async getTopGameOfPeriod (companyRegisterNumber, continent, period) {
        if(!companyRegisterNumber || !period) {
            return null;
        }

        const game = await model.getTopGameOfPeriod(companyRegisterNumber, continent, period)

        return game[0];
    }

    async getAllTopGamesOfPeriod(companyRegisterNumber, continent, period) {
        if(!companyRegisterNumber || !period) {
            return null;
        }

        return await model.getAllTopGamesOfPeriod(companyRegisterNumber, continent, period);
    }

    async getTopContinentsOfPeriod(companyRegisterNumber, continent, period) {
        if(!companyRegisterNumber || !period) {
            return null;
        }

        return await model.getTopContinentsOfPeriod(companyRegisterNumber, continent, period);
    }

    async getConnectionsVariation(companyRegisterNumber, continent, period) {
        if(!companyRegisterNumber || !period) {
            return null;
        }

        return await model.getConnectionsVariation(companyRegisterNumber, continent, period);
    }

    async getConnectionLocations(companyRegisterNumber, continent, period) {
        if(!companyRegisterNumber || !period) {
            return null;
        }

        return await model.getConnectionLocations(companyRegisterNumber, continent, period);
    }

    async getGameVariationOnPeriod(companyRegisterNumber, continent, period){
        if(!companyRegisterNumber || !period) {
            return null;
        }

        const result = await model.getGameVariationOnPeriod(companyRegisterNumber, continent, period);

        const orderedValues = new Map();

        result.forEach((v) => {
           if(!orderedValues.has(v.game)) {
               orderedValues.set(v.game, {
                   game: v.game,
                   connections: [],
                   dates: []
               });
           }

           const gameData = orderedValues.get(v.game);

           gameData.connections.push(v.total_connections)
           gameData.dates.push(v.date);
        });

        const dataJson = [];

        orderedValues.forEach(v => {
            dataJson.push(v);
        });

        return dataJson;
    }
}

module.exports = AnaliticConnectionService;