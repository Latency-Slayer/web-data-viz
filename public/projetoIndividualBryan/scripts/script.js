import MapBox from "./classes/MapBox.js";
import Chart from "./classes/Chart.js";
import { insertElement } from "./functions.js";

window.onload = renderRealTimeDashboard;


function renderRealTimeDashboard () {
    const kpisDiv = document.getElementById("kpisDiv");

    const kpi01 = insertElement(kpisDiv,"kpi-card", {
        "icon-name": "bi-wifi",
        "kpi-title": "Quantidade de conexões",
        value: 0,
        hint: "Soma de todos os jogadores conectados em todos os servidores ao redor de mundo.",
        id: "kpi01"
    }, ["w-1/3"]);

    const kpis02 = insertElement(kpisDiv,"kpi-card", {
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
}
