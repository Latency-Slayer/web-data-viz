import {
    continentName,
    executeNowAndRepeatWithInterval,
    initKpi,
    insertElement,
    loader,
    mapLoader,
    observeElementAttributeChange
} from "./functions.js";
import MapBox from "./classes/MapBox.js";
import "https://cdn.jsdelivr.net/npm/apexcharts"


document.addEventListener("DOMContentLoaded", () => {
    if(!sessionStorage.REGISTRATION_NUMBER) {
        window.location.href = "/index.html";
    }
});

const filters = {
    continent: null,
    period: null
}

const map = new MapBox("map");
let mapUpdateInterval;

map.onload(async () => {
    map.loadClusters();
    await laodMapLocations();
});

async function laodMapLocations() {
    if(filters.period) {
        let url = `/bi/dashboard/analitic/get-connections-locations/${sessionStorage.REGISTRATION_NUMBER}/${filters.period}`;
        if(filters.continent) {
            url = `/bi/dashboard/analitic/get-connections-locations/${sessionStorage.REGISTRATION_NUMBER}/${filters.period}?continent=${filters.continent}`;
        }

        const playerLocations = await fetch(url);
        const json = await playerLocations.json();

        map.loadData(json.playerLocations);
        map.updateMapPoints();

        return;
    }

    mapUpdateInterval = executeNowAndRepeatWithInterval(async () => {
        let url = `/bi/dashboard/real-time/player-locations/${sessionStorage.REGISTRATION_NUMBER}`;

        if(filters.continent && !filters.period) {
            url = `/bi/dashboard/real-time/player-locations/${sessionStorage.REGISTRATION_NUMBER}?continent=${filters.continent}`;
        }

        const playerLocations = await fetch(url);
        const json = await playerLocations.json();

        map.loadData(json.playerLocations);
        map.updateMapPoints();
    }, 2000);
}

window.onload = renderDashboard;

let kpis;
let chart1;
let chart2;
let chart3;
let gameVariationChart;

function destroyDashboard() {
    kpis.kpi01.destroy();
    kpis.kpi02.destroy();
    kpis.kpi03.destroy();

    chart1.destroy();
    chart2.destroy();
    chart3.destroy();

    if(gameVariationChart) {
        gameVariationChart.destroy();
    }
}


observeElementAttributeChange(document.getElementById("continent-filter"), async (filter) => {
    const initLoader = loader();
    const initMapLoader = mapLoader();

    filters.continent = filter;

    destroyDashboard();
    await renderDashboard();

    if(filters.period) {
        setTimeout(() => initLoader.remove(), 1000);
    } else {
        initLoader.remove();
    }

    clearInterval(mapUpdateInterval);
    await laodMapLocations();

    initMapLoader.remove();
});

observeElementAttributeChange(document.getElementById("period-filter"), async (filter) => {
    const initLoader = loader();
    const initMapLoader = mapLoader();

    filters.period = filter;

    destroyDashboard();
    await renderDashboard();

    if(filters.period) {
        setTimeout(() => initLoader.remove(), 1000);
    } else {
        initLoader.remove();
    }

    clearInterval(mapUpdateInterval);
    await laodMapLocations();

    initMapLoader.remove();

});


