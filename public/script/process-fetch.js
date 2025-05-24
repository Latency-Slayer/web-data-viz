let estadoOrdenacao = {
    campo: null, 
    crescente: false
};
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
        let processos = json.process.process_data
        console.log("Processos recebidos:", processos);
        processos = ordenarProcessos(processos, estadoOrdenacao.campo, estadoOrdenacao.crescente)
        mostrarProcessos(processos);

    })
        .catch(function (erro) {
            console.error("Erro ao buscar métricas:", erro);
        });
}

function mostrarProcessos(processos) {
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = "";

    processos.forEach(proc => {
        const row = document.createElement("tr");

        const usoCpu = parseFloat(proc.cpu_percent);
        
        let criticidadeClass = "";
        if (usoCpu >= 15) {
            criticidadeClass = "danger";
        } else if (usoCpu >= 8) {
            criticidadeClass = "warning";
        }

        row.innerHTML = `
            <td><div class="criticidade ${criticidadeClass}"></div></td>
            <td>${proc.pid ?? 0}</td>
            <td class="nome-processo">${proc.name}</td>
            <td>${proc.cpu_percent.toFixed(2)}%</td>
            <td>${proc.ram_mb.toFixed(2)}MB</td>
            <td>${proc.status === "running" ? "Rodando" : "Parado"}</td>
        `;

        tbody.appendChild(row);
    });
}

function ordenarProcessos(processos, campo, crescente = false) {
    return processos.sort((a, b) => {
        const valA = a[campo] ?? 0;
        const valB = b[campo] ?? 0;

        if (valA < valB) {
            return crescente ? -1 : 1;
        }
        if (valA > valB) {
            return crescente ? 1 : -1;
        } 
        return 0;
    });
}


setInterval(getProcess, 2000);