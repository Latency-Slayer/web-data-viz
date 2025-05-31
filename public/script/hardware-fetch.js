let limitesMaximos = {}
let limitesMinimos = {}

let ultimaChamadaJira = {
    cpu: 0,
    ram: 0,
    storage: 0
};

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
                abrirChamadoJira('cpu', cpuValue, limitesMaximos.cpu, "Crítico").then(idJira => {
                    registerAlert('cpu', cpuValue, limitesMaximos.cpu, "Crítico", idJira);
                });
            } else if (cpuValue <= limitesMaximos.cpu && cpuValue >= 65) {
                container_cpu.classList.add("Atenção");
                abrirChamadoJira('cpu', cpuValue, limitesMaximos.cpu, "Atenção").then(idJira => {
                    registerAlert('cpu', cpuValue, limitesMaximos.cpu, "Atenção", idJira)
                })
            } else {
                container_cpu.classList.add("Normal");
            }

            if (ramValue >= limitesMaximos.ram) {
                container_ram.classList.add("Crítico");
                abrirChamadoJira('ram', ramValue, limitesMaximos.ram, "Crítico").then(idJira => {
                    registerAlert('ram', ramValue, limitesMaximos.ram, "Crítico", idJira)
                })
            } else if (ramValue <= limitesMaximos.ram && ramValue >= 65) {
                container_ram.classList.add("Atenção");
                abrirChamadoJira('ram', ramValue, limitesMaximos.ram, "Atenção").then(idJira => {
                    registerAlert('ram', ramValue, limitesMaximos.ram, "Atenção", idJira)
                })
            } else {
                container_ram.classList.add("Normal");
            }

            if (discoValue >= limitesMaximos.storage) {
                container_disco.classList.add("Crítico");
                abrirChamadoJira('storage', discoValue, limitesMaximos.storage, "Crítico").then(idJira => {
                    registerAlert('storage', discoValue, limitesMaximos.storage, "Crítico", idJira)
                })
            } else if (discoValue <= limitesMaximos.storage && discoValue >= 60) {
                container_disco.classList.add("Atenção");
                abrirChamadoJira('storage', discoValue, limitesMaximos.storage, "Atenção").then(idJira => {
                    registerAlert('storage', discoValue, limitesMaximos.storage, "Atenção", idJira)
                })
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

function registerAlert(component, value, limite, nivel, idJira) {
    let mensagem = "";
    const dateAlert = new Date();
    const date = formatData(dateAlert);

    if (nivel === "Crítico") {
        mensagem = `O componente ${component.toUpperCase()} ultrapassou o limite. Valor atual: ${value}%, Limite: ${limite}%`;
    } else if (nivel === "Atenção") {
        mensagem = `O componente ${component.toUpperCase()} está próximo do limite. Valor atual: ${value}%, Limite: ${limite}%`;
    }

    let fk_Metric;
    if (component === "cpu") {
        fk_Metric = 5;
    } else if (component === "ram") {
        fk_Metric = 3;
    } else if (component === "storage") {
        fk_Metric = 2;
    }

    const payload = {
        status: "aberto",
        dateAlert: date,
        mensage: mensagem,
        exceeded_limit: limite,
        valor: value,
        fk_Metric: fk_Metric,
        nivel: nivel,
        idJira: idJira
    };

    fetch("/alert/registerAlert", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(json => console.log("Alerta registrado:", json))
        .catch(err => console.error("Erro ao registrar alerta:", err));
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

function getAlertsPorDia() {
    fetch("/alert/getAlertsPorDia", {
        method: "GET",
    }).then(res => res.json())
        .then(data => {

            const semana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
            const contagemPorDia = [0, 0, 0, 0, 0, 0, 0];

            data.forEach(item => {
                const dataObj = new Date(item.data_criacao);
                const diaSemana = dataObj.getDay(); // 0 (Dom) a 6 (Sab)
                contagemPorDia[diaSemana] += item.total_criados;
            });

            console.log("Contagem por dia da semana:", contagemPorDia);

            const totalAlertas = contagemPorDia.reduce((sum, qtd) => sum + qtd, 0);
            document.getElementById('qtd_alerts').textContent = totalAlertas;

            // Atualiza o gráfico
            barAlert.updateSeries([{
                name: "Quantidade de Alertas",
                data: contagemPorDia,
                color: "#44395F"
            }]);

        })
        .catch(err => console.error('Erro ao buscar total de alertas:', err));
}


function abrirChamadoJira(component, value, limite, nivel) {
    let mensagem = "";
    if (nivel === "Crítico") {
        mensagem = `O componente ${component.toUpperCase()} ultrapassou o limite. Valor atual: ${value}%, Limite: ${limite}%`;
    } else if (nivel === "Atenção") {
        mensagem = `O componente ${component.toUpperCase()} está próximo do limite. Valor atual: ${value}%, Limite: ${limite}%`;
    } else {
        mensagem = `O componente ${component.toUpperCase()} está em situação anormal. Valor atual: ${value}%, Limite: ${limite}%`;
    }

    return fetch('/jira/criar-chamado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            summary: `Alerta : ${component.toUpperCase()} - ${value}% ${nivel}`,
            description: mensagem,
            assignee: "712020:46bc3ab4-b0da-4a73-9cd5-8b395c3e3678"
        })
    })
    .then(res => {
        if (!res.ok) {
            console.error(`Erro HTTP: ${res.status}`);
            return res.text().then(text => {
                console.error('Detalhes do erro:', text);
                throw new Error(text);
            });
        }
        if (res.status === 204) {
            console.log('Chamado criado, mas sem conteúdo.');
            return null;
        }
        return res.json();
    })
    .then(data => {
        if (data) { 
            console.log('Chamado criado com ID:', data.data.id);
            return data.data.id;
        } else {
            console.warn('Nenhum ID retornado do JIRA:', data);
            return null;
        }
    })
    .catch(err => {
        console.error('Erro ao criar chamado:', err);
        return null;
    });
}



function canOpenJiraCall(component) {
    const now = Date.now();
    return (now - ultimaChamadaJira[component]) >= 10000;
}

setInterval(getData, 2000);
setInterval(getAlerts, 5000);