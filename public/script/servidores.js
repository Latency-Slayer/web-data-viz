let servidoresDatas = []

let limitesMaximos = {}
let limitesMinimos = {}

async function getServers() {
    try {
        const resposta = await fetch("/server/listarServidores", { method: 'GET' });
        const servidores = await resposta.json();

        servidoresDatas = servidores;
        mostrarCards(servidores);
        console.log(servidores);

        for (const server of servidores) {
            console.log("Processando servidor:", server.motherboard_id);
            //chama o getLimitComponent e por ser um await retorna uma Promisa, então ele espera retornar uma resposta antes de prosseguir
            await getLimitComponent(server.motherboard_id);
            await getData(server.motherboard_id);
        }

        console.log("Todos os servidores processados!");
    } catch (erro) {
        console.log("Erro ao buscar servidores:", erro);
    }
}

function getData(motherboard_id) {
    //Usar encodeURI por que alguns servidores começam com / e da problema na url
    fetch(`/hardware/api/real-time?tag=${encodeURIComponent(motherboard_id)}`, { method: 'GET' })
        .then(resposta => resposta.json())
        .then(data => {
            console.log(data)
            console.log(`Métricas do servidor ${motherboard_id}:`, data);

            const card = document.querySelector(`alert-card[motherboardid="${motherboard_id}"]`);

            const limiteMax = limitesMaximos[motherboard_id];

            // Ver qual servidor ele está com problmeas na leitura dos limites
            if (!limiteMax) {
                console.warn(`Limites não encontrados para ${motherboard_id}`);
                return;
            }

            card.updateMetrics({
                cpu: data.metrics.cpu_percent,
                ram: data.metrics.ram_percent,
                disco: data.metrics.disk_percent,
                datetime: data.metrics.timestamp,
                limiteCPU: limiteMax.cpu,
                limiteRAM: limiteMax.ram,
                limiteDisco: limiteMax.storage,
            });
        })
        .catch(erro => console.error(`Erro ao buscar métricas do servidor ${motherboard_id}:`, erro));
}

function getLimitComponent(motherboard_id) {
    fetch(`/server/getLimitComponent/${encodeURIComponent(motherboard_id)}`, { method: 'GET' })
        .then(resposta => resposta.json())
        .then(data => {
            console.log(data)
            console.log(`Limites do servidor ${motherboard_id}:`, data);

            limitesMaximos[motherboard_id] = {};
            limitesMinimos[motherboard_id] = {};

            data.forEach(item => {
                limitesMaximos[motherboard_id][item.type] = item.max_limit;

                const el = document.getElementById(item.type + "_limit");
                if (el) {
                    el.textContent = item.max_limit + "%";
                } else {
                    console.log("Erro de chamada")
                }
            });
        })
        .catch(erro => console.error(`Erro ao buscar limites do servidor ${motherboard_id}:`, erro));
}

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

setInterval(() => {
    servidoresDatas.forEach((server) => {
        getData(server.motherboard_id)
    })
}, 2000);