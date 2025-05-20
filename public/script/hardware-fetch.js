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

            if (cpuValue >= 80) {
                container_cpu.classList.add("Crítico");
            } else if (cpuValue >= 50) {
                container_cpu.classList.add("Atenção");
            } else {
                container_cpu.classList.add("Normal");
            }

            if (ramValue >= 80) {
                container_ram.classList.add("Crítico");
            } else if (ramValue >= 50) {
                container_ram.classList.add("Atenção");
            } else {
                container_ram.classList.add("Normal");
            }

            if (discoValue >= 60) {
                container_disco.classList.add("Crítico");
            } else if (discoValue >= 50) {
                container_disco.classList.add("Atenção");
            } else {
                container_disco.classList.add("Normal");
            }

            const now = new Date().getTime()

            chartCPU.appendData([
                {
                    data: [{ x: now, y: cpuValue }]
                },
                {
                    data: [{ x: now, y: 80 }]
                }
            ]);

            chartRAM.appendData([
                {
                    data: [{ x: now, y: ramValue }]
                },
                {
                    data: [{ x: now, y: 80 }]
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
                if (item.type === "cpu") {
                    document.getElementById('cpu_limit').textContent = item.max_limit + "%";
                } else if (item.type === "ram") {
                    document.getElementById('ram_limit').textContent = item.max_limit + "%";
                } else if (item.type === "storage") {
                    document.getElementById('disco_limit').textContent = item.max_limit + "%";
                }
            });
        })
        .catch(function (erro) {
            console.error("Erro ao buscar limites:", erro);
        });
}


setInterval(getData, 2000);