let ultimaMetrica = null; // guardar os ultimos dados advindos do python

//Função para receber os dados do Python via POST
function receberDados(req, res) {
    ultimaMetrica = req.body;
    console.log("Métricas recebidas:", ultimaMetrica);
    res.status(200).json({ mensagem: "Métricas recebidas com sucesso" });
}

//Função para enviar os dados para o Front via GET
function enviarDados(req, res) {
    if (ultimaMetrica) { // se recebeu métrica, retorna os dados
        res.status(200).json(ultimaMetrica);
    } else { // se não recebeu retorna conteudo vazio
        res.status(204).send(); 
    }
}

module.exports = {
    receberDados,
    enviarDados
};