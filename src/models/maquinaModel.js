var database = require("../database/config")

function autenticar() {
    var instrucaoSql = `
       select * from maquina_servidor join centro_servidores on fkCentroServidor = idServidores;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function autenticarUsers() {
    var instrucaoSql = `
       select idUsuarios, u.nome, u.cargo, dataRegistro, e.nome as empresa_nome from usuarios as u join empresa as e on fkEmpresa  = idEmpresa;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(codigo, ram, disco, cpu) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():")
   
    var instrucaoSql = `INSERT INTO maquina_servidor (codigoMaquina, modeloRam, modeloCpu, modeloDisk) VALUES ('${codigo}', '${ram}', '${disco}', '${cpu}');`;
    console.log( instrucaoSql);
    return database.executar(instrucaoSql);
}

function pesquisa(ipt_pesquisa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():")
   
    var instrucaoSql = `select * from maquina_servidor join centro_servidores on fkCentroServidor = idServidores where codigoMaquina like '${ipt_pesquisa}%';`;
    console.log( instrucaoSql);
    return database.executar(instrucaoSql);
}

function pesquisaUsers(ipt_pesquisa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():")
   
    var instrucaoSql = `select idUsuarios, u.nome, u.cargo, dataRegistro, e.nome as empresa_nome from usuarios as u join empresa as e on fkEmpresa  = idEmpresa where u.nome like '${ipt_pesquisa}%';`
    console.log( instrucaoSql);
    return database.executar(instrucaoSql);
}

function cargoUsers(cargo, idUser) {
    console.log("ACESSEI O MAQUINA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():")
   
    var instrucaoSql = `UPDATE usuarios set cargo = '${cargo}' where idUsuarios = ${idUser};`
    console.log( instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
   autenticar,
   cadastrar,
   pesquisa,
   autenticarUsers,
   pesquisaUsers,
   cargoUsers
};