class RealTimeConnectionModel {
    #connectionsData;

    constructor() {
        this.#connectionsData = new Map();
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
        return this.#connectionsData.get(registrationNumber).size
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

        return [...gamesOfMoment];
    }
}

module.exports = RealTimeConnectionModel;



// const realTimeModel = new RealTimeConnectionModel();
// const map = realTimeModel.mapConnectionsData({
//     "server_data": {
//         "motherboard_id": "NBQEK110033420006FMO00",
//         "tag_name": "Server #01",
//         "type": "on-premise",
//         "game": "Call Of Duty",
//         "port": 25565,
//         "legal_name": "Mojang Studios",
//         "registration_number": "SE000000000001",
//         'continent': 'South America',
//         'continentCode': 'SA',
//         'country': 'Brazil',
//         'region': 'SP',
//         'city': 'São Paulo',
//         'zip': '01000',
//         'lat': -23.6301,
//         'lon': -46.6378
//     },
//     "connections_data": {
//         "quant_players": 12,
//         "players_data": [
//             [
//                 "200.213.173.84",
//                 25565,
//                 {
//                     "country": "Brazil",
//                     "city": "São Paulo",
//                     "region": "SP",
//                     "zip": "01000",
//                     "lat": -23.6301,
//                     "lon": -46.6378,
//                     "continent_code": "SA"
//                 }
//             ],
//             [
//                 "82.24.117.146",
//                 25565,
//                 {
//                     "country": "India",
//                     "city": "Jaipur",
//                     "region": "RJ",
//                     "zip": "302004",
//                     "lat": 26.9136,
//                     "lon": 75.7858,
//                     "continent_code": "AS"
//                 }
//             ],
//             [
//                 "208.59.44.156",
//                 25565,
//                 {
//                     "country": "United States",
//                     "city": "Chicago",
//                     "region": "IL",
//                     "zip": "60622",
//                     "lat": 41.9025,
//                     "lon": -87.6726,
//                     "continent_code": "NA"
//                 }
//             ],
//             [
//                 "66.108.247.85",
//                 25565,
//                 {
//                     "country": "United States",
//                     "city": "Queens",
//                     "region": "NY",
//                     "zip": "11429",
//                     "lat": 40.7109,
//                     "lon": -73.7388,
//                     "continent_code": "NA"
//                 }
//             ],
//             [
//                 "70.242.34.225",
//                 25565,
//                 {
//                     "country": "United States",
//                     "city": "Abilene",
//                     "region": "TX",
//                     "zip": "79608",
//                     "lat": 32.4492,
//                     "lon": -99.7337,
//                     "continent_code": "NA"
//                 }
//             ],
//             [
//                 "198.190.147.111",
//                 25565,
//                 {
//                     "country": "United States",
//                     "city": "Portland",
//                     "region": "OR",
//                     "zip": "97201",
//                     "lat": 45.5117,
//                     "lon": -122.679,
//                     "continent_code": "NA"
//                 }
//             ],
//             [
//                 "200.237.188.127",
//                 25565,
//                 {
//                     "country": "Brazil",
//                     "city": "Curitiba",
//                     "region": "PR",
//                     "zip": "80000-000",
//                     "lat": -25.4269,
//                     "lon": -49.2652,
//                     "continent_code": "SA"
//                 }
//             ],
//             [
//                 "129.130.206.193",
//                 25565,
//                 {
//                     "country": "United States",
//                     "city": "Manhattan",
//                     "region": "KS",
//                     "zip": "66502",
//                     "lat": 39.1918,
//                     "lon": -96.5818,
//                     "continent_code": "NA"
//                 }
//             ],
//             [
//                 "13.134.181.197",
//                 25565,
//                 {
//                     "country": "United Kingdom",
//                     "city": "London",
//                     "region": "ENG",
//                     "zip": "W1B",
//                     "lat": 51.5074,
//                     "lon": -0.127758,
//                     "continent_code": "EU"
//                 }
//             ],
//             [
//                 "195.32.92.223",
//                 25565,
//                 {
//                     "country": "Italy",
//                     "city": "Teramo",
//                     "region": "65",
//                     "zip": "64100",
//                     "lat": 42.6622,
//                     "lon": 13.6977,
//                     "continent_code": "EU"
//                 }
//             ],
//             [
//                 "181.82.203.0",
//                 25565,
//                 {
//                     "country": "Argentina",
//                     "city": "San Juan Bautista",
//                     "region": "B",
//                     "zip": "1889",
//                     "lat": -34.809,
//                     "lon": -58.2762,
//                     "continent_code": "SA"
//                 }
//             ],
//             [
//                 "219.5.14.63",
//                 25565,
//                 {
//                     "country": "Japan",
//                     "city": "Minato-ku",
//                     "region": "13",
//                     "zip": "104-0045",
//                     "lat": 35.6629,
//                     "lon": 139.761,
//                     "continent_code": "AS"
//                 }
//             ]
//         ]
//
//     }
// })
//
// realTimeModel.mapConnectionsData({
//         'server_data': {
//             'motherboard_id': 'HNZ-202112132021',
//             'tag_name': 'PC Bryan',
//             'type': 'on-premise',
//             'game': 'Minecraft',
//             'port': 25565,
//             'legal_name': 'Mojang Studios',
//             'registration_number': 'SE000000000001',
//             'continent': 'South America',
//             'continentCode': 'SA',
//             'country': 'Brazil',
//             'region': 'SP',
//             'city': 'São Paulo',
//             'zip': '01000',
//             'lat': -23.6301,
//             'lon': -46.6378
//         }, 'connections_data': {
//             'quant_players': 52,
//             'players_data': [['218.169.29.141', 25565, {
//                 'country': 'Taiwan',
//                 'city': 'Taipei',
//                 'region': '',
//                 'continent_code': 'AS',
//                 'zip': '',
//                 'lat': 25.033,
//                 'lon': 121.565
//             }], ['200.143.78.121', 25565, {
//                 'country': 'Brazil',
//                 'city': 'São Paulo',
//                 'region': 'SP',
//                 'continent_code': 'SA',
//                 'zip': '01000',
//                 'lat': -23.6301,
//                 'lon': -46.6378
//             }], ['188.162.117.255', 25565, {
//                 'country': 'Russia',
//                 'city': 'Moscow',
//                 'region': 'MOW',
//                 'continent_code': 'EU',
//                 'zip': '144700',
//                 'lat': 55.7558,
//                 'lon': 37.6173
//             }], ['3.81.229.104', 25565, {
//                 'country': 'United States',
//                 'city': 'Ashburn',
//                 'region': 'VA',
//                 'continent_code': 'NA',
//                 'zip': '20149',
//                 'lat': 39.0438,
//                 'lon': -77.4874
//             }], ['170.94.86.28', 25565, {
//                 'country': 'United States',
//                 'city': 'Conway',
//                 'region': 'AR',
//                 'continent_code': 'NA',
//                 'zip': '72034',
//                 'lat': 35.0812,
//                 'lon': -92.4722
//             }], ['33.222.104.5', 25565, {
//                 'country': 'United States',
//                 'city': 'Whitehall',
//                 'region': 'OH',
//                 'continent_code': 'NA',
//                 'zip': '43218',
//                 'lat': 39.9747,
//                 'lon': -82.8947
//             }], ['203.93.18.240', 25565, {
//                 'country': 'China',
//                 'city': 'Beijing',
//                 'region': 'BJ',
//                 'continent_code': 'AS',
//                 'zip': '100000',
//                 'lat': 39.9042,
//                 'lon': 116.407
//             }], ['59.197.160.59', 25565, {
//                 'country': 'China',
//                 'city': 'Beijing',
//                 'region': 'BJ',
//                 'continent_code': 'AS',
//                 'zip': '100000',
//                 'lat': 39.9042,
//                 'lon': 116.407
//             }], ['211.107.245.214', 25565, {
//                 'country': 'South Korea',
//                 'city': 'Yongin-si',
//                 'region': '41',
//                 'continent_code': 'AS',
//                 'zip': '16940',
//                 'lat': 37.298,
//                 'lon': 127.0777
//             }], ['213.133.122.179', 25565, {
//                 'country': 'Germany',
//                 'city': 'Nuremberg',
//                 'region': 'BY',
//                 'continent_code': 'EU',
//                 'zip': '90403',
//                 'lat': 49.4543,
//                 'lon': 11.0746
//             }], ['217.132.175.163', 25565, {
//                 'country': 'Israel',
//                 'city': 'Ramat Gan',
//                 'region': 'TA',
//                 'continent_code': 'AS',
//                 'zip': '',
//                 'lat': 32.0821,
//                 'lon': 34.8122
//             }], ['202.74.239.201', 25565, {
//                 'country': 'Indonesia',
//                 'city': 'Palembang',
//                 'region': 'SS',
//                 'continent_code': 'AS',
//                 'zip': '30961',
//                 'lat': -3.1346,
//                 'lon': 104.6112
//             }], ['196.44.58.174', 25565, {
//                 'country': 'Ivory Coast',
//                 'city': 'Abidjan',
//                 'region': 'AB',
//                 'continent_code': 'AF',
//                 'zip': '',
//                 'lat': 5.31922,
//                 'lon': -4.01514
//             }], ['32.111.167.224', 25565, {
//                 'country': 'United States',
//                 'city': 'Ashburn',
//                 'region': 'VA',
//                 'continent_code': 'NA',
//                 'zip': '20149',
//                 'lat': 39.0438,
//                 'lon': -77.4874
//             }], ['153.90.68.151', 25565, {
//                 'country': 'United States',
//                 'city': 'Bozeman',
//                 'region': 'MT',
//                 'continent_code': 'NA',
//                 'zip': '59715',
//                 'lat': 45.6714,
//                 'lon': -111.0436
//             }], ['45.99.109.196', 25565, {
//                 'country': 'Egypt',
//                 'city': 'New Cairo',
//                 'region': 'C',
//                 'continent_code': 'AF',
//                 'zip': '',
//                 'lat': 30.03,
//                 'lon': 31.47
//             }], ['158.157.103.158', 25565, {
//                 'country': 'United States',
//                 'city': 'Columbus',
//                 'region': 'OH',
//                 'continent_code': 'NA',
//                 'zip': '43218',
//                 'lat': 39.9819,
//                 'lon': -82.9048
//             }], ['72.128.131.178', 25565, {
//                 'country': 'United States',
//                 'city': 'El Paso',
//                 'region': 'TX',
//                 'continent_code': 'NA',
//                 'zip': '79902',
//                 'lat': 31.7769,
//                 'lon': -106.4901
//             }], ['140.85.26.78', 25565, {
//                 'country': 'United States',
//                 'city': 'Chicago',
//                 'region': 'IL',
//                 'continent_code': 'NA',
//                 'zip': '60666',
//                 'lat': 41.8781,
//                 'lon': -87.6298
//             }], ['206.203.228.229', 25565, {
//                 'country': 'United States',
//                 'city': 'Arlington',
//                 'region': 'TX',
//                 'continent_code': 'NA',
//                 'zip': '76013',
//                 'lat': 32.7095,
//                 'lon': -97.1249
//             }], ['21.160.111.22', 25565, {
//                 'country': 'United States',
//                 'city': 'Whitehall',
//                 'region': 'OH',
//                 'continent_code': 'NA',
//                 'zip': '43218',
//                 'lat': 39.9747,
//                 'lon': -82.8947
//             }], ['209.115.37.147', 25565, {
//                 'country': 'United States',
//                 'city': 'Cleveland',
//                 'region': 'OH',
//                 'continent_code': 'NA',
//                 'zip': '44192',
//                 'lat': 41.4993,
//                 'lon': -81.6944
//             }], ['69.206.160.113', 25565, {
//                 'country': 'United States',
//                 'city': 'New York',
//                 'region': 'NY',
//                 'continent_code': 'NA',
//                 'zip': '10016',
//                 'lat': 40.7428,
//                 'lon': -73.9712
//             }], ['220.88.221.242', 25565, {
//                 'country': 'South Korea',
//                 'city': 'Goyang-si',
//                 'region': '41',
//                 'continent_code': 'AS',
//                 'zip': '103',
//                 'lat': 37.6792,
//                 'lon': 126.8183
//             }], ['187.66.22.7', 25565, {
//                 'country': 'Brazil',
//                 'city': 'Itu',
//                 'region': 'SP',
//                 'continent_code': 'SA',
//                 'zip': '13300',
//                 'lat': -23.3025,
//                 'lon': -47.2707
//             }], ['203.10.29.232', 25565, {
//                 'country': 'Australia',
//                 'city': 'Sydney',
//                 'region': 'NSW',
//                 'continent_code': 'OC',
//                 'zip': '1001',
//                 'lat': -33.8671,
//                 'lon': 151.208
//             }], ['77.140.135.201', 25565, {
//                 'country': 'France',
//                 'city': 'Saint-Etienne',
//                 'region': 'ARA',
//                 'continent_code': 'EU',
//                 'zip': '42000',
//                 'lat': 45.4346,
//                 'lon': 4.3958
//             }], ['201.163.23.246', 25565, {
//                 'country': 'Mexico',
//                 'city': 'San Nicolás de los Garza',
//                 'region': 'NLE',
//                 'continent_code': 'NA',
//                 'zip': '66460',
//                 'lat': 25.7601,
//                 'lon': -100.2789
//             }], ['173.65.89.90', 25565, {
//                 'country': 'United States',
//                 'city': 'Ashburn',
//                 'region': 'VA',
//                 'continent_code': 'NA',
//                 'zip': '20147',
//                 'lat': 39.0113,
//                 'lon': -77.4713
//             }], ['189.198.24.192', 25565, {
//                 'country': 'Mexico',
//                 'city': 'Tepic',
//                 'region': 'NAY',
//                 'continent_code': 'NA',
//                 'zip': '63000',
//                 'lat': 21.5042,
//                 'lon': -104.895
//             }], ['212.108.109.228', 25565, {
//                 'country': 'Russia',
//                 'city': 'Moscow',
//                 'region': 'MOW',
//                 'continent_code': 'EU',
//                 'zip': '144700',
//                 'lat': 55.768,
//                 'lon': 37.6234
//             }], ['140.89.25.215', 25565, {
//                 'country': 'United States',
//                 'city': 'Sunnyvale',
//                 'region': 'CA',
//                 'continent_code': 'NA',
//                 'zip': '94089',
//                 'lat': 37.4089,
//                 'lon': -122.018
//             }], ['168.200.43.95', 25565, {
//                 'country': 'United States',
//                 'city': 'Aurora',
//                 'region': 'CO',
//                 'continent_code': 'NA',
//                 'zip': '80045',
//                 'lat': 39.7453,
//                 'lon': -104.838
//             }], ['205.111.11.179', 25565, {
//                 'country': 'United States',
//                 'city': 'Norfolk',
//                 'region': 'VA',
//                 'continent_code': 'NA',
//                 'zip': '23501',
//                 'lat': 36.9159,
//                 'lon': -76.1859
//             }], ['206.87.219.66', 25565, {
//                 'country': 'Canada',
//                 'city': 'Vancouver',
//                 'region': 'BC',
//                 'continent_code': 'NA',
//                 'zip': 'V6T',
//                 'lat': 49.4635,
//                 'lon': -122.822
//             }], ['114.232.10.88', 25565, {
//                 'country': 'China',
//                 'city': 'Nanjing',
//                 'region': 'JS',
//                 'continent_code': 'AS',
//                 'zip': '210000',
//                 'lat': 32.0607,
//                 'lon': 118.763
//             }], ['193.211.234.11', 25565, {
//                 'country': 'Finland',
//                 'city': 'Turku',
//                 'region': '19',
//                 'continent_code': 'EU',
//                 'zip': '',
//                 'lat': 60.4518,
//                 'lon': 22.2666
//             }], ['132.166.44.146', 25565, {
//                 'country': 'France',
//                 'city': 'Carrières-sous-Poissy',
//                 'region': 'IDF',
//                 'continent_code': 'EU',
//                 'zip': '78955',
//                 'lat': 48.9481,
//                 'lon': 2.0457
//             }], ['132.135.80.51', 25565, {
//                 'country': 'United States',
//                 'city': 'Sierra Vista',
//                 'region': 'AZ',
//                 'continent_code': 'NA',
//                 'zip': '85613',
//                 'lat': 31.5552,
//                 'lon': -110.35
//             }], ['176.155.7.162', 25565, {
//                 'country': 'France',
//                 'city': 'Taissy',
//                 'region': 'GES',
//                 'continent_code': 'EU',
//                 'zip': '51500',
//                 'lat': 49.2179,
//                 'lon': 4.0915
//             }], ['143.222.72.118', 25565, {
//                 'country': 'United States',
//                 'city': 'Columbus',
//                 'region': 'IN',
//                 'continent_code': 'NA',
//                 'zip': '47201',
//                 'lat': 39.2038,
//                 'lon': -85.9229
//             }], ['22.35.126.17', 25565, {
//                 'country': 'United States',
//                 'city': 'Columbus',
//                 'region': 'OH',
//                 'continent_code': 'NA',
//                 'zip': '43218',
//                 'lat': 39.9819,
//                 'lon': -82.9048
//             }], ['138.110.213.221', 25565, {
//                 'country': 'United States',
//                 'city': 'South Hadley',
//                 'region': 'MA',
//                 'continent_code': 'NA',
//                 'zip': '01075',
//                 'lat': 42.2584,
//                 'lon': -72.5745
//             }], ['7.114.221.205', 25565, {
//                 'country': 'United States',
//                 'city': 'Whitehall',
//                 'region': 'OH',
//                 'continent_code': 'NA',
//                 'zip': '43218',
//                 'lat': 39.9747,
//                 'lon': -82.8947
//             }], ['35.187.168.88', 25565, {
//                 'country': 'Belgium',
//                 'city': 'Brussels',
//                 'region': 'BRU',
//                 'continent_code': 'EU',
//                 'zip': '1930',
//                 'lat': 50.9009,
//                 'lon': 4.4855
//             }], ['44.197.238.26', 25565, {
//                 'country': 'United States',
//                 'city': 'Ashburn',
//                 'region': 'VA',
//                 'continent_code': 'NA',
//                 'zip': '20149',
//                 'lat': 39.0438,
//                 'lon': -77.4874
//             }], ['193.15.29.153', 25565, {
//                 'country': 'Sweden',
//                 'city': 'Johanneshov',
//                 'region': 'AB',
//                 'continent_code': 'EU',
//                 'zip': '121 53',
//                 'lat': 59.3333,
//                 'lon': 18.05
//             }], ['56.7.74.234', 25565, {
//                 'country': 'United States',
//                 'city': 'Raleigh',
//                 'region': 'NC',
//                 'continent_code': 'NA',
//                 'zip': '27668',
//                 'lat': 35.838,
//                 'lon': -78.6122
//             }], ['107.158.42.177', 25565, {
//                 'country': 'United States',
//                 'city': 'Dallas',
//                 'region': 'TX',
//                 'continent_code': 'NA',
//                 'zip': '75270',
//                 'lat': 32.7767,
//                 'lon': -96.797
//             }], ['158.57.61.197', 25565, {
//                 'country': 'United States',
//                 'city': 'New York',
//                 'region': 'NY',
//                 'continent_code': 'NA',
//                 'zip': '10003',
//                 'lat': 40.7341,
//                 'lon': -73.988
//             }], ['22.192.31.244', 25565, {
//                 'country': 'United States',
//                 'city': 'Columbus',
//                 'region': 'OH',
//                 'continent_code': 'NA',
//                 'zip': '43218',
//                 'lat': 39.9819,
//                 'lon': -82.9048
//             }], ['186.82.248.42', 25565, {
//                 'country': 'Colombia',
//                 'city': 'Bogotá',
//                 'region': 'DC',
//                 'continent_code': 'SA',
//                 'zip': '110931',
//                 'lat': 4.6544,
//                 'lon': -74.1187
//             }]]
//         }
//     }
// )
//
// // console.log(realTimeModel.connectionsData);
//
// // console.log(realTimeModel.getNumberOfConnectionsInContinent("SE000000000002", "NA"))
// // console.log(realTimeModel.getNumberOfConnectionsInContinent("SE000000000001", "EU"))
// console.log(realTimeModel.getTopGamesOfMomentInContinent("SE000000000001", "SA"))