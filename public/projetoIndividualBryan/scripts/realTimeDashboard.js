import { insertElement, initKpi, observeElementAtributteChange } from "./functions.js";
import MapBox from "./classes/MapBox.js";
import "https://cdn.jsdelivr.net/npm/apexcharts"

const map = new MapBox("map");

window.onload = renderRealTimeDashboard;


async function renderRealTimeDashboard () {
    let kpis = loadKpis();

    let chart1 = await loadTopGamesChart();
    let chart2 = await loadTopContinentsChart();
    let chart3 = await loadConnectionsVariationChart();

    // Reload dashboard on filter change;

    const continentFilter = document.getElementById("continent-filter");

    const filters = {
        continent: null,
        game: null
    }

    observeElementAtributteChange(continentFilter, async (filter) => {
        kpis.kpi01.stop();
        kpis.kpi01.destroy();

        kpis.kpi02.stop();
        kpis.kpi02.destroy();

        kpis.kpi03.stop();
        kpis.kpi03.destroy();

        filters.continent = filter;

        kpis = loadKpis(filters);

        chart1.stop();
        chart3.stop();


        chart1 = await loadTopGamesChart(filters);
        chart3 = await loadConnectionsVariationChart(filters);

    });
}

function loadKpis(filters) {
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

    const kpi03 = insertElement(kpisDiv,"kpi-card", {
        "icon-name": "bi-controller",
        "kpi-title": "Jogo mais jogado no momento",
        value: 0,
        hint: "Jogo mais jogado no mundo.",
        id: "kpi01"
    }, ["w-1/3"]);

    const kpi01Init = initKpi(kpi01, getQuantPlayers, filters);
    const kpi02Init = initKpi(kpi02, getQuantServersActive, filters);
    const kpi03Init = initKpi(kpi03, getTopGame, filters);

    return {
        kpi01: {
            stop: () =>  kpi01Init.stopKpi(),
            destroy: () => kpi01.remove()
        },
        kpi02: {
            stop: () =>  kpi02Init.stopKpi(),
            destroy: () => kpi02.remove(),
        },
        kpi03: {
            stop: () => kpi03Init.stopKpi(),
            destroy: () => kpi03.remove(),
        },
    }
}

async function getQuantPlayers(filters) {
    let url = `/bi/dashboard/real-time/quantity-connections/${sessionStorage.REGISTRATION_NUMBER}`;

    if(filters && filters.hasOwnProperty("continent")) {
        url = `/bi/dashboard/real-time/quantity-connections/${sessionStorage.REGISTRATION_NUMBER}?continent=${filters.continent}`;
    }

    const request = await fetch(url);
    const json = await request.json();


    if(json.quantConnections.hasOwnProperty("totalConnections")) {
        if(json.quantConnections.warning) {
            document.getElementById("warning").classList.remove("invisible");
        } else {
            document.getElementById("warning").classList.add("invisible");
        }

        return json.quantConnections.totalConnections;
    }

    document.getElementById("warning").classList.add("invisible");

    return json.quantConnections;
}

async function getQuantServersActive(filters) {
    let url = `/bi/dashboard/real-time/quantity-active-servers/${sessionStorage.REGISTRATION_NUMBER}`;

    if(filters && filters.hasOwnProperty("continent")) {
        url = `/bi/dashboard/real-time/quantity-active-servers/${sessionStorage.REGISTRATION_NUMBER}?continent=${filters.continent}`;
    }

    const request = await fetch(url);
    const json = await request.json();

    return json.quantActiveServers;
}

async function getTopGame(filters) {
    let url = `/bi/dashboard/real-time/top-games/${sessionStorage.REGISTRATION_NUMBER}`;

    if(filters && filters.hasOwnProperty("continent")) {
        url = `/bi/dashboard/real-time/top-games/${sessionStorage.REGISTRATION_NUMBER}?continent=${filters.continent}`;
    }

    const request = await fetch(url);
    const json = await request.json();

    if(json.topGames.length > 0){
        return json.topGames[0][0];
    }

    return "N/A";
}


async function loadTopGamesChart(filters) {
    const chartdiv = document.getElementById("chart1");

    let options = {
        series: [{
            name: "Quantidade de jogadores",
            data: await getAllTopGames(filters),
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

    const interval = setInterval(async () => {
        chart.updateSeries([{
            data: await getAllTopGames(filters),
        }]);
    }, 2000);

    return {
        stop: () => {
            clearInterval(interval);
            chart.destroy();
        }
    }
}


async function getAllTopGames(filters) {
    let url = `/bi/dashboard/real-time/top-games/${sessionStorage.REGISTRATION_NUMBER}`;

    if(filters && filters.hasOwnProperty("continent")) {
        url = `/bi/dashboard/real-time/top-games/${sessionStorage.REGISTRATION_NUMBER}?continent=${filters.continent}`;
    }

    const request = await fetch(url);
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

async function loadConnectionsVariationChart(filters) {
    const chartdiv = document.getElementById("chart3");

    let options = {
        series: [{
            name: "Quantidade de jogadores",
            data: [],
        }],
        chart: {
            type: 'line',
            height: '90%',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 1000
                }
            },
            zoom: {
                enabled: true
            },
            dropShadow: {
                enabled: true,
                top: 2,
                left: 0,
                blur: 3,
                opacity: 0.5
            }
        },
        stroke: {
            curve: 'smooth'
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
            },
        },
        xaxis: {
            type: "datetime",
            labels: {
                style: {
                    colors: ["#56408C"],
                    fontSize: '14px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 600,
                },
            },
            datetimeFormatter: {
                hour: "HH:mm:ss"
            },
            datetimeUTC: false,
            range: 10000
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
            colors: ['#56408C']
        },

    };

    let chart = new ApexCharts(chartdiv, options);
    chart.render();

    const data = [];

    const interval = setInterval(async () => {
        const y = await getQuantPlayers(filters);
        let x = new Date();
        x.setHours(x.getHours() - 3);
        x = x.getTime();

        data.push({ x, y });

        chart.updateSeries([{
            name: "Quantidade de jogadores",
            data: data
        }]);
    }, 2000);

    return {
        stop: () => {
            clearInterval(interval);
            chart.destroy();
        }
    }
}

