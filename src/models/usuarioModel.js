var database = require("../database/config")

function autenticar(email, senha) {
    console.log("EERO NO MODEL AUTENTICAR")
    var instrucaoSql = `SELECT nome, email, cargo, senha, fkempresa from usuarios where email = '${email}' AND senha = '${senha}'`;
    return database.executar(instrucaoSql);
}

function cadastrar(nome, email, cpf, senha, fkEmpresa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():")
   
    var instrucaoSql = `INSERT INTO usuarios (nome, email, cpf, senha, fkEmpresa) VALUES ('${nome}', '${email}', '${cpf}', '${senha}', ${fkEmpresa});`;
    console.log( instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar
};