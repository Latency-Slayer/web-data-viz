const container = document.querySelector('.container');
const botaoCadastro = document.querySelector('.btn_cadastro');
const botaoLogin = document.querySelector('.btn_login');
const url = new URL(location)

window.onload = () => {
    const cadastroValue = url.searchParams.get("cadastro");

    if (cadastroValue == "true") {
        container.classList.add('ativado');
    }

    const transicao = document.querySelectorAll(".transicao");

    console.log(transicao)

    transicao.forEach(el => {
        el.classList.add("ativar_transicao");
        el.offsetWidth
    })
}

botaoCadastro.addEventListener('click', () => {
    url.searchParams.set("cadastro", "true");
    history.pushState({}, "", url);

    container.classList.add('ativado');
});

botaoLogin.addEventListener('click', () => {
    url.searchParams.set("cadastro", "false");
    history.pushState({}, "", url);

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


botao.addEventListener('click', () => {
    containerBtn.style.display = "flex"
    botao.style.display = "none"
    containerBtn.classList.add('animation1')
    containerBtn.classList.remove('animation2')
    clicked = true
})

let botao2 = document.getElementById('btnMenu2')
botao2.addEventListener('click', () => {
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

let arrayCountrys = [];
let arraysRoles = [];

// 
document.addEventListener("DOMContentLoaded", function () {
    let steps = ["step1", "step2", "step3", "step4"];
    let currentStep = 0;

    let btnNext = document.getElementById("btn_next");
    let btnBack = document.getElementById("btn_back");
    let btnRegister = document.getElementById("btn_register");
    let register_company_user = document.getElementById("register_company_user");

    function updateSteps() {
        document.getElementById(steps[0]).style.display = "none";
        document.getElementById(steps[1]).style.display = "none";
        document.getElementById(steps[2]).style.display = "none";
        document.getElementById(steps[3]).style.display = "none";

        btnRegister.style.display = "none"
        document.getElementById(steps[currentStep]).style.display = "block";

        if (currentStep >= 1    ) {
            btnBack.style.display = "block";
        } else {
            btnBack.style.display = "none";
        }
        if (currentStep >= 2) {
            register_company_user.textContent = "Cadastrar Usuário"    
        } else {
            register_company_user.textContent = "Cadastrar Empresa"    
        }

        if (currentStep == 3) {
            btnNext.style.display = "none";
            btnRegister.style.display = "block"
        } else {
            btnNext.textContent = "Próximo"
            btnNext.style.display = "block"
        }
        
    }

    btnNext.addEventListener("click", function () {
        if (currentStep < steps.length - 1) {
            currentStep++;
            updateSteps();
        }
    });
    btnBack.addEventListener("click", function () {
        if (currentStep > 0) {
            currentStep--;
            updateSteps();
        }
    });

    updateSteps();
});

function register() {
    var commercialNameCompanyVar = ipt_commercial_name.value;
    var legalNameCompanyVar = ipt_legal_name.value;
    var numberFiscalCompanyVar = ipt_number_fiscal.value;
    
    var countryCompanyVar = slt_country_company.value;
    var emailCompanyVar = ipt_email_company.value;
    var phoneCompanyVar = ipt_phone_company.value;

    var nameUserVar = ipt_name_user.value;
    var genderUserVar = slt_gender.value;
    var passwordUserVar = ipt_password_user.value;
    var confirmPasswordUserVar = ipt_confirm_password.value

    var emailUserVar = ipt_email_user.value
    var phoneUserVar = ipt_phone_user.value
    // var idEmpresaVincular;

    var mensagemErro = "";


    // console.log("TO PARTE 0 CADASTRO")

    // // Caracteres Esp. = !@#$%
    // var email_ok = false;
    // var senhaIgual = false;
    // var caractereEspecial = false;
    // var cpf_ok = false;
    // var senha_ok = false;
    // var number_ok = false;
    // var letraMinuscula_ok = false;
    // var letraMaiuscula_ok = false;

    // console.log("TO PARTE 1 CADASTRO")

    // console.log("TO PARTE x CADASTRO")

    // if (emailVar.includes('@') && emailVar.includes('.')) {
    //     email_ok = true;
    // } else {
    //     mensagemErro += "Email invalido,"
    // }

    // if (cpfVar.length != 11 || isNaN(cpfVar)) {
    //     mensagemErro += 'CPF invalido,'
    // } else {
    //     cpf_ok = true;
    // }

    // if (senhaVar == confirmacaoSenha) {
    //     senhaIgual = true;
    // }


    // console.log("aaaaa")

    // console.log(email_ok)
    // console.log(senhaIgual)
    // console.log(caractereEspecial)
    // console.log(cpf_ok)
    // console.log(senha_ok)
    // console.log(number_ok)
    // console.log(letraMinuscula_ok)
    // console.log(letraMaiuscula_ok)


    // if ((senhaVar != "" || confirmacaoSenha != '')) {
    //     if (senhaVar.length < 8) {
    //         mensagemErro += "Senha sem quantidade necessaria de caracteres, "
    //     } else {
    //         senha_ok = true;
    //         for (let i = 0; i < senhaVar.length; i++) {
    //             const letraAtual = senhaVar[i];
    //             var letraMaius = letraAtual.toUpperCase();
    //             var letraMinus = letraAtual.toLowerCase();

    //             if (letraAtual.includes('@') ||
    //                 letraAtual.includes('!') ||
    //                 letraAtual.includes('#') ||
    //                 letraAtual.includes('$') ||
    //                 letraAtual.includes('%')
    //             ) {
    //                 caractereEspecial = true;
    //             } else if (isNaN(letraAtual)) {
    //                 if (letraAtual == letraMaius) {
    //                     letraMaiuscula_ok = true;
    //                 }
    //                 if (letraAtual == letraMinus) {
    //                     letraMinuscula_ok = true;
    //                 }
    //             }
    //             if (!isNaN(letraAtual)) {
    //                 number_ok = true;
    //             }
    //         }
    //     }

    //     if (caractereEspecial == false) {
    //         mensagemErro += "\n Adicione caracter especial (!@#$%), "
    //     }
    //     if (number_ok == false) {
    //         mensagemErro += "\n Adicione numeros a sua senha (1235), "
    //     }
    //     if (letraMinuscula_ok == false) {
    //         mensagemErro += "\n Adicione letra minuscula a sua senha, "
    //     }
    //     if (letraMaiuscula_ok == false) {
    //         mensagemErro += "\n Adicione letra maiscula a sua senha, "
    //     }
    //     else if (!senhaIgual) {
    //         mensagemErro += ", Senha não está igual a confirmação"
    //     }

    //     console.log("TO PARTE 2 CADASTRO")

    //     console.log(email_ok)
    //     console.log(senhaIgual)
    //     console.log(caractereEspecial)
    //     console.log(cpf_ok)
    //     console.log(senha_ok)
    //     console.log(number_ok)
    //     console.log(letraMinuscula_ok)
    //     console.log(letraMaiuscula_ok)

    //     if (!email_ok ||
    //         !senhaIgual ||
    //         !caractereEspecial ||
    //         !cpf_ok ||
    //         !senha_ok ||
    //         !number_ok ||
    //         !letraMinuscula_ok ||
    //         !letraMaiuscula_ok) {

    //         Swal.fire({
    //             title: "erro ao realizar cadastro",
    //             text: mensagemErro,
    //             icon: 'error',
    //             timer: 2500
    //         })

    //         return;

    //     }

    //     for (let i = 0; i < arrayEmpresas.length; i++) {
    //         if (arrayEmpresas[i].codigo == codigoVar) {
    //             idEmpresaVincular = arrayEmpresas[i].idEmpresa
    //             console.log("Codigo valido")
    //         }

    //         else {
    //             console.log("Codigo Invalido")
    //         }

    //     }

        // Região de pegar os dados para o Controller
        fetch('/empresas/registerCompanyAndUser', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                commercialNameCompanyServer: commercialNameCompanyVar,
                legalNameCompanyServer: legalNameCompanyVar,
                numberFiscalCompanyServer: numberFiscalCompanyVar,

                countryCompanyServer: countryCompanyVar,
                emailCompanyServer: emailCompanyVar,
                phoneCompanyServer: phoneCompanyVar,

                nameUserServer: nameUserVar,
                genderUserServer: genderUserVar,
                passwordUserServer: passwordUserVar,
                
                emailUserServer: emailUserVar,
                phoneUserServer: phoneUserVar
            })
        }).then( async res => {
            if (res.ok) {
                Swal.fire({
                    title: "Cadastro realizado com sucesso!",
                    icon: "success",
                    timer: 2500
                });
                document.querySelector('.container').classList.remove('ativado');
            } else {
                throw new Error("Erro ao cadastrar usuário");
            }
        }).catch(err => {
            console.error(err);
            Swal.fire({
                title: "Erro",
                text: err.message,
                icon: 'error',
                timer: 2500
            });
        });
}


function getCountrys() {
    console.log("CADE")
    fetch("/empresas/getCountry", {
        method: 'GET',
    })
        .then(function (resposta) {
            resposta.json().then(function (json) {
                console.log(json)
                arrayCountrys = json

                json.forEach((country) => {
                    arrayCountrys.push(country)
                    console.log(resposta.ok)
                    console.log(arrayCountrys[0].codigo)
                });
            })

        }).catch(function (resposta) {
            console.log(resposta)
    })
}

function getRole() {
    console.log("CADE")
    fetch("/usuarios/getRole", {
        method: 'GET',
    })
        .then(function (resposta) {
            resposta.json().then(function (json) {
                console.log(json)
                arrayRoles = json

                json.forEach((Role) => {
                    arrayRoles.push(Role)
                    console.log(resposta.ok)
                    console.log(arrayRoles[0].codigo)
                });
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