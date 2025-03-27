var database = require("../database/config");

function listar(){
    var instrucaoSql = 'SELECT idEmpresa, nome, codigo from empresa;'
    
    return database.executar(instrucaoSql);
}

module.exports = {
    listar
}