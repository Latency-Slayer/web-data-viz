const RealTimeConnectionModel = require("../models/RealTimeConnectionModel");
const AppError = require("../error/AppError");

const model = new RealTimeConnectionModel();

class RealTimeConnectionService {
    receiveServerConnectionsData(serverConnectionsJson) {
        const mapper = model.mapConnectionsData(serverConnectionsJson);

        if(!mapper) {
            return new AppError("Erro on data mapping", 400, "Error mapping data. The submitted object is in an unknown format.");
        }

        return 201;
    }

    getQuantConnections(companyRegisterNumber, continent) {
        if(!companyRegisterNumber) {
            return AppError("Error getting information for companyRegisterNumber", 400);
        }

        const continents = ["AS", "AF", "SA", "NA", "EU", "OC", "AN"];

        if(continents.includes(continent)) {
            return model.getNumberOfConnectionsInContinent(companyRegisterNumber, continent);
        }

        return model.getNumberOfConnections(companyRegisterNumber);
    }

    getQuantServerActive(companyRegisterNumber, continent) {
        if(!companyRegisterNumber) {
            return AppError("Error getting information for companyRegisterNumber", 400);
        }

        const continents = ["AS", "AF", "SA", "NA", "EU", "OC", "AN"];

        if(continents.includes(continent)) {
            return model.getNumberOfActiveServersInContinent(companyRegisterNumber, continent);
        }

        return model.getNumberOfActiveServers(companyRegisterNumber);
    }

    getTopGames(companyRegisterNumber, continent) {
        if(!companyRegisterNumber) {
            return AppError("Error getting information for companyRegisterNumber", 400);
        }

        const continents = ["AS", "AF", "SA", "NA", "EU", "OC", "AN"];

        if(continents.includes(continent)) {
            return model.getTopGamesOfMomentInContinent(companyRegisterNumber, continent);
        }

        return model.getTopGamesOfMoment(companyRegisterNumber);
    }


    getTopContinents(companyRegisterNumber) {
        if(!companyRegisterNumber) {
            return AppError("Error getting information for companyRegisterNumber", 400);
        }

        return model.topContinents(companyRegisterNumber);
    }

    getTopCountries(companyRegisterNumber, continent) {
        if(!companyRegisterNumber || !continent) {
            return AppError("Error getting information for companyRegisternumber or continent", 400);
        }

        return model.getTopCountries(companyRegisterNumber, continent);
    }

    getFarPlayers(companyRegisterNumber, continent) {
        if(!companyRegisterNumber || !continent) {
            return AppError("Error getting information for companyRegisterNumber", 400);
        }

        return model.getFarPlayers(companyRegisterNumber, continent);
    }

    getPlayerLocations(companyRegisterNumber, continent) {
        if(!companyRegisterNumber) {
            return AppError("Error getting information for companyRegisterNumber", 400);
        }

        if(!continent) {
            return model.getPlayerLocations(companyRegisterNumber);
        }
    }
}

module.exports = RealTimeConnectionService;