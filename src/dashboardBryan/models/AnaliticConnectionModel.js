const database = require("../../database/config.js");

class AnaliticConnectionModel {
    async getDailyAverageConnectionsInPeriod(companyRegisterNumber, continent, period) {
        const date = new Date();
        date.setDate(date.getDate() - period);

        const startMonth = date.getMonth() + 1;
        const endMonth = new Date().getMonth();

        const result = await database.executar(`SELECT
                DATE_FORMAT(date_time, '%Y-%m') AS mes,
                ROUND(COUNT(*) / COUNT(DISTINCT day (date_time)), 0) AS media_mensal
            FROM
                connection_capturing
            JOIN server ON id_server = fk_server
            JOIN company ON id_company = fk_company
            WHERE company.registration_number = ? AND (MONTH(connection_capturing.date_time) >= ? AND MONTH(connection_capturing.date_time) <= ?)
            GROUP BY
                DATE_FORMAT(date_time, '%Y-%m')
            ORDER BY
                mes 
        `, [companyRegisterNumber, startMonth, endMonth]);

        return result;
    }
}


module.exports = AnaliticConnectionModel;
