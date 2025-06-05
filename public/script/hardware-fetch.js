let limitesMaximos = {}
let limitesMinimos = {}

let ultimaChamadaJira = {
    cpu: 0,
    ram: 0,
    storage: 0
};

function getMotherboardId() {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get("tag");
    return tag ? tag.replace(/\//g, '') : null;

}

function getData() {
    const motherboardId = getMotherboardId();
    fetch("/hardware/api/real-time", {
        method: 'GET'
    }).then(function (resposta) {
        if (resposta.status === 204) {
            console.log("Nenhum dado disponível ainda.");
            return null;
        }
        return resposta.json();
    }).then(function (json) {
        const metricas = new Map(json);
        console.log("Métricas processadas:", metricas);
        var dadosServidor = metricas.get(motherboardId);

        console.log("Dados do servidor encontrados:", dadosServidor);

        if (json && dadosServidor) {
            console.log(dadosServidor)
            console.log("Dados recebidos:", dadosServidor);

            updateAlertsCount(dadosServidor.alertas, motherboardId);

            const container_cpu = document.querySelector(".first");
            const container_ram = document.querySelector(".second");
            const container_disco = document.querySelector(".third");

            container_cpu.classList.remove("Crítico", "Atenção", "Normal");
            container_ram.classList.remove("Crítico", "Atenção", "Normal");
            container_disco.classList.remove("Crítico", "Atenção", "Normal");

            const cpuValue = parseFloat(dadosServidor.metrics.cpu_percent);
            const ramValue = parseFloat(dadosServidor.metrics.ram_percent);
            const discoValue = parseFloat(dadosServidor.metrics.disk_percent);

            const fk_metricCPU = dadosServidor.fk_metrics.cpu
            const fk_metricRAM = dadosServidor.fk_metrics.ram
            const fk_metricStorage = dadosServidor.fk_metrics.storage

            document.getElementById("cpu_limit").textContent = dadosServidor.limites.cpu + "%";
            document.getElementById("ram_limit").textContent = dadosServidor.limites.ram + "%";
            document.getElementById("storage_limit").textContent = dadosServidor.limites.storage + "%";

            document.getElementById('cpuUsage').textContent = cpuValue + '%';
            document.getElementById('ramUsage').textContent = ramValue + '%';
            document.getElementById('diskUsage').textContent = discoValue + '%';

            if (cpuValue >= dadosServidor.limites.cpu) {
                container_cpu.classList.add("Crítico");
                estadoCriticidadeHardware.cpu = "Crítico";
            } else if (cpuValue <= dadosServidor.limites.cpu && cpuValue >= dadosServidor.limites.cpu - 25) {
                container_cpu.classList.add("Atenção");
                estadoCriticidadeHardware.cpu = "Atenção";
            } else {
                container_cpu.classList.add("Normal");
                estadoCriticidadeHardware.cpu = 'Normal'
            }

            if (ramValue >= dadosServidor.limites.ram) {
                container_ram.classList.add("Crítico");
                estadoCriticidadeHardware.ram = "Crítico"
            } else if (ramValue <= dadosServidor.limites.ram && ramValue >= dadosServidor.limites.ram - 25) {
                container_ram.classList.add("Atenção");
                estadoCriticidadeHardware.ram = "Atenção"
            } else {
                container_ram.classList.add("Normal");
                estadoCriticidadeHardware.ram = "Normal"
            }

            if (discoValue >= dadosServidor.limites.storage) {
                container_disco.classList.add("Crítico");
                estadoCriticidadeHardware.ram = "Crítico"
            } else if (discoValue <= dadosServidor.limites.storage && discoValue >= dadosServidor.limites.storage - 25) {
                container_disco.classList.add("Atenção");
                estadoCriticidadeHardware.ram = "Atenção"
            } else {
                container_disco.classList.add("Normal");
                estadoCriticidadeHardware.storage = "Normal"
            }

            const now = new Date().getTime()

            chartCPU.appendData([
                {
                    data: [{ x: now, y: cpuValue }]
                },
                {
                    data: [{ x: now, y: dadosServidor.limites.cpu }]
                }
            ]);

            chartRAM.appendData([
                {
                    data: [{ x: now, y: ramValue }]
                },
                {
                    data: [{ x: now, y: dadosServidor.limites.ram }]
                }
            ]);
        }
    })
}



function updateAlertsCount(alertasObj, motherboardId) {
    const qtdAlertsElement = document.getElementById('qtd_alerts');

    if (alertasObj && alertasObj[motherboardId] !== undefined) {
        qtdAlertsElement.textContent = alertasObj[motherboardId];
        console.log(`Alertas atualizados para ${motherboardId}: ${alertasObj[motherboardId]}`);
    } else {
        qtdAlertsElement.textContent = '0';
        console.log(`Nenhum alerta encontrado para ${motherboardId}, definindo como 0`);
    }
}

function getAlerts() {
    const motherboardId = getMotherboardId();

    if (!motherboardId) {
        console.warn('ID da placa mãe não encontrado na URL.');
        return;
    }

    fetch(`/alert/getAlerts/${encodeURIComponent(motherboardId)}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Erro ao buscar alertas: ${res.status} ${res.statusText}`);
            }
            return res.json();
        })
        .then(alertas => {
            console.log('Alertas recebidos via API específica:', alertas);

            document.getElementById('qtd_alerts').textContent = alertas[0].total_criados;
        })
        .catch(err => {
            console.error('Erro ao buscar alertas via API específica:', err);
        });
}

function getAlertsPorDia() {
    const motherboardId = getMotherboardId();

    fetch(`/alert/getAlertsPorDia/${encodeURIComponent(motherboardId)} `, {
        method: "GET",
    }).then(res => res.json())
        .then(data => {

            const semana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
            const contagemPorDia = [0, 0, 0, 0, 0, 0, 0];

            data.forEach(item => {
                const dataObj = new Date(item.data_criacao);
                const diaSemana = dataObj.getDay();
                contagemPorDia[diaSemana] += item.total_criados;
            });

            console.log("Contagem por dia da semana:", contagemPorDia);

            const totalAlertas = contagemPorDia.reduce((sum, qtd) => sum + qtd, 0);
            document.getElementById('qtd_alerts').textContent = totalAlertas;

            barAlert.updateSeries([{
                name: "Quantidade de Alertas",
                data: contagemPorDia,
                color: "#44395F"
            }]);

        })
        .catch(err => console.error('Erro ao buscar total de alertas:', err));
}

function formatData(date) {
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0') + ':' +
        String(date.getSeconds()).padStart(2, '0');
}

setInterval(getData, 3000);
setInterval(getAlerts, 3000);
setInterval(getAlertsPorDia, 3000);