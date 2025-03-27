// const { text } = require("express");

const container = document.querySelector('.container');
const botaoCadastro = document.querySelector('.btn_cadastro');
const botaoLogin = document.querySelector('.btn_login');

botaoCadastro.addEventListener('click', () => {
    container.classList.add('ativado');
});

botaoLogin.addEventListener('click', () => {
    container.classList.remove('ativado');
});

window.addEventListener("scroll", function () {
    let navbar = document.getElementById("navBar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

let botao = document.getElementById('btnMenu')
let containerBtn = document.getElementById('containerBtn')
let clicked = false
let clicked2 = false

window.addEventListener('resize', () => {
if (window.innerWidth > 870) { 
    containerBtn.style.display = "none"
    botao.style.display = "block";
    console.log('teste')
}
});


botao.addEventListener('click', ()=> {
        containerBtn.style.display = "flex"
        botao.style.display = "none"
        containerBtn.classList.add('animation1')
        containerBtn.classList.remove('animation2')
        clicked = true
})

let botao2 = document.getElementById('btnMenu2')
botao2.addEventListener('click', ()=> {
    containerBtn.classList.remove('animation1')
    containerBtn.classList.add('animation2')
    setTimeout(() => {
        containerBtn.style.display = "none"
    }, 450);

    setTimeout(() => {
        botao.style.display = "block"
    }, 500);
})
// --------------- Sessão Cadastro -----------------

let arrayEmpresas = [];

function cadastrar() {
    var nomeVar = nome_ipt.value;
    var emailVar = email_ipt2.value;
    var cpfVar = cpf_ipt.value;
    var codigoVar = codigo_ipt.value;
    var senhaVar = senha_ipt2.value;
    var confirmacaoSenha = confirmeSenha_ipt.value;
    var idEmpresaVincular;

    var mensagemErro = "";


    console.log("TO PARTE 0 CADASTRO")

    if (nomeVar == "" ||
        emailVar == "" ||
        cpfVar == "" ||
        codigoVar == "" ||
        senhaVar == "" ||
        confirmacaoSenha == ""
    ) {
        Swal.fire({
            title: "erro ao realizar cadastro",
            text: "Algum campo vazio",
            icon: 'error',
            timer: 2500
        })
        // Não passar enquanto tive algum campo vazio
        return;
    }


    // Caracteres Esp. = !@#$%
    var email_ok = false;
    var senhaIgual = false;
    var caractereEspecial = false;
    var cpf_ok = false;
    var senha_ok = false;
    var number_ok = false;
    var letraMinuscula_ok = false;
    var letraMaiuscula_ok = false;

    console.log("TO PARTE 1 CADASTRO")

    console.log("TO PARTE x CADASTRO")

    if (emailVar.includes('@') && emailVar.includes('.')) {
        email_ok = true;
    } else {
        mensagemErro += "Email invalido,"
    }

    if (cpfVar.length != 11 || isNaN(cpfVar)) {
        mensagemErro += 'CPF invalido,'
    } else {
        cpf_ok = true;
    }

    if (senhaVar == confirmacaoSenha) {
        senhaIgual = true;
    }

     
    console.log("aaaaa")

    console.log(email_ok)
    console.log(senhaIgual)
    console.log(caractereEspecial)
    console.log(cpf_ok)
    console.log(senha_ok)
    console.log(number_ok)
    console.log(letraMinuscula_ok)
    console.log(letraMaiuscula_ok)
    

    if ((senhaVar != "" || confirmacaoSenha != '')) {
        if (senhaVar.length < 8) {
            mensagemErro += "Senha sem quantidade necessaria de caracteres, "
        } else {
            senha_ok = true;
            for (let i = 0; i < senhaVar.length; i++) {
                const letraAtual = senhaVar[i];
                var letraMaius = letraAtual.toUpperCase();
                var letraMinus = letraAtual.toLowerCase();

                if (letraAtual.includes('@') ||
                    letraAtual.includes('!') ||
                    letraAtual.includes('#') ||
                    letraAtual.includes('$') ||
                    letraAtual.includes('%')
                ) {
                    caractereEspecial = true;
                } else if (isNaN(letraAtual)) {
                    if (letraAtual == letraMaius) {
                        letraMaiuscula_ok = true;
                    }
                    if (letraAtual == letraMinus) {
                        letraMinuscula_ok = true;
                    }
                }
                if (!isNaN(letraAtual)) {
                    number_ok = true;
                }
            }
        }

        if (caractereEspecial == false) {
            mensagemErro += "\n Adicione caracter especial (!@#$%), "
        }
        if (number_ok == false) {
            mensagemErro += "\n Adicione numeros a sua senha (1235), "
        }
        if (letraMinuscula_ok == false) {
            mensagemErro += "\n Adicione letra minuscula a sua senha, "
        }
        if (letraMaiuscula_ok == false) {
            mensagemErro += "\n Adicione letra maiscula a sua senha, "
        }
        else if (!senhaIgual) {
            mensagemErro += ", Senha não está igual a confirmação"
        }

        console.log("TO PARTE 2 CADASTRO")

        console.log(email_ok)
        console.log(senhaIgual)
        console.log(caractereEspecial)
        console.log(cpf_ok)
        console.log(senha_ok)
        console.log(number_ok)
        console.log(letraMinuscula_ok)
        console.log(letraMaiuscula_ok)

        if (!email_ok ||    
            !senhaIgual ||
            !caractereEspecial ||
            !cpf_ok ||
            !senha_ok ||
            !number_ok ||
            !letraMinuscula_ok ||
            !letraMaiuscula_ok) {
            
                Swal.fire({
                    title: "erro ao realizar cadastro",
                    text: mensagemErro,
                    icon: 'error',
                    timer: 2500
                })

                return;
    
        }

        for (let i = 0; i < arrayEmpresas.length; i++) {
            if (arrayEmpresas[i].codigo == codigoVar) {
                idEmpresaVincular = arrayEmpresas[i].idEmpresa
                console.log("Codigo valido")
            }

            else {
                console.log("Codigo Invalido")
            }

        }

        fetch('/usuarios/cadastrar', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nomeServer: nomeVar,
                emailServer: emailVar,
                cpfServer: cpfVar,
                senhaServer: senhaVar,
                idEmpresaVincularServer: idEmpresaVincular
            })
        }).then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                console.log("Dados Cadastrados")
                const button = document.getElementById("alerta")

                Swal.fire({
                    title: "Cadastro Realizado com sucesso!",
                    icon: "success",
                    timer: 2500
                });

                var container = document.querySelector('.container');
                container.classList.remove('ativado');
            } else {
                Swal.fire({
                    title: "erro ao realizar cadastro",
                    text: mensagemErro,
                    icon: 'error',
                    timer: 2500
                })

                throw "erro ao tentar realizar o cadastro!";
            }

        }).catch(function (resposta) {
            console.log("ERRO;", resposta)
        })


    }


}

