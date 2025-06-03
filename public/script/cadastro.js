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
let registerMask, phoneMask, phoneUserMask;

// 
document.addEventListener("DOMContentLoaded", function () {
    let steps = ["step1", "step2", "step3", "step4"];
    let currentStep = 0;

    let btnNext = document.getElementById("btn_next");
    let btnBack = document.getElementById("btn_back");
    let btnRegister = document.getElementById("btn_register");
    let register_company_user = document.getElementById("register_company_user");

    // This part explains the dinamic select on country, using fetch on database 
    const countryCompany = document.getElementById("slt_country_company");
    const manterPrimeiraOpcao = countryCompany.options[0];

    let countrysMasks = [];

    fetch("/empresas/getCountry")
        .then(response => response.json())
        .then(data => {
            countryCompany.innerHTML = "";
            countryCompany.appendChild(manterPrimeiraOpcao);

            data.forEach(pais => {
                const option = document.createElement("option");
                option.value = pais.id_country;
                option.textContent = pais.name;
                countryCompany.appendChild(option);

                // This part take the maskRegister and maskPhone from database, and store on vector
                countrysMasks[pais.id_country] = {
                    maskRegister: pais.mask_company_registration_number,
                    maskPhone: pais.mask_phone,
                    maskPhoneUser: pais.mask_phone
                };

            });
        })
        .catch(error => {
            console.error("Erro ao carregar os países:", error);
        });

    const registrationNumberMaskCompany = document.getElementById("ipt_number_fiscal");
    const phoneMaskCompany = document.getElementById("ipt_phone_company");
    const phoneMaskUser = document.getElementById("ipt_phone_user");

    // Event on change, when he select the country, this function change the input register and phone agreed the country sele
    countryCompany.addEventListener("change", function () {
        const idCountrySelected = this.value;
        const countrySelected = countrysMasks[idCountrySelected];

        if (countrySelected) {

            registerMask = IMask(registrationNumberMaskCompany, {
                mask: countrySelected.maskRegister
            });

            phoneMask = IMask(phoneMaskCompany, {
                mask: countrySelected.maskPhone
            });

            phoneUserMask = IMask(phoneMaskUser, {
                mask: countrySelected.maskPhoneUser
            });
        }
    });


    function updateSteps() {
        document.getElementById(steps[0]).style.display = "none";
        document.getElementById(steps[1]).style.display = "none";
        document.getElementById(steps[2]).style.display = "none";
        document.getElementById(steps[3]).style.display = "none";

        btnRegister.style.display = "none"
        document.getElementById(steps[currentStep]).style.display = "block";

        if (currentStep >= 1) {
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

    function validateFields(step) {
        let mensagemErro = "";

        const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
        const hasUpperCase = /[A-Z]/;
        const hasLowerCase = /[a-z]/;
        const hasNumber = /[0-9]/;

        const commercialNameCompanyVar = ipt_commercial_name.value;
        const legalNameCompanyVar = ipt_legal_name.value;
        const numberFiscalCompanyVar = ipt_number_fiscal.value;

        const countryCompanyVar = slt_country_company.value;
        const emailCompanyVar = ipt_email_company.value;
        const phoneCompanyVar = ipt_phone_company.value;

        const nameUserVar = ipt_name_user.value;
        const genderUserVar = slt_gender.value;
        const passwordUserVar = ipt_password_user.value;
        const confirmPasswordUserVar = ipt_confirm_password.value;

        const emailUserVar = ipt_email_user.value;
        const phoneUserVar = ipt_phone_user.value;

        switch (step) {
            case 0: //Company: Commercial Name, Legal Name, Country
                if (!commercialNameCompanyVar || !legalNameCompanyVar || countryCompanyVar === "#") {
                    mensagemErro += "Preencha o Nome Fantasia, Razão Social e Selecione um País.\n";
                } else if (specialChars.test(commercialNameCompanyVar)) {
                    mensagemErro += "O Nome Fantasia não pode conter caractéres especiais.\n"
                } else if (hasNumber.test(commercialNameCompanyVar)) {
                    mensagemErro += "O Nome Fantasia não pode conter números.\n"
                } else if (specialChars.test(legalNameCompanyVar)) {
                    mensagemErro += "A Razão Social não pode conter caractéres especiais.\n"
                } else if (hasNumber.test(legalNameCompanyVar)) {
                    mensagemErro += "A Razão Social não pode conter números.\n"
                }
                break;

            case 1: //Company: register number, email, phone
                if (!numberFiscalCompanyVar) {
                    mensagemErro += "Informe o Número Fiscal da Empresa.\n";
                }
                if (!emailCompanyVar || !emailCompanyVar.includes('@') || !emailCompanyVar.includes('.')) {
                    mensagemErro += "Informe um E-mail válido da Empresa.\n";
                }
                if (!phoneCompanyVar) {
                    mensagemErro += "Informe o telefone da empresa.\n";
                }
                break;

            case 2: //User: name, gender, password, confirm password
                if (!nameUserVar || genderUserVar === "#") {
                    mensagemErro += "Preencha o Nome e Selecione o Gênero.\n";
                } else if (specialChars.test(nameUserVar)) {
                    mensagemErro += "O Nome não pode conter caractéres especiais.\n"
                } else if (hasNumber.test(nameUserVar)) {
                    mensagemErro += "O Nome não pode conter números.\n"
                }

                if (!passwordUserVar || !confirmPasswordUserVar) {
                    mensagemErro += "Preencha a senha e a confirmação de senha.\n";
                } else if (passwordUserVar !== confirmPasswordUserVar) {
                    mensagemErro += "Senhas não coincidem.\n";
                } else {
                    if (passwordUserVar.length < 8) {
                        mensagemErro += "A senha deve ter pelo menos 8 caracteres.\n";
                    }
                    if (!specialChars.test(passwordUserVar)) {
                        mensagemErro += "A senha deve conter pelo menos um caractere especial (!@#$%).\n";
                    }
                    if (!hasUpperCase.test(passwordUserVar)) {
                        mensagemErro += "A senha deve conter pelo menos uma letra maiúscula.\n";
                    }
                    if (!hasLowerCase.test(passwordUserVar)) {
                        mensagemErro += "A senha deve conter pelo menos uma letra minúscula.\n";
                    }
                    if (!hasNumber.test(passwordUserVar)) {
                        mensagemErro += "A senha deve conter pelo menos um número.\n";
                    }
                }
                break;
            case 3: //User: email, phone
                if (!emailUserVar || !emailUserVar.includes('@') || !emailUserVar.includes('.')) {
                    mensagemErro += "Informe um E-mail válido.\n";
                }
                if (!phoneUserVar) {
                    mensagemErro += "Informe o telefone.\n";
                }
                break;
        }

        if (mensagemErro !== "") {
            Swal.fire("Atenção", mensagemErro, "warning");
            return false;
        }

        return true;
    }

    btnNext.addEventListener("click", function () {
        if (validateFields(currentStep)) {
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateSteps();
            }
        }
    });
    btnBack.addEventListener("click", function () {
        if (currentStep > 0) {
            currentStep--;
            updateSteps();
        }
    });
    btnRegister.addEventListener("click", function () {
        if (validateFields(3)) {
            register();
        }
    })

    updateSteps();
});

function register() {
    var commercialNameCompanyVar = ipt_commercial_name.value;
    var legalNameCompanyVar = ipt_legal_name.value;
    var numberFiscalCompanyVar = registerMask.unmaskedValue;

    var countryCompanyVar = slt_country_company.value;
    var emailCompanyVar = ipt_email_company.value;
    var phoneCompanyVar = phoneMask.unmaskedValue;

    var nameUserVar = ipt_name_user.value;
    var genderUserVar = slt_gender.value;
    var passwordUserVar = ipt_password_user.value;

    var emailUserVar = ipt_email_user.value;
    var phoneUserVar = phoneUserMask.unmaskedValue;

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
    }).then(async res => {
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



function getCountries() {
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
    var loginEmailVar = ipt_login_email.value;
    var loginPasswordVar = ipt_login_password.value;

    let mensagemErro = "";

    fetch("/usuarios/login", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            loginEmailServer: loginEmailVar,
            loginPasswordServer: loginPasswordVar
        })
    }).then(function (resposta) {
        console.log("entrei no then do entrar()!!")

        if (resposta.ok) {
            console.log(resposta);
            mensagemErro += "Login realizado com sucesso!"

            resposta.json().then(function (json) {
                sessionStorage.NAME_USER = json.nameUser;
                sessionStorage.EMAIL_USER = json.email;
                sessionStorage.ROLE_USER = json.nameRole;
                sessionStorage.ID_COMPANY = json.id_company;
                sessionStorage.COMMERCIAL_NAME = json.commercial_name;
                sessionStorage.REGISTRATION_NUMBER = json.registration_number;

                Swal.fire({
                    title: "Sucesso",
                    text: "Login realizado com sucesso",
                    icon: "success",
                    timer: 2000
                });
               
              
              setTimeout(() => {
                    if (json.id_opt_role == 1) {
                        window.location = "./listaServidores.html"
                    } else if (json.id_opt_role == 2) {
                        window.location = "./servidores.html"
                    } else if (json.id_opt_role == 3) {
                        window.location = "./listaServidores.html"
                    } else if (json.id_opt_role == 4) {
                    window.location = "./dashboardJiraSlack.html"
                  } else if(json.id_opt_role == 5){
                    window.location = "./dashBilling.html"
                  }
                }, 2000);
              
            })
        } else {
            mensagemErro += "Email ou Senha inválido";
            resposta.text().then(texto => {
                console.error(texto);
                Swal.fire({
                    title: "Erro",
                    text: "Email ou Senha inválido",
                    icon: "error",
                    timer: 2500
                });
            });
        }

    }).catch(function (resposta) {
        console.log(resposta)
        Swal.fire({
            title: "Erro",
            text: "Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.",
            icon: "error",
            timer: 2500
        });
    })
}