async function renderDashboard () {
    kpis = loadKpis();

    chart1 = await loadTopGamesChart();
    chart2 = await loadTopContinentsChart();
    chart3 = await loadConnectionsVariationChart();
    gameVariationChart = await loadGameVariationChart();

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
        "kpi-title": !filters.period ? "Jogo mais acessado no momento" : `Jogo mais acessado durante ${filters.period} dias`,
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

            return !isNaN(json.result) ? json.result : 0;
    }
    else if(filters.continent && filters.period) {
        url =`/bi/dashboard/analitic/daily-avarage-connections/${sessionStorage.REGISTRATION_NUMBER}/${filters.period}?continent=${filters.continent}`;
        const request = await fetch(url);
        const json = await request.json();

        return !isNaN(json.result) ? json.result : 0;
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
                    fontSize: '18px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 600
                },
                formatter: (val) => {
                    return Intl.NumberFormat("en-US").format(val);
                }
            }
        },
        fill: {
            colors: ['#B69CF6']
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: "24px",
                colors: ["#00"]
            },
        }

    };

    let chart = new ApexCharts(chartdiv, options);
    chart.render();

    if(filters.period) {
        document.getElementById("title-chart-games-modal").innerHTML = title;

        let chartModalDiv = document.getElementById("chart-top-games-modal");
        let chartModal = new ApexCharts(chartModalDiv, options);
        chartModal.render();

        document.getElementById("view-more").classList.remove("invisible");

        return {
            destroy: () => {
                chart.destroy();
                chartModal.destroy();
            }
        };
    }

    document.getElementById("view-more").classList.add("invisible");

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
        title = `Continentes com mais conexões nos últimos ${filters.period} dias`;
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
                    fontSize: '18px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 600

                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: ["#56408C"],
                    fontSize: '18px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 600
                },
                formatter: (val) => {
                    return Intl.NumberFormat("en-US").format(val);
                }
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: "22px",
                colors: ["#00"],
            },
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

    if(filters.period) {
        let options = {
            series: [{
                name: "Quantidade de conexões",
                data: filters.period ? await getConnectionsVariationOfPeriod() : [],
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
                    rotate: -45,
                    style: {
                        colors: ["#56408C"],
                        fontSize: '14px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 600,
                    },
                    formatter: function (val) {
                        const date = new Date(val);
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');

                        const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                        const weekday = weekdays[date.getDay()];

                        return `${weekday} ${day}/${month}`;
                    }
                },
                tooltip: {
                    enabled: true,
                    x: {
                        format: "dd/MM"
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: ["#56408C"],
                        fontSize: '18px',
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
    }

    let options = {
        series: [{
            name: "Quantidade de conexões",
            data: filters.period ? await getConnectionsVariationOfPeriod() : [],
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
                    fontSize: '18px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 400
                },
                formatter: (val) => {
                    return Intl.NumberFormat("PT-BR").format(val);
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


async function getConnectionsVariationOfPeriod() {
    let url = `/bi/dashboard/analitic/get-connections-variations/${sessionStorage.REGISTRATION_NUMBER}/${filters.period}`

    if(filters.continent) {
        url = `/bi/dashboard/analitic/get-connections-variations/${sessionStorage.REGISTRATION_NUMBER}/${filters.period}`
    }

    let request = await fetch(url);
    let json = await request.json();

    if(json.hasOwnProperty("result")) {

        return json.result.map(v => {
            return {
                x: new Date(v.date).getTime(),
                y: v.total_connections
            };
        });
    }

    return [{}];
}


const modalGamesInsights = jSuites.modal(document.getElementById("modal-games-insights"), {
    width: "80vw",
    height: "90vh",
    closed: true
});

modalGamesInsights.content.style.background = "#e5e7eb";


document.getElementById("view-more").addEventListener("click", () => {
   modalGamesInsights.open();
});

async function loadGameVariationChart() {
    if(!filters.period) {
        return;
    }

    let gamesData = await getGameConnectionsVariation();

    console.log(gamesData);

    if(gamesData.result.length === 0) {
        return;
    }

    const labels = [];
    const series = [];

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#2505f5', '#f505bd'];

    const strokeWidths = [3, 3, 3, 3, 3, 3];

    for(let date of gamesData.result[0].dates) {
        labels.push(new Date(date).getTime());
    }

    for(let i = 0; i < gamesData.result.length; i++) {
        let gameData = gamesData.result[i];
        series.push({
            name: gameData.game,
            data: gameData.connections,
            color: colors[i % colors.length]
        });
    }

    let options = {
        series: series,
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
            toolbar: {
                show: true,
                tools: {
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            }
        },
        colors: colors,
        stroke: {
            curve: 'smooth',
            width: strokeWidths,
        },
        markers: {
            size: 4,
            hover: {
                size: 6
            },
            strokeWidth: 2,
            strokeColors: '#fff'
        },
        labels: labels,
        title: {
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333'
            }
        },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'center',
            floating: false,
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            onItemClick: {
                toggleDataSeries: true
            },
            onItemHover: {
                highlightDataSeries: true
            },
            markers: {
                width: 12,
                height: 12,
                strokeWidth: 0,
                radius: 12
            }
        },
        xaxis: {
            type: "datetime",
            labels: {
                style: {
                    colors: ["#56408C"],
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 600,
                },
                formatter: function (value) {
                    return new Date(value).toLocaleDateString("pt-BR", {
                        weekday: 'short',
                        day: '2-digit',
                        month: '2-digit'
                    }).replace(".", "").replace(",", "");
                }
            },
            datetimeUTC: false,
        },
        yaxis: {
            title: {
                text: 'Número de Conexões',
                style: {
                    color: '#666',
                    fontSize: '12px',
                    fontWeight: 600
                }
            },
            labels: {
                style: {
                    colors: '#666',
                    fontSize: '11px'
                }
            }
        },
        tooltip: {
            shared: true,
            intersect: false,
            theme: 'light',
            style: {
                fontSize: '12px'
            },
            x: {
                format: 'dd/MM/yyyy'
            },
            y: {
                formatter: function(value, { seriesIndex, series }) {
                    return value?.toLocaleString('pt-BR') + ' conexões';
                }
            }
        },
        // Grid mais sutil
        grid: {
            show: true,
            borderColor: '#e0e0e0',
            strokeDashArray: 3,
            position: 'back',
            xaxis: {
                lines: {
                    show: false
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        // Estados de hover e seleção
        states: {
            hover: {
                filter: {
                    type: 'lighten',
                    value: 0.15
                }
            },
            active: {
                allowMultipleDataPointsSelection: false,
                filter: {
                    type: 'darken',
                    value: 0.35
                }
            }
        }
    };

    const chart = new ApexCharts(document.getElementById("chart-variance-games"), options);
    chart.render();


    return {
        destroy: () => {
            chart.destroy();
        }
    }
}


async function getGameConnectionsVariation() {
    let url = `/bi/dashboard/analitic/get-game-variation/${sessionStorage.REGISTRATION_NUMBER}/${filters.period}`;

    if(filters.continent) {
        url = `/bi/dashboard/analitic/get-game-variation/${sessionStorage.REGISTRATION_NUMBER}/${filters.period}?continent=${filters.continent}`;
    }

    const request = await fetch(url);
    const json = await request.json();

    if(!json.hasOwnProperty("result")) {
        return [];
    }

    return json;
}
