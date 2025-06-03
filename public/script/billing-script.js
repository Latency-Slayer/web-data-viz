function pegarCustosAWS(){
    fetch("/billing/getCustoAWS", {
        method: 'GET',
    })
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (json) {
            console.log("Dados Recebidos:", json);
        })
        .catch(function (erro) {
            console.error("Erro ao buscar Dados:", erro);
        });
}

function pegarCustosAWSForecast(){
    fetch("/billing/getCustoAWSForecast", {
        method: 'GET',
    })
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (json) {
            console.log("Dados Recebidos:", json);
        })
        .catch(function (erro) {
            console.error("Erro ao buscar Dados:", erro);
        });
}

pegarCustosAWS()
pegarCustosAWSForecast()