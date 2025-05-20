let servidoresDatas = []

function getServers() {
    fetch("/server/listarServidores", {
        method: 'GET',
    }).then(resposta => resposta.json())
        .then(servidores => {
        
        // Tempo Real armazenando em um array
        servidoresDatas = servidores;

        //Salvar no card e usar no component alert-card
        mostrarCards(servidores);
        console.log(servidores);

        //Pegando os dados de cada servidor pela motherboardID
        servidores.forEach(server => {
            getData(server.motherboard_id);
        })

        })
        .catch(erro => console.log("Erro ao buscar servidores:", erro));
}


function getData(motherboard_id) {
    fetch(`/hardware/api/real-time?tag=${motherboard_id}`, {
        method: 'GET'
    })
        .then(resposta => resposta.json())
        .then(data => {
            console.log(data)
            console.log(`Métricas do servidor ${motherboard_id}:`, data);

            //Alert card de acordo com a motherboard
            const card = document.querySelector(`alert-card[motherboardid="${motherboard_id}"]`);
            
            //Atualizar as metricas e puxar elas
            card.updateMetrics({
                cpu: data.metrics.cpu_percent,
                ram: data.metrics.ram_percent,
                disco: data.metrics.disk_percent,
                datetime: data.metrics.timestamp
            });
        })
        .catch(erro => console.error(`Erro ao buscar métricas do servidor ${motherboard_id}:`, erro));
}

// Função para atualizar o component e ser dinâmica para adicionar o card
function mostrarCards(servidores) {
    const container = document.getElementById("server-container");
    container.innerHTML = ""; 

    servidores.forEach(server => {
        const card = document.createElement("alert-card");
        card.setAttribute("tagName", server.tag_name);
        card.setAttribute("motherboardid", server.motherboard_id);
        container.appendChild(card);
    });
}


// setInterval(() => {
//     document.querySelectorAll("alert-card").forEach(card => {
//         const tagName = card.getAttribute("tagName");
//         const metricas = getData(tagName); 
//         card.updateMetrics(metricas[tagName]);
//     });
// }, 2000);

setInterval(() => {
    document.querySelectorAll("alert-card").forEach(card => {
        const motherboardId = card.getAttribute("motherboardid");
        getData(motherboardId); 
    });
}, 2000);