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
            await getLimitComponent(server.motherboard_id);
        }

        await getDataFromMap();
        console.log("Todos os servidores processados!");
    } catch (erro) {
        console.log("Erro ao buscar servidores:", erro);
    }
}

async function getDataFromMap() {
    try {
        const resposta = await fetch("/hardware/api/real-time", { method: 'GET' });
        const dadosArray = await resposta.json();
        const metricas = new Map(dadosArray);
        
        console.log("Métricas do Map:", metricas);
        
        // Atualizar cada servidor com os dados do Map
        metricas.forEach((data, motherboard_id) => {
            updateServerCard(motherboard_id, data);
        });
        
    } catch (erro) {
        console.error("Erro ao buscar métricas do Map:", erro);
    }
}

function updateServerCard(motherboard_id, data) {
    const card = document.querySelector(`alert-card[motherboardid="${motherboard_id}"]`);
    
    card.updateMetrics({
        cpu: data.metrics.cpu_percent ,
        ram: data.metrics.ram_percent,
        disco: data.metrics.disk_percent,
        datetime: data.metrics.timestamp,
        limiteCPU: data.limites.cpu,
        limiteRAM: data.limites.ram,
        limiteDisco: data.limites.storage,
    });
}

function getData(motherboard_id) {
    fetch(`/hardware/api/real-time?tag=${encodeURIComponent(motherboard_id)}`, { method: 'GET' })
        .then(resposta => resposta.json())
        .then(data => {
            console.log(`Métricas individuais do servidor ${motherboard_id}:`, data);
            updateServerCard(motherboard_id, data.metrics);
        })
        .catch(erro => console.error(`Erro ao buscar métricas do servidor ${motherboard_id}:`, erro));
}

function getLimitComponent(motherboard_id) {
    fetch(`/server/getLimitComponent/${encodeURIComponent(motherboard_id)}`, { method: 'GET' })
        .then(resposta => resposta.json())
        .then(data => {
            console.log(`Limites do servidor ${motherboard_id}:`, data);

            limitesMaximos[motherboard_id] = {};
            limitesMinimos[motherboard_id] = {};

            data.forEach(item => {
                limitesMaximos[motherboard_id][item.type] = item.max_limit;

                const el = document.getElementById(item.type + "_limit");
                if (el) {
                    el.textContent = item.max_limit + "%";
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

function obterValorCampo(card, campo) {
    if (campo === 'criticality') {
        const critEl = card.shadowRoot.querySelector('.criticality');
        if (critEl) {
            return critEl.textContent;
        }
        return null;
    }
    return card.getAttribute(campo);
}

function ordenarCardsPorCriticidade() {
    const container = document.getElementById("server-container");
    const cards = Array.from(container.querySelectorAll('alert-card'));

    const prioridade = {
        'Crítico': 3,
        'Atenção': 2,
        'Normal': 1
    };

    cards.sort((a, b) => {
        const critA = obterValorCampo(a, 'criticality');
        const critB = obterValorCampo(b, 'criticality');

        const valA = prioridade[critA] || 0;
        const valB = prioridade[critB] || 0;

        return valB - valA;  // maior prioridade primeiro
    });

    // verifica se a posição dele mudou, para não ficar piscando toda hora, e mantem nessa opsição que ele ficou
    cards.forEach((card, index) => {
        if (container.children[index] !== card) {
            container.insertBefore(card, container.children[index]);
        }
    });
}


setInterval(() => {
    getDataFromMap(); 
    ordenarCardsPorCriticidade();
}, 3000);