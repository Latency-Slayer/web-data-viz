let limitesMaximos = {}
let limitesMinimos = {}

let ultimaChamadaJira = {
    cpu: 0,
    ram: 0,
    storage: 0
};

function getMotherboardId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("tag");
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

        if (json) {
            console.log(dadosServidor)
            console.log("Dados recebidos:", dadosServidor);
            const container_cpu = document.querySelector(".first");
            const container_ram = document.querySelector(".second");
            const container_disco = document.querySelector(".third");

            container_cpu.classList.remove("Crítico", "Atenção", "Normal");
            container_ram.classList.remove("Crítico", "Atenção", "Normal");
            container_disco.classList.remove("Crítico", "Atenção", "Normal");

            const cpuValue = parseFloat(dadosServidor.metrics.cpu_percent);
            const ramValue = parseFloat(dadosServidor.metrics.ram_percent);
            const discoValue = parseFloat(dadosServidor.metrics.disk_percent);

            document.getElementById("cpu_limit").textContent = dadosServidor.limites.cpu + "%";
            document.getElementById("ram_limit").textContent = dadosServidor.limites.ram + "%";
            document.getElementById("storage_limit").textContent = dadosServidor.limites.storage + "%";


            document.getElementById('cpuUsage').textContent = cpuValue + '%';
            document.getElementById('ramUsage').textContent = ramValue + '%';
            document.getElementById('diskUsage').textContent = discoValue + '%';

            if (cpuValue >= dadosServidor.limites.cpu) {
                container_cpu.classList.add("Crítico");
                abrirChamadoJira('cpu', cpuValue, dadosServidor.limites.cpu, "Crítico").then(idJira => {
                    registerAlert('cpu', cpuValue, dadosServidor.limites.cpu, "Crítico", idJira);
                });
            } else if (cpuValue <= dadosServidor.limites.cpu && cpuValue >= 65) {
                container_cpu.classList.add("Atenção");
                abrirChamadoJira('cpu', cpuValue, dadosServidor.limites.cpu, "Atenção").then(idJira => {
                    registerAlert('cpu', cpuValue, dadosServidor.limites.cpu, "Atenção", idJira)
                })
            } else {
                container_cpu.classList.add("Normal");
            }

            if (ramValue >= dadosServidor.limites.ram) {
                container_ram.classList.add("Crítico");
                abrirChamadoJira('ram', ramValue, dadosServidor.limites.ram, "Crítico").then(idJira => {
                    registerAlert('ram', ramValue, dadosServidor.limites.ram, "Crítico", idJira)
                })
            } else if (ramValue <= dadosServidor.limites.ram && ramValue >= 65) {
                container_ram.classList.add("Atenção");
                abrirChamadoJira('ram', ramValue, dadosServidor.limites.ram, "Atenção").then(idJira => {
                    registerAlert('ram', ramValue, dadosServidor.limites.ram, "Atenção", idJira)
                })
            } else {
                container_ram.classList.add("Normal");
            }

            if (discoValue >= dadosServidor.limites.storage) {
                container_disco.classList.add("Crítico");
                abrirChamadoJira('storage', discoValue, dadosServidor.limites.storage, "Crítico").then(idJira => {
                    registerAlert('storage', discoValue, dadosServidor.limites.storage, "Crítico", idJira)
                })
            } else if (discoValue <= dadosServidor.limites.storage && discoValue >= 60) {
                container_disco.classList.add("Atenção");
                abrirChamadoJira('storage', discoValue, dadosServidor.limites.storage, "Atenção").then(idJira => {
                    registerAlert('storage', discoValue, dadosServidor.limites.storage, "Atenção", idJira)
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
        .catch(function (erro) {
            console.error("Erro ao buscar métricas:", erro);
        });
}



function registerAlert(component, value, limite, nivel, idJira) {
    let mensagem = "";
    const dateAlert = new Date();

    const params = new URLSearchParams(window.location.search);
    const tagName = params.get("tag");
    console.log("motherboard: ", tagName)

    const date = formatData(dateAlert);

    if (nivel === "Crítico") {
        mensagem = `O componente ${component.toUpperCase()} ultrapassou o limite. Valor atual: ${value}%, Limite: ${limite}% no servidor ${tagName}`;
    } else if (nivel === "Atenção") {
        mensagem = `O componente ${component.toUpperCase()} está próximo do limite. Valor atual: ${value}%, Limite: ${limite}% no servidor ${tagName}`;
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
        idJira: idJira,
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


function abrirChamadoJira(component, value, limite, nivel) {
    const params = new URLSearchParams(window.location.search);
    const tagName = params.get("tag");
    console.log("motherboard: ", tagName)

    let mensagem = "";
    if (nivel === "Crítico") {
        mensagem = `O componente ${component.toUpperCase()} ultrapassou o limite. Valor atual: ${value}%, Limite: ${limite}% no Servidor ${tagName}`;
    } else if (nivel === "Atenção") {
        mensagem = `O componente ${component.toUpperCase()} está próximo do limite. Valor atual: ${value}%, Limite: ${limite}% no Servidor ${tagName}`;
    }

    return fetch('/jira/criar-chamado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            summary: `Alerta : ${component.toUpperCase()} - ${value}% ${nivel} no Servidor ${tagName}`,
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

function getAlerts() {
    const motherboardId = getMotherboardId();
    fetch(`/alert/getAlerts?tag=${motherboardId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Erro ao buscar alertas');
            }
            return res.json();
        })
        .then(alertas => {
            console.log('Alertas recebidos:', alertas);
            document.getElementById('qtd_alertas').textContent = alertas.total_criados ?? 0;
        })
        .catch(err => {
            console.error('Erro ao buscar alertas:', err);
        });
}



function canOpenJiraCall(component) {
    const now = Date.now();
    return (now - ultimaChamadaJira[component]) >= 10000;
}

setInterval(getData, 2000);
setInterval(getAlerts, 5000);