function listarEmpresas() {

    fetch("/empresas/listar", {
        method: 'GET',
    })
        .then(function (resposta) {
            resposta.json().then(function (json) {
                console.log(json)
                arrayEmpresas = json


                // json.forEach((empresa) => {
                //     arrayEmpresas.push(empresa)
                //     console.log(resposta.ok)
                //     console.log(arrayEmpresas[0].codigo)
                // });
            })

        }).catch(function (resposta) {
            console.log(resposta)
        })
}



// --------------- Sessão Login -----------------
function entrar() {
    var emailVar = email_ipt.value;
    var senhaVar = senha_ipt.value;

    fetch("/usuarios/autenticar", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            emailServer: emailVar,
            senhaServer: senhaVar
        })
    }).then(function (resposta) {
        console.log("entrei no then do entrar()!!")
        resposta.json().then(function (json) {
            console.log(json)

            sessionStorage.NOME_USUARIO = json.nome;
            sessionStorage.EMAIL_USUARIO = json.email;
            sessionStorage.CARGO_USUARIO = json.cargo;
            sessionStorage.ID_EMPRESA = json.fkempresa;

            if (json.cargo == "analista") {
                window.location = "./dashs/analiticoGeral.html"
            } else if (json.cargo == "suporte") {
                window.location = "./dashs/suporte.html"
            } else if (json.cargo == "gestor") {
                window.location = "./dashs/gestor.html"
            }

        })

    }).catch(function (resposta) {
        console.log(resposta)
    })
}