const database = require("../../database/config.js");

class AnaliticConnectionModel {
    async getDailyAverageConnectionsInPeriod(companyRegisterNumber, continent, period) {
        return await this.getConnectionsVariation(companyRegisterNumber, continent, period);
    }

    async getPeakOfSimultaneousConnections (companyRegisterNumber, continent, period) {
        const date = new Date();
        date.setDate(date.getDate() - period);

        const startMonth = date.getMonth();
        const endMonth = new Date().getMonth() + 1;

        if (continent) {
            return database.executar(`SELECT
                                          DATE_FORMAT(date_time, '%Y-%m-%d %H:00:00') AS horario,
                                          COUNT(*) AS total_conexoes
                                      FROM
                                          connection_capturing
                                              JOIN server ON id_server = fk_server
                                              JOIN company ON id_company = fk_company
                                      WHERE
                                          company.registration_number = ?
                                        AND (MONTH(connection_capturing.date_time) >= ? AND
                                             MONTH(connection_capturing.date_time) <= ?) AND
                                          connection_capturing.continent_code = ?
                                      GROUP BY horario
                                      ORDER BY total_conexoes DESC
                                      LIMIT 1;
            `, [companyRegisterNumber, startMonth, endMonth, continent]);
        }

        return database.executar(`SELECT DATE_FORMAT(date_time, '%Y-%m-%d %H:00:00') AS horario,
                                         COUNT(*)                                    AS total_conexoes
                                  FROM connection_capturing
                                           JOIN server ON id_server = fk_server
                                           JOIN company ON id_company = fk_company
                                  WHERE company.registration_number = ?
                                    AND (MONTH(connection_capturing.date_time) >= ? AND
                                         MONTH(connection_capturing.date_time) <= ?)
                                  GROUP BY horario
                                  ORDER BY total_conexoes DESC
                                  LIMIT 1;
        `, [companyRegisterNumber, startMonth, endMonth]);
    }

    async getTopGameOfPeriod (companyRegisterNumber, continent, period) {
        const date = new Date();
        date.setDate(date.getDate() - period);

        const startMonth = date.getMonth();
        const endMonth = new Date().getMonth() + 1;

        if(continent) {
            return await database.executar(`
                SELECT game, COUNT(*) AS total_connections
                FROM
                    connection_capturing
                        JOIN server ON id_server = fk_server
                        JOIN company ON company.id_company = server.fk_company
                WHERE
                    company.registration_number = ?
                  AND (MONTH(connection_capturing.date_time) >= ? AND
                       MONTH(connection_capturing.date_time) <= ?) AND
                    connection_capturing.continent_code = ?
                GROUP BY
                    game
                ORDER BY COUNT(*) DESC
                LIMIT 1;
            `, [companyRegisterNumber, startMonth, endMonth, continent]);
        }

        return database.executar(`
            SELECT game, COUNT(*) AS total_connections
            FROM connection_capturing
                     JOIN server ON id_server = fk_server
                     JOIN company ON company.id_company = server.fk_company
            WHERE company.registration_number = ?
              AND (MONTH(connection_capturing.date_time) >= ? AND
                   MONTH(connection_capturing.date_time) <= ?)
            GROUP BY game
            ORDER BY COUNT(*) DESC
            LIMIT 1;
        `, [companyRegisterNumber, startMonth, endMonth]);
    }

    async getAllTopGamesOfPeriod(companyRegisterNumber, continent, period) {
        const date = new Date();
        date.setDate(date.getDate() - period);

        const startMonth = date.getMonth();
        const endMonth = new Date().getMonth() + 1;

        if(continent) {
            return await database.executar(`
                SELECT game, COUNT(*) AS total_connections
                FROM
                    connection_capturing
                        JOIN server ON id_server = fk_server
                        JOIN company ON company.id_company = server.fk_company
                WHERE
                    company.registration_number = ?
                  AND (MONTH(connection_capturing.date_time) >= ? AND
                       MONTH(connection_capturing.date_time) <= ?) AND
                    connection_capturing.continent_code = ?
                GROUP BY
                    game
                ORDER BY COUNT(*) DESC
            `, [companyRegisterNumber, startMonth, endMonth, continent]);
        }

        return database.executar(`
            SELECT game, COUNT(*) AS total_connections
            FROM connection_capturing
                     JOIN server ON id_server = fk_server
                     JOIN company ON company.id_company = server.fk_company
            WHERE company.registration_number = ?
              AND (MONTH(connection_capturing.date_time) >= ? AND
                   MONTH(connection_capturing.date_time) <= ?)
            GROUP BY game
            ORDER BY COUNT(*) DESC
        `, [companyRegisterNumber, startMonth, endMonth]);
    }

    async getTopContinentsOfPeriod(companyRegisterNumber, continent, period) {
        const date = new Date();
        date.setDate(date.getDate() - period);

        const startMonth = date.getMonth();
        const endMonth = new Date().getMonth() + 1;

        if(continent) {
            return database.executar(`
            SELECT country AS continent, COUNT(*) AS total_connections
            FROM connection_capturing
                     JOIN server ON id_server = fk_server
                     JOIN company ON company.id_company = server.fk_company
            WHERE company.registration_number = ?
              AND (MONTH(connection_capturing.date_time) >= ? AND
                   MONTH(connection_capturing.date_time) <= ?) AND
                connection_capturing.continent_code = ?
            GROUP BY country
            ORDER BY COUNT(*) DESC
        `, [companyRegisterNumber, startMonth, endMonth, continent]);
        }

        return database.executar(`
            SELECT continent_code AS continent, COUNT(*) AS total_connections
            FROM connection_capturing
                     JOIN server ON id_server = fk_server
                     JOIN company ON company.id_company = server.fk_company
            WHERE company.registration_number = ?
              AND (MONTH(connection_capturing.date_time) >= ? AND
                   MONTH(connection_capturing.date_time) <= ?)
            GROUP BY continent_code
            ORDER BY COUNT(*) DESC
        `, [companyRegisterNumber, startMonth, endMonth]);
    }


