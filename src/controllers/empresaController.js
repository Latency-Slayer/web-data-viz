var empresaModel = require("../models/empresaModel")
var usuarioModel = require("../models/usuarioModel")

function listar(req,res){
    empresaModel.listar().then((resultado) => {
        res.status(200).json(resultado);
    })
}

function getCountry(req,res){
    empresaModel.getCountry().then((resultado) => {
        res.status(200).json(resultado);
    })
}

function registerCompanyAndUser(req, res) {
    var comercialNameCompany = req.body.commercialNameCompanyServer;
    var legalNameCompany = req.body.legalNameCompanyServer;
    var numberFiscalCompany = req.body.numberFiscalCompanyServer;

    var fkCountryCompany = req.body.countryCompanyServer;
    var emailCompany = req.body.emailCompanyServer;
    var phoneCompany = req.body.phoneCompanyServer;

    var nameUser = req.body.nameUserServer;
    var passwordUser = req.body.passwordUserServer;
    var genderUser = req.body.genderUserServer;
    var emailUser = req.body.emailUserServer;
    var phoneUser = req.body.phoneUserServer;
    
    empresaModel.registerContactCompany(emailCompany, phoneCompany)
        .then(function (resultadoContato) {
            const fk_contact = resultadoContato.insertId;

            return empresaModel.registerCompany(comercialNameCompany, legalNameCompany, numberFiscalCompany, fk_contact, fkCountryCompany);
        })
        .then(function (resultadoEmpresa) {
            const idCompany = resultadoEmpresa.insertId;

            return usuarioModel.registerContactUser(emailUser, phoneUser) 
                .then(function (resultadoContatoUser) {
                    const idContactUser = resultadoContatoUser.insertId;

                    return usuarioModel.registerUser(nameUser,genderUser,passwordUser,1,idContactUser,idCompany);
                })
                .then(function (resultadoUsuario) {
                    res.json({
                        mensagem: "Empresa, contato e usuário administrador cadastrados com sucesso.",
                        resultadoUsuario: resultadoUsuario
                    });
                });
        })
        .catch(function (erro) {
            console.log("Erro ao cadastrar:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}


module.exports = {
    listar,
    getCountry,
    registerCompanyAndUser,
}