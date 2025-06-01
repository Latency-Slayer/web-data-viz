let ultimaMetrica = new Map() // guardar os ultimos dados advindos do python

//Função para receber os dados do Python via POST
function receberDados(req, res) {
    const id = req.body.motherboardId;

    ultimaMetrica.set(id, req.body);
    
    console.log("Métricas recebidas:", ultimaMetrica);
    res.status(200).json({ mensagem: "Métricas recebidas com sucesso" });
}

function enviarDados(req, res) {
    console.log([...ultimaMetrica])
    res.json([...ultimaMetrica])
}

module.exports = {
    receberDados,
    enviarDados
};