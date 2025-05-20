import { insertElement, initKpi } from "./functions.js";
import MapBox from "./classes/MapBox.js";
import "https://cdn.jsdelivr.net/npm/apexcharts"

const map = new MapBox("map");

window.onload = renderRealTimeDashboard;


async function renderRealTimeDashboard () {
    const kpis = loadKpis();

    const chart1 = await loadTopGamesChart();
    const chart2 = await loadTopContinentsChart();
    const chart3 = await loadConnectionsVarianceChart();
}


function loadKpis() {
    const kpisDiv = document.getElementById("kpisDiv");

    const kpi01 = insertElement(kpisDiv,"kpi-card", {
        "icon-name": "bi-wifi",
        "kpi-title": "Quantidade de conexões",
        value: 0,
        hint: "Soma de todos os jogadores conectados em todos os servidores ao redor de mundo.",
        id: "kpi01"
    }, ["w-1/3"]);

    const kpi02 = insertElement(kpisDiv,"kpi-card", {
        "icon-name": "bi-hdd-stack",
        "kpi-title": "Total de servidores ativos",
        value: 0,
        hint: "Total de servidores ativos globalmente.",
        id: "kpi01"
    }, ["w-1/3"]);

    const kpis03 = insertElement(kpisDiv,"kpi-card", {
        "icon-name": "bi-controller",
        "kpi-title": "Jogo mais jogado no momento",
        value: 0,
        hint: "Jogo mais jogado no mundo.",
        id: "kpi01"
    }, ["w-1/3"]);

    const kpi01Init = initKpi(kpi01, getQuantPlayers);
    const kpi02Init = initKpi(kpi02, getQuantServersActive);
    const kpi03Init = initKpi(kpis03, getTopGame);

    return {
        kpi01: kpi01Init,
        kpi02: kpi02Init,
        kpi03: kpi03Init,
    }
}

async function getQuantPlayers() {
    const request = await fetch(`/bi/dashboard/real-time/quantity-connections/${sessionStorage.REGISTRATION_NUMBER}`);
    const json = await request.json();

    return json.quantConnections;
}

async function getQuantServersActive() {
    const request = await fetch(`/bi/dashboard/real-time/quantity-active-servers/${sessionStorage.REGISTRATION_NUMBER}`);
    const json = await request.json();

    return json.quantActiveServers;
}

async function getTopGame() {
    const request = await fetch(`/bi/dashboard/real-time/top-games/${sessionStorage.REGISTRATION_NUMBER}`);
    const json = await request.json();

    if(json.topGames.length > 0){
        return json.topGames[0][0];
    }

    return "N/A"
}


async function loadTopGamesChart() {
    const chartdiv = document.getElementById("chart1");

    let options = {
        series: [{
            name: "Quantidade de jogadores",
            data: await getAllTopGames(),
        }],
        chart: {
            type: 'bar',
            height: '90%',
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
            },
        },
        xaxis: {
            labels: {
                style: {
                    colors: ["#56408C"],
                    fontSize: '14px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 600,

                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: ["#56408C"],
                    fontSize: '14px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 400
                },
                formatter: (val) => {
                    return Intl.NumberFormat("en-US").format(val);
                }
            }
        },
        fill: {
            colors: ['#B69CF6']
        },

    };

    let chart = new ApexCharts(chartdiv, options);
    chart.render();

    return setInterval(async () => {
        chart.updateSeries([{
            data: await getAllTopGames(),
        }]);
    }, 2000);
}


async function getAllTopGames() {
    const request = await fetch(`/bi/dashboard/real-time/top-games/${sessionStorage.REGISTRATION_NUMBER}`);
    const json = await request.json();

    if(json.topGames.length > 0){
        return json.topGames.map((data) => {
            return {
                x: data[0],
                y: data[1]
            }
        });
    }

    return [{
        x: "Nenhum jogo sendo executado no momento",
        y: 0
    }];
}









async function loadTopContinentsChart() {
    const chartdiv = document.getElementById("chart2");

    let options = {
        series: [{
            name: "Quantidade de jogadores",
            data: await getTopContinents(),
        }],
        chart: {
            type: 'bar',
            height: '90%',
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
            },
        },
        xaxis: {
            labels: {
                style: {
                    colors: ["#56408C"],
                    fontSize: '14px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 600,

                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: ["#56408C"],
                    fontSize: '14px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 400
                },
                formatter: (val) => {
                    return Intl.NumberFormat("en-US").format(val);
                }
            }
        },
        fill: {
            colors: ['#B69CF6']
        },

    };

    let chart = new ApexCharts(chartdiv, options);
    chart.render();

    return setInterval(async () => {
        chart.updateSeries([{
            data: await getTopContinents(),
        }]);
    }, 2000);
}



async function getTopContinents() {
    const request = await fetch(`/bi/dashboard/real-time/top-continents/${sessionStorage.REGISTRATION_NUMBER}`);
    const json = await request.json();

    const continents = {
        SA: "América do Sul",
        NA: "América do Norte",
        AF: "África",
        EU: "Europa",
        OC: "Oceânia",
        AN: "Antártida",
        AS: "Ásia"
    }

    if(json.topContinents.length > 0){
        return json.topContinents.map((data) => {

            return {
                x: continents[data[0]],
                y: data[1]
            }
        });
    }

    return [{
        x: "Nenhum jogo sendo executado no momento",
        y: 0
    }];
}



async function loadConnectionsVarianceChart() {
    const chartdiv = document.getElementById("chart3");

    let options = {
        series: [{
            name: "Quantidade de jogadores",
            data: [1, 2, 3, 4, 5, 6, 7, 8, 90, 10],
        }],
        chart: {
            type: 'line',
            height: '90%',
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
            },
        },
        xaxis: {
            labels: {
                style: {
                    colors: ["#56408C"],
                    fontSize: '14px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 600,

                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: ["#56408C"],
                    fontSize: '14px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 400
                },
                formatter: (val) => {
                    return Intl.NumberFormat("en-US").format(val);
                }
            }
        },
        fill: {
            colors: ['#B69CF6']
        },

    };

    let chart = new ApexCharts(chartdiv, options);
    chart.render();

    // return setInterval(async () => {
    //     chart.updateSeries([{
    //         data: await getTopContinents(),
    //     }]);
    // }, 2000);
}

