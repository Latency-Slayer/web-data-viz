let ultimoProcesso = new Map(); // guardar os ultimos dados advindos do python

function receberProcessos(req, res){
    const id = req.body.motherboardId;

    ultimoProcesso.set(id, req.body);
    console.log("Processos recebidas:", ultimoProcesso);
    res.status(200).json({ mensagem: "Processos recebidos com sucesso" });
}

function enviarProcessos(req, res){
    console.log([...ultimoProcesso])
    res.json([...ultimoProcesso])
}

module.exports = {
    receberProcessos,
    enviarProcessos
}