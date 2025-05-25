let limitesMaximos = {}
let limitesMinimos = {}

function getData() {
    fetch("/hardware/api/real-time", {
        method: 'GET'
    }).then(function (resposta) {
        if (resposta.status === 204) {
            console.log("Nenhum dado disponível ainda.");
            return null;
        }
        return resposta.json();
    }).then(function (json) {
        if (json) {
            console.log("Dados recebidos:", json.metrics);
            const container_cpu = document.querySelector(".first");
            const container_ram = document.querySelector(".second");
            const container_disco = document.querySelector(".third");

            container_cpu.classList.remove("Crítico", "Atenção", "Normal");
            container_ram.classList.remove("Crítico", "Atenção", "Normal");
            container_disco.classList.remove("Crítico", "Atenção", "Normal");

            const cpuValue = parseFloat(json.metrics.cpu_percent);
            const ramValue = parseFloat(json.metrics.ram_percent);
            const discoValue = parseFloat(json.metrics.disk_percent);

            document.getElementById('cpuUsage').textContent = cpuValue + '%';
            document.getElementById('ramUsage').textContent = ramValue + '%';
            document.getElementById('diskUsage').textContent = discoValue + '%';

            if (cpuValue >= limitesMaximos.cpu) {
                container_cpu.classList.add("Crítico");
                registerAlert('cpu', cpuValue, limitesMaximos.cpu, "Crítico")
            } else if (cpuValue <= limitesMaximos.cpu && cpuValue >= 65) {
                container_cpu.classList.add("Atenção");
                registerAlert('cpu', cpuValue, limitesMaximos.cpu, "Atenção")
            } else {
                container_cpu.classList.add("Normal");
            }

            if (ramValue >= limitesMaximos.ram) {
                container_ram.classList.add("Crítico");
                registerAlert('ram', ramValue, limitesMaximos.ram, "Crítico")
            } else if (ramValue <= limitesMaximos.ram && ramValue >= 65) {
                container_ram.classList.add("Atenção");
                registerAlert('ram', ramValue, limitesMaximos.ram, "Atenção")
            } else {
                container_ram.classList.add("Normal");
            }

            if (discoValue >= limitesMaximos.storage) {
                container_disco.classList.add("Crítico");
                registerAlert('storage', discoValue, limitesMaximos.storage, "Crítico")
            } else if (discoValue <= limitesMaximos.storage && discoValue >= 60) {
                container_disco.classList.add("Atenção");
                registerAlert('storage', discoValue, limitesMaximos.storage, "Atenção")
            } else {
                container_disco.classList.add("Normal");
            }

            const now = new Date().getTime()

            chartCPU.appendData([
                {
                    data: [{ x: now, y: cpuValue }]
                },
                {
                    data: [{ x: now, y: limitesMaximos.cpu }]
                }
            ]);

            chartRAM.appendData([
                {
                    data: [{ x: now, y: ramValue }]
                },
                {
                    data: [{ x: now, y: limitesMaximos.ram }]
                }
            ]);

        }
    })
        .catch(function (erro) {
            console.error("Erro ao buscar métricas:", erro);
        });
}

function getLimitComponent() {
    fetch("/server/getLimitComponent", {
        method: 'GET',
    })
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (json) {
            console.log("Limites Recebidos:", json);

            json.forEach(item => {
                limitesMaximos[item.type] = item.max_limit;
                document.getElementById(item.type + "_limit").textContent = item.max_limit + "%";
            });
        })
        .catch(function (erro) {
            console.error("Erro ao buscar limites:", erro);
        });
}

function registerAlert(component, value, limite, nivel, fk_Metric) {

    let mensagem = "";
    const dateAlert = new Date();
    const date = formatData(dateAlert)

    if (nivel === "Crítico") {
        mensagem = `O componente ${component.toUpperCase()} ultrapassou o limite. Valor atual: ${value}%, Limite: ${limite}%`;
    } else if (nivel === "Atenção") {
        mensagem = `O componente ${component.toUpperCase()} está próximo do limite. Valor atual: ${value}%, Limite: ${limite}%`;
    }

    if (component == "cpu") {
        fk_Metric = 5;
    } else if (component == "ram") {
        fk_Metric = 3;
    } else {
        fk_Metric = 2;
    }

    fetch("/alert/registerAlert", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: "aberto",
            dateAlert: date,
            mensage: mensagem,
            exceeded_limit: limite,
            fk_Metric: fk_Metric,
            nivel: nivel
        })
    })
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (json) {
            console.log("Alerta registrado:", json);
        })
        .catch(function (erro) {
            console.error("Erro ao registrar alerta:", erro);
        });
}

function formatData(date) {
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0') + ':' +
        String(date.getSeconds()).padStart(2, '0');
}

function getAlerts() {
    fetch("/alert/getAlerts", {
        method: "GET",
    }).then(res => res.json())
        .then(data => {
            console.log("Total de alertas:", data);
            document.getElementById('qtd_alerts').textContent = data.total;
        })
        .catch(err => console.error('Erro ao buscar total de alertas:', err));
}


setInterval(getData, 2000);
setInterval(getAlerts, 5000);