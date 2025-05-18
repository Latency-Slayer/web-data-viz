function getProcess() {
    fetch("/process/api/real-time", {
        method: 'GET'
    }).then(function (resposta) {
        if (resposta.status === 204) {
            console.log("Nenhum dado disponível ainda.");
            return null;
        }
        return resposta.json();
    }).then(function (json) {
        if (json) {
            console.log("Processos recebidos:", json);
        }
    })
    .catch(function (erro) {
        console.error("Erro ao buscar métricas:", erro);
    });
}

setInterval(getProcess, 2000);