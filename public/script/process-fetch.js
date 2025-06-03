let estadoOrdenacao = {
    campo: null,
    crescente: false
};

function getMotherboardId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("tag");
}

function getProcess() {
    const motherboardId = getMotherboardId();

    fetch("/process/api/real-time", {
        method: 'GET'
    }).then(function (resposta) {
        if (resposta.status === 204) {
            console.log("Nenhum dado disponível ainda.");
            return null;
        }
        return resposta.json();
    }).then(function (json) {
        let processosMap = new Map(json);

        console.log("Processos recebidos:", processosMap);

        const dadosServidor = processosMap.get(motherboardId);
        console.log("Dados do servidor encontrados:", dadosServidor);

        let processos = dadosServidor.process.process_data;

        if (estadoOrdenacao.campo) {
            processos = ordenarProcessos(processos, estadoOrdenacao.campo, estadoOrdenacao.crescente);
        }

        mostrarProcessos(processos);
    })
        .catch(function (erro) {
            console.error("Erro ao buscar métricas:", erro);
        });
}

function mostrarProcessos(processos) {
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";

    processos.forEach((proc, index) => {
        const row = document.createElement("tr");

        const usoCpu = parseFloat(proc.cpu_percent);
        const usoRAM = parseFloat(proc.ram_percent);

        let criticidadeClass = "";

        if (usoCpu >= 15 || usoRAM >= 15) {
            criticidadeClass = "danger";
        } else if (usoCpu >= 8 || usoRAM >= 1) {
            criticidadeClass = "warning";
        }

        const nome = proc.name || 'N/A';
        const pid = proc.pid || 0;
        const status = proc.status === "running" ? "Rodando" : "Parado";

        row.innerHTML = `
            <td><div class="criticidade ${criticidadeClass}"></div></td>
            <td>${pid}</td>
            <td class="nome-processo">${nome}</td>
            <td>${usoCpu.toFixed(2)}%</td>
            <td>${usoRAM.toFixed(2)}%</td>
            <td>${status}</td>
        `;

        tbody.appendChild(row);
    });
}

function ordenarProcessos(processos, campo, crescente = false) {
    return processos.sort((a, b) => {
        let valorAnterior = a[campo];
        let valorDepois = b[campo];

        if (valorAnterior == null) {
            valorAnterior = 0;
        }
        if (valorDepois == null) {
            valorDepois = 0;
        }

        if (valorAnterior === valorDepois) {
            return 0;
        }

        if (crescente) {
            return valorAnterior > valorDepois ? 1 : -1;
        } else {
            return valorAnterior > valorDepois ? -1 : 1;
        }
    });
}

setInterval(getProcess, 2000);