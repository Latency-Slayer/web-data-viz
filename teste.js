// Importar bibliotecas da AWS
const { CostExplorerClient, GetCostAndUsageCommand } = require("@aws-sdk/client-cost-explorer");
const { CloudWatchClient, GetMetricDataCommand } = require("@aws-sdk/client-cloudwatch");

CostExplorerClient


// Configuração do cliente AWS
const awsRegiao = "us-east-1"; // ou a região da sua conta

// Cliente para Billing (faturamento)
const clienteBilling = new CostExplorerClient({ region: awsRegiao });

// Cliente para CloudWatch (monitoramento)
const clienteCloudWatch = new CloudWatchClient({ region: awsRegiao });

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

     resultado.ResultsByTime.forEach((data) => {
      //console.log(data)
      console.log(JSON.stringify(data, null, 2))
    })
    //console.log(JSON.stringify(resultado.ResultsByTime, null, 2))
    let total = 0
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
          total += (valor * -10000);
          if (!resumoPorMesEServico[mes][servico]) {
              resumoPorMesEServico[mes][servico] = 0;
        }

        resumoPorMesEServico[mes][servico] += Number(valor * -10000);
      }
      custoMensal[mes] = somaMes;
    }
    console.log("Total:", total);
    console.log("Custo mensal resumido:", custoMensal);
    console.log("Resumo de custo por serviço por mês:");
    console.log(JSON.stringify(resumoPorMesEServico, null, 2));
  } catch (erro) {
    console.error("Erro ao pegar custos:", erro);
  }
}

// Função para puxar visibilidade (ex: uso de CPU de uma instância EC2)
async function pegarUsoEC2(instanceId) {
  const comando = new GetMetricDataCommand({
    StartTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // últimas 24h
    EndTime: new Date(),
    MetricDataQueries: [
      {
        Id: "usoCPU",
        MetricStat: {
          Metric: {
            Namespace: "AWS/EC2",
            MetricName: "CPUUtilization",
            Dimensions: [{ Name: "InstanceId", Value: instanceId }],
          },
          Period: 3600,
          Stat: "Average",
        },
        ReturnData: true,
      },
    ],
  });

  try {
    const resultado = await clienteCloudWatch.send(comando);
  } catch (erro) {
    console.error("Erro ao pegar uso da EC2:", erro);
  }
}

// Chamar as funções
pegarCustosAWS();
pegarUsoEC2("i-095e820dc9a4a5bb7"); // substitua pelo ID da sua instância EC2