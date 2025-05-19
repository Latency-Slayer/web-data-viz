class RealTimeConnectionModel {
    #connectionsData;

    constructor() {
        this.#connectionsData = new Map();

        setInterval(() => this.removeInactiveServer(), 5000);
    }

    get connectionsData() {
        return this.#connectionsData;
    }

    mapConnectionsData(connectionsData) {
        function hasProperties(props, obj) {
            return props.every(prop => Object.hasOwn(obj, prop));
        }


        if (!connectionsData.hasOwnProperty("server_data")) {
            return null;
        }

        if (
            !hasProperties(
                ["registration_number", "motherboard_id", "tag_name", "port", "game", "continentCode", "country", "lon", "lat"],
                connectionsData.server_data)
            )
        {
            return null;
        }

        if (!connectionsData.hasOwnProperty("connections_data")) {
            return null;
        }

        const serverData = connectionsData.server_data;
        const connections = connectionsData.connections_data;

        if (!hasProperties(["quant_players", "players_data"], connections)) {
            return null;
        }


        if (!this.#connectionsData.has(serverData.registration_number)) {
            this.#connectionsData.set(serverData.registration_number, new Map());
        }

        const companyServers = this.#connectionsData.get(serverData.registration_number);

        if (!companyServers.hasOwnProperty(serverData.motherboard_id)) {
            companyServers.set(serverData.motherboard_id, {
                tagName: serverData.tag_name,
                game: serverData.game,
                port: serverData.port,
                continentCode: serverData.continentCode,
                country: serverData.country,
                lon: serverData.lon,
                lat: serverData.lat,
            });
        }

        const serverConnections = companyServers.get(serverData.motherboard_id)

        serverConnections.connectionsData = {
            quantConnections: connections.quant_players,
            connections: connections.players_data,
            lastUpdate: new Date()
        };

        return true;
    }

    getNumberOfConnections(registrationNumber) {
        const companyServers = this.#connectionsData.get(registrationNumber)

        if(!companyServers) {
            return 0;
        }

        let totalConnections = 0;

        companyServers.forEach((serverData) => {
            totalConnections += serverData.connectionsData.quantConnections
        });

        return totalConnections;
    }

    getNumberOfConnectionsInContinent(registrationNumber, continentCode) {
        const companyServers = this.#connectionsData.get(registrationNumber)

        if(!companyServers) {
            return 0;
        }

        let totalConnections = 0;

        companyServers.forEach((serverData) => {
            serverData.connectionsData.connections.forEach((connection) => {

                if (connection[2].continent_code == continentCode) {
                    totalConnections++;
                }
            })

        });

        return totalConnections;
    }

    getNumberOfActiveServers(registrationNumber) {
        const servers = this.#connectionsData.get(registrationNumber);

        return servers ? servers.size : 0;
    }

    getNumberOfActiveServersInContinent(registrationNumber, continentCode) {
        const companyServers = this.#connectionsData.get(registrationNumber)

        let totalServers = 0;

        companyServers.forEach((serverData) => {
            if(serverData.continentCode == continentCode) {
                totalServers++;
            }
        })

        return totalServers;
    }

    getTopGamesOfMoment(registrationNumber) {
        const companyServers = this.#connectionsData.get(registrationNumber);

        const gamesOfMoment = new Map();

        if(!companyServers) {
            return [];
        }

        companyServers.forEach((serverData) => {
            const serverQuantConnections = serverData.connectionsData.quantConnections;
            const serverGame = serverData.game;

            if(!gamesOfMoment.has(serverGame)) {
                gamesOfMoment.set(serverGame, 0);
            }

            const quantConnections = gamesOfMoment.get(serverGame);

            gamesOfMoment.set(serverGame, quantConnections + serverQuantConnections);
        });

        return [...gamesOfMoment];
    }

    getTopGamesOfMomentInContinent(registrationNumber, continentCode) {
        const companyServers = this.#connectionsData.get(registrationNumber);

        const gamesOfMoment = new Map();

        companyServers.forEach((serverData) => {
            let serverQuantConnections = 0;

            serverData.connectionsData.connections.forEach((connection) => {
                console.log(connection[2].continent_code);

                if(connection[2].continent_code === continentCode) {
                    serverQuantConnections++;
                }
            });

            const serverGame = serverData.game;

            if(!gamesOfMoment.has(serverGame)) {
                gamesOfMoment.set(serverGame, 0);
            }

            const quantConnections = gamesOfMoment.get(serverGame);

            gamesOfMoment.set(serverGame, quantConnections + serverQuantConnections);
        });

        return [...gamesOfMoment].sort((a, b) => b[1] - a[1]);
    }

    removeInactiveServer() {
        this.#connectionsData.forEach((companyServers) => {
            companyServers.forEach((serverData, motherboardId) => {
                if(Date.now() - serverData.connectionsData.lastUpdate.getTime() > 5000) {
                    companyServers.delete(motherboardId);
                }
            });
        });
    }
}

module.exports = RealTimeConnectionModel;