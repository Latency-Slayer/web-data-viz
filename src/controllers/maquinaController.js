var maquinaModel = require("../models/maquinaModel");

function autenticar(req, res) {
    maquinaModel.autenticar()
        .then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("houve um erro ao puxar dados ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function autenticarUsers(req, res) {
    maquinaModel.autenticarUsers()
        .then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("houve um erro ao puxar dados ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function cadastrar(req, res) {
    var codigo = req.body.codigoServer
    var ram = req.body.ramServer
    var disco = req.body.discoServer
    var cpu = req.body.cpuServer

    if (codigo == undefined) {
        res.status(400).send("Seu campo codigo está undefined!");
    } else if (ram == undefined) {
        res.status(400).send("Seu campo ram está undefined!");
    } else if (disco == undefined) {
        res.status(400).send("Seu campo disco está undefined!");
    } else if (cpu == undefined) {
        res.status(400).send("Seu campo cpu está undefined!");
    } else {
        
        // Select de validação de email
        /* Passou? entao cadastra /// Não passou? então retorna pro front o erro  */

        maquinaModel.cadastrar(codigo, ram, disco, cpu)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}


function pesquisa(req, res) {
    var ipt_pesquisa = req.body.pesquisaServer

    if (ipt_pesquisa == undefined) {
        res.status(400).send("Seu campo pesquisa está undefined!");
    } else {

        maquinaModel.pesquisa(ipt_pesquisa)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar a pesquisa! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function pesquisaUsers(req, res) {
    var ipt_pesquisa = req.body.pesquisaServer

    if (ipt_pesquisa == undefined) {
        res.status(400).send("Seu campo pesquisa está undefined!");
    } else {

        maquinaModel.pesquisaUsers(ipt_pesquisa)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar a pesquisa! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function cargoUsers(req, res) {
    var cargo = req.body.cargoServer
    var idUser = req.body.userIdServer

    if (cargo == undefined) {
        res.status(400).send("Seu campo cargo está undefined");
    } else {
        maquinaModel.cargoUsers(cargo, idUser)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao realizar o cadastro de cargos! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage)
            }
        );
    }
}

module.exports = {
    autenticar,
    cadastrar,
    pesquisa,
    autenticarUsers,
    pesquisaUsers,
    cargoUsers
  };