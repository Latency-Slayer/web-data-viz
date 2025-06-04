const orcamento = 50.00

let mesesAnteriores = [];
let valoresAnteriores = [];

let valores = [];
let servicos = [];

let valoresAbsolutos = [];

function pegarCustosAWS() {
    fetch("/billing/getCustoAWS", {
        method: 'GET',
    })
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (json) {
            console.log("Dados Recebidos:", json);

            const valorMensal = document.getElementById("custo_mensal");
            const valorMensal2 = document.getElementById("custo_mensal2");
            var comparacao_custo_mensal_anterior = document.getElementById("comparacao_custo_mensal_anterior");
            var comparacao_custo_mensal_orcamento = document.getElementById("comparacao_custo_mensal_orcamento")

            const mesAtual = new Date().toISOString().slice(0, 7);

            mesesAnteriores = Object.keys(json.custoMensal)
                .filter(mes => mes !== mesAtual)
                .sort();

            valoresAnteriores = mesesAnteriores.map(mes => json.custoMensal[mes]);

            const porcent1 = Object.entries(json.custoMensal)[3][1];
            const porcent2 = Object.entries(json.custoMensal)[2][1];
            const porcentTotal = (porcent2 / porcent1) * 100;

            

            // Custo por Serviço
            const mesesDisponiveis = Object.keys(json.resumoPorMesEServico).sort();
            const ultimoMes = mesesDisponiveis[mesesDisponiveis.length - 1];
            const servicosUltimoMes = json.resumoPorMesEServico[ultimoMes];

            if (porcent2 <= porcent1) {
                comparacao_custo_mensal_anterior.style.color = '#DC2626'
            } else {
                comparacao_custo_mensal_anterior.style.color = '#00D207'
            }

            comparacao_custo_mensal_anterior.textContent = porcentTotal.toFixed(2) + "%"

            const porcentagemTotal = (porcent1 / orcamento) * 100

            if (orcamento <= porcent1) {
                comparacao_custo_mensal_orcamento.style.color = '#DC2626'
            } else {
                comparacao_custo_mensal_orcamento.style.color = '#00D207'
            }

            comparacao_custo_mensal_orcamento.textContent = porcentagemTotal.toFixed(2) + "%"

            valorMensal.textContent = 'R$' + porcent1.toFixed(2);
            valorMensal2.textContent = 'R$' + porcent1.toFixed(2) + " /R$" + orcamento;

            for (const [servico, valor] of Object.entries(servicosUltimoMes)) {
                const valorAbsoluto = Math.round(Math.abs(valor),2);
                if (valorAbsoluto > 0) {
                    servicos.push(servico);
                    valores.push(valor);
                }
            }
            console.log("valores: " + valores)

            for(let i = 0; i < valores.length; i++){
                const abs = Math.round(Math.abs(valores[i]),2);
                valoresAbsolutos.push(abs)
            }

            console.log("Valores absolutos: " + valoresAbsolutos)

            custosMensais.updateSeries([{
                name: "Gasto",
                data: mesesAnteriores.map((mes, i) => ({
                    x: mes,
                    y: valoresAnteriores[i],
                    fillColor: '#f803bb'
                }))
            }]);

            custoServico.updateOptions({ labels: servicos })
            custoServico.updateSeries(valoresAbsolutos)

            pegarCustosAWSForecast();
        })
        .catch(function (erro) {
            console.error("Erro ao buscar Dados:", erro);
        });
}

function pegarCustosAWSForecast() {
    fetch("/billing/getCustoAWSForecast", {
        method: 'GET',
    })
        .then(res => res.json())
        .then(json => {
            console.log("Previsões Recebidas:", json);

            const mesAtual = new Date().toISOString().slice(0, 7);

            const previsaoCustoMes = document.getElementById("prev_custo_mes");
            const comparacao_custo_mes_anterior = document.getElementById("comparacao_custo_mes_anterior");

            const mesesForecast = Object.keys(json).sort();
            const valoresForecast = mesesForecast.map(mes => json[mes]);

            const porcent1Forecast = (valoresAnteriores[2] * 30) / 5;
            console.log("For: " + porcent1Forecast)
            const porcent2Forecast = valoresForecast[0];
            const porcentTotal = (porcent1Forecast / porcent2Forecast) * 100

            previsaoCustoMes.textContent = "R$" + valoresForecast[0];

            if (porcent2Forecast <= porcent1Forecast) {
                comparacao_custo_mes_anterior.style.color = '#00D207'
            } else {
                comparacao_custo_mes_anterior.style.color = '#DC2626'
            }

            comparacao_custo_mes_anterior.textContent = porcentTotal.toFixed(2) + "%"
            
            const todosMeses = [...mesesAnteriores, ...mesesForecast];
            const todosValores = [...valoresAnteriores, ...valoresForecast];

            custosMensais.updateSeries([{
                name: "Gasto",
                data: todosMeses.map((mes, i) => {
                    let cor = '#3a2e5d57';
                    if (mes < mesAtual) {
                        cor = '#f803bb';
                    } else if (mes === mesAtual) {
                        cor = '#3d1b91';
                    }
                    return {
                        x: mes,
                        y: todosValores[i],
                        fillColor: cor
                    };
                })
            }]);
        })
        .catch(err => {
            console.error("Erro ao buscar Previsão:", err);
        });
}

pegarCustosAWS(); // inicia tudo