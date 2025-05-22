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
            console.log("Processos recebidos:", json.process.process_data);
            mostrarProcessos(json.process.process_data);
        } else {
            console.warn("Formato inesperado do JSON:", json);
        }
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
            <td>${proc.ram_percent.toFixed(2)}%</td>
            <td>${proc.status === "running" ? "Rodando" : "Parado"}</td>
        `;

        tbody.appendChild(row);
    });
}


setInterval(getProcess, 2000);