import { insertElement, initKpi, observeElementAttributeChange, continentName, executeNowAndRepeatWithInterval } from "./functions.js";
import MapBox from "./classes/MapBox.js";
import "https://cdn.jsdelivr.net/npm/apexcharts"

const map = new MapBox("map");

map.onload(() => {
    map.loadClusters();

    executeNowAndRepeatWithInterval(async () => {
        const playerLocations = await fetch(`/bi/dashboard/real-time/player-locations/${sessionStorage.REGISTRATION_NUMBER}`)
        const json = await playerLocations.json();

        console.log(json)

        map.loadData(json.playerLocations);
        map.updateMapPoints();
    }, 2000);
});

window.onload = renderRealTimeDashboard;

const filters = {
    continent: null,
    game: null
}

async function renderRealTimeDashboard () {
    let kpis = loadKpis();

    let chart1 = await loadTopGamesChart(`Jogos mais acessados no momento (${continentName(filters.continent) || "Global"})`);
    let chart2 = await loadTopContinentsChart(`Países com mais jogadores no momento (${continentName(filters.continent) || "Global"})`);
    let chart3 = await loadConnectionsVariationChart(`Variação de conexões (${continentName(filters.continent) || "Global"})`);

    // Reload dashboard on filter change;

    const continentFilter = document.getElementById("continent-filter");

    observeElementAttributeChange(continentFilter, async (filter) => {
        filters.continent = filter;

        document.getElementById("far-players-table").innerHTML = "";

        kpis.kpi01.destroy();
        kpis.kpi02.destroy();
        kpis.kpi03.destroy();


        const kpiHints = filter ? {
            kpi1Hint: "Quantidade de conexões no continente filtrado.",
            kpi2Hint: "Total de servidores ativos no continente filtrado. É possível ter jogadores ativos no " +
                "continente, mas não necessáriamente ter um servidor ativo. Nesse caso significa que os jogadores estão " +
                "jogando em servidores localizados em outros continentes.",
            kpi3Hint: "Jogo mais jogado no continente filtrado.",
        } : null;

        kpis = loadKpis(filters, kpiHints);

        chart1.stop();
        chart2.stop();
        chart3.stop();

        chart1 = await loadTopGamesChart(`Jogos mais acessados no momento (${continentName(filters.continent) || "Global"})`, filters);
        chart2 = await loadTopContinentsChart(`Países com mais jogadores no momento (${continentName(filters.continent) || "Global"})`, filters.continent);
        chart3 = await loadConnectionsVariationChart(`Variação de conexões (${continentName(filters.continent) || "Global"})`, filters);
    });
}

function loadKpis(filters, hints) {
    const kpisDiv = document.getElementById("kpisDiv");

    if(!hints) {
        hints = {};

        hints.kpi1Hint = "Soma de todos os jogadores conectados em todos os servidores ao redor de mundo.";
        hints.kpi2Hint = "Total de servidores ativos globalmente.";
        hints.kpi3Hint = "Jogo mais jogado globalmente.";
    }

    const kpi01 = insertElement(kpisDiv,"kpi-card", {
        "icon-name": "bi-wifi",
        "kpi-title": "Quantidade de conexões",
        value: 0,
        hint: hints.kpi1Hint,
        id: "kpi01"
    }, ["w-1/3"]);

    const kpi02 = insertElement(kpisDiv,"kpi-card", {
        "icon-name": "bi-hdd-stack",
        "kpi-title": "Total de servidores ativos",
        value: 0,
        hint: hints.kpi2Hint,
        id: "kpi02"
    }, ["w-1/3"]);

    const kpi03 = insertElement(kpisDiv,"kpi-card", {
        "icon-name": "bi-controller",
        "kpi-title": "Jogo mais jogado no momento",
        value: 0,
        hint: hints.kpi3Hint,
        id: "kpi03"
    }, ["w-1/3"]);

    const kpi01Init = initKpi(kpi01, getQuantPlayers, filters);
    const kpi02Init = initKpi(kpi02, getQuantServersActive, filters);
    const kpi03Init = initKpi(kpi03, getTopGame, filters);

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


async function loadTopGamesChart(title, filters) {
    const chartdiv = document.getElementById("chart1");
    document.getElementById("title-chart1").innerHTML = title;

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




async function loadTopContinentsChart(title, continent) {
    const chartdiv = document.getElementById("chart2");
    document.getElementById("title-chart2").innerHTML = title;

    let options = {
        series: [{
            name: "Quantidade de jogadores",
            data: !continent ? await getTopContinents() : await getTopCountries(continent),
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
            data: !continent ? await getTopContinents() : await getTopCountries(continent),
        }]);
    }, 2000)

    return {
        stop: () => {
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

async function getTopCountries(continentCode) {
    const request = await fetch(`/bi/dashboard/real-time/top-countries/${sessionStorage.REGISTRATION_NUMBER}?continent=${continentCode}`);
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


async function loadConnectionsVariationChart(title, filters) {
    const chartdiv = document.getElementById("chart3");
    document.getElementById("title-chart3").innerHTML = title;

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
