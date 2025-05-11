import MapBox from "./classes/MapBox.js";
import Chart from "./classes/Chart.js";


const mapBox = new MapBox("map");


const chart = new Chart(document.getElementById("chart1"), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: '# of Votes',
            data: [],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

chart.setMaxData(10);

let cont = 0;

setInterval(() => {
    cont++;

    chart.addNewData(cont, Math.ceil(Math.random() *  100)).removeOldestData();


}, 1000);