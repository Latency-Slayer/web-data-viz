import {
    continentName,
    executeNowAndRepeatWithInterval,
    initKpi,
    insertElement,
    loader,
    observeElementAttributeChange
} from "./functions.js";
import MapBox from "./classes/MapBox.js";
import "https://cdn.jsdelivr.net/npm/apexcharts"

const map = new MapBox("map");

map.onload(() => {
    map.loadClusters();

    executeNowAndRepeatWithInterval(async () => {
        const playerLocations = await fetch(`/bi/dashboard/real-time/player-locations/${sessionStorage.REGISTRATION_NUMBER}`)
        const json = await playerLocations.json();

        map.loadData(json.playerLocations);
        map.updateMapPoints();
    }, 2000);
});

window.onload = renderDashboard;

const filters = {
    continent: null,
    period: null
}

let kpis;
let chart1;
let chart2;
let chart3;

function destroyDashboard() {
    kpis.kpi01.destroy();
    kpis.kpi02.destroy();
    kpis.kpi03.destroy();

    chart1.destroy();
    chart2.destroy();
    chart3.destroy();
}


observeElementAttributeChange(document.getElementById("continent-filter"), async (filter) => {
    filters.continent = filter;

    destroyDashboard();
    await renderDashboard();
});

observeElementAttributeChange(document.getElementById("period-filter"), async (filter) => {
    filters.period = filter;

    destroyDashboard();
    await renderDashboard();
});


async function renderDashboard () {
    const initLoader = loader();

    kpis = loadKpis();

    chart1 = await loadTopGamesChart();
    chart2 = await loadTopContinentsChart();
    chart3 = await loadConnectionsVariationChart();

    if(filters.period) {
        setTimeout(() => initLoader.remove(), 3000);
    } else {
        initLoader.remove();
    }
}

function loadKpis() {
    const kpisDiv = document.getElementById("kpisDiv");

    let hints = {
        kpi1Hint: "Soma de todos os jogadores conectados em todos os servidores ao redor de mundo.",
        kpi2Hint: "Total de servidores ativos globalmente.",
        kpi3Hint: "Jogo mais jogado globalmente."
    };

    if(filters.continent && !filters.period) {
        hints = {
            kpi1Hint: "Quantidade de conexões no continente filtrado.",
            kpi2Hint: "Total de servidores ativos no continente filtrado. É possível ter jogadores ativos no " +
                "continente, mas não necessáriamente ter um servidor ativo. Nesse caso significa que os jogadores estão " +
                "jogando em servidores localizados em outros continentes.",
            kpi3Hint: "Jogo mais jogado no continente filtrado.",
        }
    } else

    if(filters.continent && filters.period) {
        hints = {
            kpi1Hint: "Quantidade de conexões no continente filtrado e no período selecionado.",
            kpi2Hint: "Pico de conexões simultâneas.",
            kpi3Hint: "Jogo mais jogado no continente filtrado e no periodo filtrado.",
        }
    } else

    if(!filters.continent && filters.period) {
        hints = {
            kpi1Hint: "Média de conexões no período selecionado. (Total de conexões no periodo dividido pela quantidade de dias).",
            kpi2Hint: "Pico de conexões simultâneas no período selecionado.",
            kpi3Hint: "Jogo mais jogado no periodo filtrado."
        }
    }

    const kpi01 = insertElement(kpisDiv,"kpi-card", {
        "icon-name": "bi-wifi",
        "kpi-title": !filters.period ? "Quantidade de conexões" : "Quantidade diária média de conexões",
        value: 0,
        hint: hints.kpi1Hint,
        id: "kpi01"
    }, ["w-1/3"]);

    const kpi02 = insertElement(kpisDiv,"kpi-card", {
        "icon-name": "bi-hdd-stack",
        "kpi-title": !filters.period ? "Quantidade de servidores ativos" : "Pico de conexões simultâneas",
        value: 0,
        hint: hints.kpi2Hint,
        id: "kpi02"
    }, ["w-1/3"]);

    const kpi03 = insertElement(kpisDiv,"kpi-card", {
        "icon-name": "bi-controller",
        "kpi-title": !filters.period ? "Jogo mais acessado no momento" : "Jogo mais acessado durante o periodo selecionado",
        value: 0,
        hint: hints.kpi3Hint,
        id: "kpi03"
    }, ["w-1/3"]);

    const kpi01Init = initKpi(kpi01, getQuantPlayers);
    const kpi02Init = initKpi(kpi02, !filters.period ? getQuantServersActive : getPeakOfConnections);
    const kpi03Init = initKpi(kpi03, !filters.period ? getTopGame : getTopGameOfPeriod);

    return {
        kpi01: {
            destroy: () => {
                kpi01Init.stopKpi();
                kpi01.remove();
            }
        },
        kpi02: {
            destroy: () => {
                kpi02Init.stopKpi();
                kpi02.remove();
            },
        },
        kpi03: {
            destroy: () => {
                kpi03Init.stopKpi();
                kpi03.remove();
            },
        },
    }
}

