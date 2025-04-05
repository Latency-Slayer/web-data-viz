var usuarioModel = require("../models/usuarioModel");

function getRole(req,res){
     usuarioModel.getRole().then((resultado) => {
            res.status(200).json(resultado);
        })
}

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    console.log('SSSSSSSSSSSSSS')
    console.log(email)
    console.log(senha)

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);
                                    res.json({
                                        email: resultadoAutenticar[0].email,
                                        nome: resultadoAutenticar[0].nome,
                                        cargo: resultadoAutenticar[0].cargo,
                                        fkempresa: resultadoAutenticar[0].fkempresa,
                                        senha: resultadoAutenticar[0].senha
                                    });
                                
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } 
                    
                    else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}
function cadastrarFuncionario(req, res) {
    var nome = req.body.nomeServer;
    var gender = req.body.genderServer;
    var senha = req.body.senhaServer;
    var fkCargo = req.body.fkCargoServer;

    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (gender == undefined) {
        res.status(400).send("Seu gênero está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (fkCargo == undefined) {
        res.status(400).send("Seu cargo está undefined!");
    } else {
        
        // Select de validação de email
        /* Passou? entao cadastra /// Não passou? então retorna pro front o erro  */

        usuarioModel.cadastrarFuncionario(nome, gender, senha, fkCargo)
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
module.exports = {
    autenticar,
    cadastrarFuncionario,
    getRole
}