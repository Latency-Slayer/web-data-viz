var database = require("../database/config")

function autenticar(email, senha) {
    console.log("EERO NO MODEL AUTENTICAR")
    var instrucaoSql = `SELECT nome, email, cargo, senha, fkempresa from usuarios where email = '${email}' AND senha = '${senha}'`;
    return database.executar(instrucaoSql);
}

function getRole(){
    var instrucaoSql = 'SELECT id_opt_role, name, description FROM opt_role;'
        
    return database.executar(instrucaoSql);
}

function registerUser(name, gender, password, fkRole,fkContact, fkCompany) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():")
   
    var instrucaoSql = `INSERT INTO employee (name, gender, password,fk_role, fk_contact,fk_company) VALUES ('${name}', '${gender}','${password}','${fkRole}', '${fkContact}','${fkCompany}');`;
    console.log( instrucaoSql);
    return database.executar(instrucaoSql);
}

function registerContactUser(email, phone) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():")
   
    var instrucaoSql = 
    `
    INSERT INTO contact (email, phone) VALUES ('${email}', '${phone}');
    `;
    console.log( instrucaoSql);
    return database.executar(instrucaoSql);
}



module.exports = {
    autenticar,
    registerUser,
    registerContactUser,
    getRole
};