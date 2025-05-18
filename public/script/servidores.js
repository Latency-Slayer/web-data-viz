function getServers() {
    fetch("/server/listarServidores", {
        method: 'GET',
    })
        .then(resposta => resposta.json())
        .then(json => {
            console.log(json);
            mostrarCards(json); // Passa o array que veio do backend
        })
        .catch(erro => console.log(erro));
}

function mostrarCards(servidores) {
    const container = document.getElementById("server-container");
    container.innerHTML = ""; // limpa os cards anteriores

    servidores.forEach(server => {
        const card = document.createElement("alert-card");

        card.setAttribute("criticality", server.active ? "Ativo" : "Inativo"); // ex: usar active
        card.setAttribute("tagName", server.tag_name || "Servidor");
        card.setAttribute("cpu", server.cpu ? server.cpu + "%" : "N/A");
        card.setAttribute("ram", server.ram ? server.ram + "%" : "N/A");
        card.setAttribute("disco", server.disk ? server.disk + "%" : "N/A");
        card.setAttribute("datetime", `Cidade: ${server.city || "Desconhecida"}`);

        container.appendChild(card);
    });
}