var database = require("../database/config")

function login(email, password) {
    console.log("EERO NO MODEL AUTENTICAR")
    var instrucaoSql = 
    `SELECT c.email, e.password, o.id_opt_role, comp.id_company, comp.commercial_name from employee as e JOIN contact as c ON e.fk_contact = c.id_contact 
     JOIN opt_role as o ON e.fk_role = o.id_opt_role JOIN company as comp ON e.fk_company = comp.id_company where c.email = '${email}' AND e.password = '${password}'
    `;
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
    login,
    registerUser,
    registerContactUser,
    getRole
};