async function getQuantPlayers() {
    let url = `/bi/dashboard/real-time/quantity-connections/${sessionStorage.REGISTRATION_NUMBER}`;

    if(filters.continent && !filters.period) {
        url = `/bi/dashboard/real-time/quantity-connections/${sessionStorage.REGISTRATION_NUMBER}?continent=${filters.continent}`;
    }
    else if(!filters.continent && filters.period) {
            url =`/bi/dashboard/analitic/daily-avarage-connections/${sessionStorage.REGISTRATION_NUMBER}/${filters.period}`;
            const request = await fetch(url);
            const json = await request.json();

            return json.avarage;
    }
    else if(filters.continent && filters.period) {
        url =`/bi/dashboard/analitic/daily-avarage-connections/${sessionStorage.REGISTRATION_NUMBER}/${filters.period}?continent=${filters.continent}`;
        const request = await fetch(url);
        const json = await request.json();

        return json.avarage;
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

async function getQuantServersActive() {
    let url = `/bi/dashboard/real-time/quantity-active-servers/${sessionStorage.REGISTRATION_NUMBER}`;

    if(filters.continent && !filters.period) {
        url = `/bi/dashboard/real-time/quantity-active-servers/${sessionStorage.REGISTRATION_NUMBER}?continent=${filters.continent}`;
    }

    const request = await fetch(url);
    const json = await request.json();

    return json.quantActiveServers;
}

async function getTopGame() {
    let url = `/bi/dashboard/real-time/top-games/${sessionStorage.REGISTRATION_NUMBER}`;

    if(filters.continent && !filters.period) {
        url = `/bi/dashboard/real-time/top-games/${sessionStorage.REGISTRATION_NUMBER}?continent=${filters.continent}`;
    }

    const request = await fetch(url);
    const json = await request.json();

    if(json.topGames.length > 0){
        return json.topGames[0][0];
    }

    return "N/A";
}


async function loadTopGamesChart() {
    const chartdiv = document.getElementById("chart1");
    let title = `Jogos mais acessados no momento (${continentName(filters.continent) || "Global"})`

    if(filters.period) {
        title = `Jogos mais acessados nos últimos ${filters.period} dias`;
    }

    document.getElementById("title-chart1").innerHTML = title;

    let options = {
        series: [{
            name: "Quantidade de conexões",
            data: !filters.period ? await getAllTopGames() : await getAllTopGamesOfPeriod(),
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

    if(filters.period) {
        return {
            destroy: () => {
                chart.destroy();
            }
        };
    }

    const interval = setInterval(async () => {
        chart.updateSeries([{
            data: !filters.period ? await getAllTopGames() : await getAllTopGamesOfPeriod(),
        }]);
    }, 2000);

    return {
        destroy: () => {
            clearInterval(interval);
            chart.destroy();
        }
    }
}


async function getAllTopGames() {
    let url = `/bi/dashboard/real-time/top-games/${sessionStorage.REGISTRATION_NUMBER}`;

    if(filters.continent && !filters.period) {
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
    let title = "Continentes com mais jogadores no momento";

    if(filters.continent && !filters.period) {
        title = "Países com mais jogadores no momento";
    }

    else if(!filters.continent && filters.period) {
        title = `Continentes com mais conexões nos últimos ${filters.period} dias)`;
    }

    document.getElementById("title-chart2").innerHTML = title;

    let func = getTopContinents;

    if(filters.continent && !filters.period) {
        func = getTopCountries;
    }

    if (filters.period) {
        func = getTopContinentsOfPeriod
    }


    let options = {
        series: [{
            name: "Quantidade de jogadores",
            data: await func(),
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

    if(filters.period) {
        return {
            destroy: () => {
                chart.destroy();
            }
        };
    }

    const interval = setInterval(async () => {
        chart.updateSeries([{
            data: await func(),
        }]);
    }, 2000)

    return {
        destroy: () => {
            clearInterval(interval);
            chart.destroy();
        }
    };
}

async function getTopContinents() {
    const request = await fetch(`/bi/dashboard/real-time/top-continents/${sessionStorage.REGISTRATION_NUMBER}`);
    const json = await request.json();

    if(json.topContinents.length > 0){
        return json.topContinents.map((data) => {

            return {
                x: continentName(data[0]),
                y: data[1]
            }
        });
    }

    return [{
        x: "Nenhum jogo sendo executado no momento",
        y: 0
    }];
}

async function getTopCountries() {
    const request = await fetch(`/bi/dashboard/real-time/top-countries/${sessionStorage.REGISTRATION_NUMBER}?continent=${filters.continent}`);
    const json = await request.json();

    if(json.topCountries.length > 0){
        return json.topCountries.map((data) => {

            return {
                x: data[0],
                y: data[1]
            }
        }).slice(0, 7);
    }
}


async function loadConnectionsVariationChart() {
    const chartdiv = document.getElementById("chart3");

    document.getElementById("title-chart3").innerHTML = `Variação de conexões (${continentName(filters.continent) || "Global"})`;

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

    if(filters.period) {
        return {
            destroy: () => {
                chart.destroy();
            }
        };
    }

    const data = [];

    const interval = setInterval(async () => {
        const y = await getQuantPlayers();
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
        destroy: () => {
            clearInterval(interval);
            chart.destroy();
        }
    }
}


// Alertas

const warningModal = jSuites.modal(document.getElementById("modal"), {
    title: "Jogadores conectados em servidores muito distantes",
    width: "80vw",
    height: "80vh",
    closed: true,
});

document.getElementById("warning").onclick = async () => {
    if(!filters.continent) {
        return;
    }

    const request = await fetch(`/bi/dashboard//real-time/far-players/${sessionStorage.REGISTRATION_NUMBER}?continent=${filters.continent}`);
    const json = await request.json();

    const table = document.getElementById("far-players-table");

    let page = 0

    const pagination = () => {
        const start = page * 20
        const end = start + 20;

        return json.farPlayers.slice(start, end);
    }

    const select = pagination();

    const loadTable = (select) => {
        for(let line of select) {
            table.insertAdjacentHTML("beforeend", `
            <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                            ${line.playerIp}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white" style="background-color: #59168b;">
                                    ${continentName(line.playerContinent)}
                                </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            ${line.serverTagName}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                            ${line.serverIp}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white bg-red-500">
                                    ${continentName(line.serverContinent)}
                                </span>
                        </td>
                    </tr>
            `);
        }

        const modal = document.querySelector(".jmodal_content");

        modal.onscroll = () => {
            if (modal.scrollTop + modal.clientHeight >= modal.scrollHeight) {
                page++;
                const select = pagination();
                loadTable(select);
            }
        };
    }

    loadTable(select);

    warningModal.open();
}


// Funções para trazer dados analiticos
async function getPeakOfConnections() {
    let url = `/bi/dashboard/analitic/peak-of-connections/${sessionStorage.REGISTRATION_NUMBER}/${filters.period}`;

    if(filters.continent) {
        url = `/bi/dashboard/analitic/peak-of-connections/${sessionStorage.REGISTRATION_NUMBER}/${filters.period}?continent=${filters.continent}`;
    }

    const request = await fetch(url);
    const json = await request.json();

    if(!json.hasOwnProperty("peak")) {
        return {
            value: 0,
            subvalue: ""
        };
    }

    return {
        value: json.peak.total_conexoes,
        subvalue: new Date(json.peak.horario).toLocaleDateString("pt-BR")
    };
}

async function getTopGameOfPeriod() {
    let url = `/bi/dashboard/analitic/top-game-of-period/${sessionStorage.REGISTRATION_NUMBER}/${filters.period}`;

    if(filters.continent) {
        url = `/bi/dashboard/analitic/top-game-of-period/${sessionStorage.REGISTRATION_NUMBER}/${filters.period}?continent=${filters.continent}`;
    }

    const request = await fetch(url);
    const json = await request.json();

    if(json.hasOwnProperty("result")) {
        return json.result.game;
    }

    return "N/A"
}


async function getAllTopGamesOfPeriod () {
    let url = `/bi/dashboard/analitic/all-top-game-of-period/${sessionStorage.REGISTRATION_NUMBER}/${filters.period}`;

    if(filters.continent) {
        url = `/bi/dashboard/analitic/all-top-game-of-period/${sessionStorage.REGISTRATION_NUMBER}/${filters.period}?continent=${filters.continent}`;
    }

    const request = await fetch(url);
    const json = await request.json();


    if(json.result.length > 0) {
        return json.result.map(v => {
            return {
                x: v.game,
                y: v.total_connections
            }
        });
    }

    return [{
        x: "Nenhum jogo acessado durante este periodo",
        y: 0
    }];
}

async function getTopContinentsOfPeriod () {
    let url = `/bi/dashboard/analitic/top-continents-of-period/${sessionStorage.REGISTRATION_NUMBER}/${filters.period}`;

    if(filters.continent) {
        url = `/bi/dashboard/analitic/top-continents-of-period/${sessionStorage.REGISTRATION_NUMBER}/${filters.period}?continent=${filters.continent}`;
    }

    let request = await fetch(url);
    const json = await request.json();

    if(json.hasOwnProperty("result")) {
        return json.result.map(v => {
            return {
                x: !filters.continent ? continentName(v.continent) : v.continent,
                y: v.total_connections
            }
        });
    }

    return [{
        x: "Nenhum jogo acessado no periodo selecionado",
        y: 0
    }];
}