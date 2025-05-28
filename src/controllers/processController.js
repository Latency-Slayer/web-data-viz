let ultimoProcesso = null; // guardar os ultimos dados advindos do python

function receberProcessos(req, res){
    ultimoProcesso = req.body;
     console.log("Processos recebidos:", ultimoProcesso);
    res.status(200).json({ mensagem: "Processo recebidas com sucesso" });
}

function enviarProcessos(req, res){
    if(ultimoProcesso) {
        res.status(200).json(ultimoProcesso);
    } else {
        res.status(204).send();
    }
}

module.exports = {
    receberProcessos,
    enviarProcessos
}