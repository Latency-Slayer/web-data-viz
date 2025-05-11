import "https://cdn.jsdelivr.net/npm/chart.js"

class ChartWrapper {
    #chart;
    #maxData;

    constructor(container, options) {
        this.#chart = new Chart(container, options);
        this.maxData = Infinity;
    }

     setMaxData(maxData) {
        this.#maxData = maxData;
    }

    addNewData(label, value) {
        const dataSet = this.#chart.data.datasets[0];

        this.#chart.data.labels.push(label);
        dataSet.data.push(value);

        this.#chart.update();

        return this;
    }

    removeOldestData() {
        if(this.#chart.data.datasets[0].data.length > this.#maxData) {
            this.#chart.data.labels.shift();
            this.#chart.data.datasets[0].data.shift();
        }

        this.#chart.update();

        return this;
    }
}

export default ChartWrapper;