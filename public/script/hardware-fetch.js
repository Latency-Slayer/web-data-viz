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
            document.getElementById('cpuUsage').textContent = json.metrics.cpu_percent + '%';
            document.getElementById('ramUsage').textContent = json.metrics.ram_percent + '%';
            document.getElementById('diskUsage').textContent = json.metrics.disk_percent + '%';
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
                document.getElementById('cpu_limit').textContent = item.max_limit;
            } else if (item.type === "ram") {
                document.getElementById('ram_limit').textContent = item.max_limit;
            } else if (item.type === "storage" ) {
                document.getElementById('disco_limit').textContent = item.max_limit;
            }
        });
    })
    .catch(function (erro) {
        console.error("Erro ao buscar limites:", erro);
    });
}


setInterval(getData, 2000);