var database = require("../database/config");

function listar(){
    var instrucaoSql = 'SELECT idEmpresa, nome, codigo from empresa;'
    
    return database.executar(instrucaoSql);
}
function getCountry(){
    var instrucaoSql = 'SELECT id_country, name, country_code FROM country;'
    
    return database.executar(instrucaoSql);
}

function registerCompany(commercial_name, legal_name, registration_number, fkContact, fkCountry){
    var instrucaoSql = `INSERT INTO company (commercial_name, legal_name, registration_number, fk_contact, fk_country) VALUES ('${commercial_name}', '${legal_name}', '${registration_number}', '${fkContact}', '${fkCountry}');`;
    
    return database.executar(instrucaoSql);
}

function registerContactCompany(email, phone){
    var instrucaoSql = `INSERT INTO contact (email, phone) VALUES ('${email}', '${phone}');`;
    
    return database.executar(instrucaoSql);
}

module.exports = {
    listar,
    getCountry,
    registerCompany,
    registerContactCompany
}