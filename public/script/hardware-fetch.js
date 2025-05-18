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
            console.log("Dados recebidos:", json);
            document.getElementById('cpuUsage').textContent = json.metrics.cpu_percent + '%';
            document.getElementById('ramUsage').textContent = json.metrics.ram_percent + '%';
            document.getElementById('diskUsage').textContent = json.metrics.disk_percent + '%';
        }
    })
    .catch(function (erro) {
        console.error("Erro ao buscar métricas:", erro);
    });
}

setInterval(getData, 2000);