    async getConnectionsVariation(companyRegisterNumber, continent, period) {
        const date = new Date();
        date.setDate(date.getDate() - period);

        const startMonth = date.getMonth();
        const endMonth = new Date().getMonth() + 1;

        if(continent) {
            return database.executar(`
                SELECT COUNT(*) AS total_connections, DATE_FORMAT(date_time, '%Y-%m-%d') AS date
                FROM connection_capturing
                         JOIN server ON id_server = fk_server
                         JOIN company ON company.id_company = server.fk_company
                WHERE company.registration_number = ?
                  AND (MONTH(connection_capturing.date_time) >= ? AND
                       MONTH(connection_capturing.date_time) <= ?) AND
                    connection_capturing.continent_code = ?
                GROUP BY DATE_FORMAT(date_time, '%Y-%m-%d')
                ORDER BY DATE_FORMAT(date_time, '%Y-%m-%d')
            `, [companyRegisterNumber, startMonth, endMonth, continent]);
        }

        return database.executar(`
                SELECT COUNT(*) AS total_connections, DATE_FORMAT(date_time, '%Y-%m-%d') AS date
                FROM connection_capturing
                         JOIN server ON id_server = fk_server
                         JOIN company ON company.id_company = server.fk_company
                WHERE company.registration_number = ?
                  AND (MONTH(connection_capturing.date_time) >= ? AND
                       MONTH(connection_capturing.date_time) <= ?)
                GROUP BY DATE_FORMAT(date_time, '%Y-%m-%d')
                ORDER BY DATE_FORMAT(date_time, '%Y-%m-%d')
            `, [companyRegisterNumber, startMonth, endMonth]);
    }

    async getConnectionLocations(companyRegisterNumber, continent, period) {
        const date = new Date();
        date.setDate(date.getDate() - period);

        const startMonth = date.getMonth();
        const endMonth = new Date().getMonth() + 1;

        if(continent) {
            return database.executar(`
                SELECT latitude AS lat, longitude AS lon
                FROM connection_capturing
                         JOIN server ON id_server = fk_server
                         JOIN company ON company.id_company = server.fk_company
                WHERE company.registration_number = ?
                  AND (MONTH(connection_capturing.date_time) >= ? AND
                       MONTH(connection_capturing.date_time) <= ?) AND
                    connection_capturing.continent_code = ?
                ORDER BY DATE_FORMAT(date_time, '%Y-%m-%d')
            `, [companyRegisterNumber, startMonth, endMonth, continent]);
        }

        return database.executar(`
            SELECT latitude AS lat, longitude AS lon
            FROM connection_capturing
                     JOIN server ON id_server = fk_server
                     JOIN company ON company.id_company = server.fk_company
            WHERE company.registration_number = ?
              AND (MONTH(connection_capturing.date_time) >= ? AND
                   MONTH(connection_capturing.date_time) <= ?)
            ORDER BY DATE_FORMAT(date_time, '%Y-%m-%d');
            `, [companyRegisterNumber, startMonth, endMonth]);
    }

    async getGameVariationOnPeriod(companyRegisterNumber, continent, period) {
        const date = new Date();
        date.setDate(date.getDate() - period);

        const startMonth = date.getMonth();
        const endMonth = new Date().getMonth() + 1;


        if(continent) {
            return database.executar(`
                SELECT game, COUNT(*) AS total_connections, DATE_FORMAT(date_time, '%Y-%m-%d') AS date
                FROM connection_capturing
                         JOIN server ON id_server = fk_server
                         JOIN company ON company.id_company = server.fk_company
                WHERE company.registration_number = '00000000000000'
                  AND (MONTH(connection_capturing.date_time) >= ? AND
                       MONTH(connection_capturing.date_time) <= ?) AND
                    connection_capturing.continent_code = ?
                GROUP BY DATE_FORMAT(date_time, '%Y-%m-%d'), game
                ORDER BY DATE_FORMAT(date_time, '%Y-%m-%d');
            `, [companyRegisterNumber, startMonth, endMonth, continent]);
        }

        return database.executar(`
            SELECT game, COUNT(*) AS total_connections, DATE_FORMAT(date_time, '%Y-%m-%d') AS date
            FROM connection_capturing
                     JOIN server ON id_server = fk_server
                     JOIN company ON company.id_company = server.fk_company
            WHERE company.registration_number = ?
              AND (MONTH(connection_capturing.date_time) >= ? AND
                   MONTH(connection_capturing.date_time) <= ?)
            GROUP BY DATE_FORMAT(date_time, '%Y-%m-%d'), game
            ORDER BY DATE_FORMAT(date_time, '%Y-%m-%d');
            `, [companyRegisterNumber, startMonth, endMonth]);
    }

}

module.exports = AnaliticConnectionModel;
