// Importar bibliotecas da AWS
const { CostExplorerClient, GetCostAndUsageCommand, GetCostForecastCommand } = require("@aws-sdk/client-cost-explorer");

// Configuração do cliente AWS
const awsRegiao = "us-east-1"; // ou a região da sua conta

// Cliente para Billing (faturamento)
const clienteBilling = new CostExplorerClient({ region: awsRegiao });

// Função para puxar dados de billing (custos)
async function pegarCustosAWS() {
  const hoje = new Date();
  const mesPassado = new Date();
  mesPassado.setMonth(hoje.getMonth() - 3);

  const comando = new GetCostAndUsageCommand({
    TimePeriod: {
      Start: mesPassado.toISOString().split('T')[0],
      End: hoje.toISOString().split('T')[0],
    },
    Granularity: "MONTHLY",
    Metrics: ["UnblendedCost"],
    GroupBy: [{
        Type: 'DIMENSION',
        Key: 'SERVICE' 
    }]
  });

  try {
    const resultado = await clienteBilling.send(comando);

    
    //console.log(JSON.stringify(resultado.ResultsByTime, null, 2))
    const custoMensal = {};
    const resumoPorMesEServico = {};

    for(let result of resultado.ResultsByTime){
      const mes = result.TimePeriod.Start.slice(0, 7); // YYYY-MM
      let somaMes = 0;
      if (!resumoPorMesEServico[mes]) {
      resumoPorMesEServico[mes] = {};
      }
      for (let group of result.Groups) { 
          const servico = group.Keys[0];
          const valor = parseFloat(Number(group.Metrics.UnblendedCost.Amount));
          if (valor < 0) {
            somaMes += (valor * -10000);
          } else {
            somaMes += (valor * 10000);
          }
          if (!resumoPorMesEServico[mes][servico]) {
              resumoPorMesEServico[mes][servico] = 0;
        }
        resumoPorMesEServico[mes][servico] += Number(valor * -10000);
      }
      custoMensal[mes] = somaMes;
    }
    console.log("Custo mensal resumido:", custoMensal);
    console.log("Resumo de custo por serviço por mês:");
    console.log(JSON.stringify(resumoPorMesEServico, null, 2));
  } catch (erro) {
    console.error("Erro ao pegar custos:", erro);
  }
}


async function pegarCustosAWSForecast() {
  const hoje = new Date();
  const finalMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
  const mesFuturo = new Date();
  mesFuturo.setMonth(hoje.getMonth() + 3);

  const comando = new GetCostForecastCommand({
    TimePeriod: {
      Start: finalMes.toISOString().split('T')[0],
      End: mesFuturo.toISOString().split('T')[0],
    },
    Granularity: "MONTHLY",
    Metric: "UNBLENDED_COST",
  });

  try {
    const resultado = await clienteBilling.send(comando);

     
    //console.log(JSON.stringify(resultado.ResultsByTime, null, 2))
    const custoMensal = {};

   for (let result of resultado.ForecastResultsByTime) {
      const mes = result.TimePeriod.Start.slice(0, 7); // YYYY-MM
      const valor = parseFloat(result.MeanValue);
      const valorConvertido = (valor * 10000); // valor convertido para inteiro
      custoMensal[mes] = valorConvertido.toFixed(2);
    }
    console.log("Custo mensal resumido:", custoMensal);
    console.log("Resumo de custo por serviço por mês:");
  } catch (erro) {
    console.error("Erro ao pegar custos:", erro);
  }
}

// Chamar as funções
pegarCustosAWS();
pegarCustosAWSForecast();