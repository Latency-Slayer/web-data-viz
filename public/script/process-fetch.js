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
    tbody.innerHTML = ""; // limpa as linhas anteriores

    processos.forEach(proc => {
        const row = document.createElement("tr");

        // Classificação por CPU
        const usoCpu = parseFloat(proc.cpu_percent);
        const usoRam = parseFloat(proc.ram_percent);
        
        if (usoCpu >= 15) {
            row.classList.add("danger");
        } else {
            row.classList.add("warning");
        }

        row.innerHTML = `
            <td>${proc.pid ?? 0}</td>
            <td>${proc.name}</td>
            <td>${(proc.cpu_percent / 100).toFixed(2)}%</td>
            <td>${(proc.ram_gb).toFixed(2)}GB</td>
            <td>${(proc.ram_percent * 10).toFixed(2)}%</td>
            <td>${proc.status === "running" ? "Rodando" : "Parado"}</td>
        `;

        tbody.appendChild(row);
    });
}


setInterval(getProcess, 2000);