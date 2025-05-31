const database = require("../../database/config.js");

class AnaliticConnectionModel {
    async getRecurringConnections(continent, period) {
        const date = new Date();
        date.setDate(date.getDate() - period);

        const startMonth = date.getMonth() + 1;
        const endMonth = new Date().getMonth();

        const result = database.executar("SELECT * from connection_capturing");
    }
}