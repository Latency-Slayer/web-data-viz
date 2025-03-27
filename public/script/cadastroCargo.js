lista_usuarios = [];

const fechar = document.querySelector('.bx-x-circle')
const telaDados = document.querySelector('.telaDados')

fechar.addEventListener('click', () => {
    telaDados.classList.remove('ativadoDados')
})
    
function pesquisa() {
    var pesquisaVar = ipt_pesquisa.value

    fetch('/maquina/pesquisaUsers', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            pesquisaServer: pesquisaVar,
        })
    }).then(resposta => resposta.json()).then(usuarios => {
        lista_usuarios.push(usuarios)
        const tabela = document.querySelector(".usuarios table");
        tabela.innerHTML = `
            <tr>
                <th>ID USUARIO</th>
                <th>Nome Usuário</th>
                <th>Nome Empresa</th>
                <th>Data Cadastro</th>
                <th>Cargo/Editar</th>
            </tr>
        `;
        usuarios.forEach(usuario => {
            if (usuario.cargo == null) {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <th>${usuario.idUsuarios}</th>   
                    <td>${usuario.nome}</td>
                    <td>${usuario.empresa_nome}</td>
                    <td>${usuario.dataRegistro}</td>
                    <td class='ativarDados' data-user="${usuario.idUsuarios}" style="cursor: pointer">✏️ Cadastre Aqui</td>
                `;
                tabela.appendChild(linha);
                } else {
                    if(usuario.cargo == "analista") {
                        const linha = document.createElement("tr");
                        linha.innerHTML = `
                            <th>${usuario.idUsuarios}</th>
                            <td>${usuario.nome}</td>
                            <td>${usuario.empresa_nome}</td>
                            <td>${usuario.dataRegistro}</td>
                            <td class='ativarDados' data-user="${usuario.idUsuarios}" style="cursor: pointer; color: #41448C;">${usuario.cargo.toUpperCase()}</td>
                        `
                        tabela.appendChild(linha);
                    } else {
                        const linha = document.createElement("tr");
                        linha.innerHTML = `
                            <th>${usuario.idUsuarios}</th>
                            <td>${usuario.nome}</td>
                            <td>${usuario.empresa_nome}</td>
                            <td>${usuario.dataRegistro}</td>
                            <td class='ativarDados' data-user="${usuario.idUsuarios}" style="cursor: pointer; color: #88418C;">${usuario.cargo.toUpperCase()}</td>
                        `
                        tabela.appendChild(linha);
                    }
                }
        });
        const telaDados = document.querySelector('.telaDados');
        
        document.querySelectorAll('.ativarDados').forEach(classe => {
            classe.addEventListener('click', (e) => {
                userId = e.target.getAttribute("data-user");
            
                telaDados.classList.add('ativadoDados');
                
                btnCadastrar = telaDados.querySelector("#btn_cargo");
    
                btnCadastrar.setAttribute("data-user", userId)
    
            })}); 
    }).catch(function (resposta) {
        console.log("ERRO;", resposta)
    })

}

function usuarios() {
    fetch("/maquina/usuarios", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resposta => resposta.json()).then(usuarios => {
        lista_usuarios.push(usuarios)
        const tabela = document.querySelector(".usuarios table");
        tabela.innerHTML = `
            <tr>
                <th>ID USUARIO</th>
                <th>Nome usuário</th>
                <th>Nome Empresa</th>
                <th>Data Cadastro</th>
                <th>Cargo/Editar</th>
            </tr>
        `;
        usuarios.forEach(usuario => {
            if (usuario.cargo == null) {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <th>${usuario.idUsuarios}</th>
                <td>${usuario.nome}</td>
                <td>${usuario.empresa_nome}</td>
                <td>${usuario.dataRegistro}</td>
                <td class='ativarDados' data-user="${usuario.idUsuarios}" style="cursor: pointer">✏️ Cadastre Aqui</td>
            `;
            tabela.appendChild(linha);
            } else {
                if(usuario.cargo == "analista") {
                    const linha = document.createElement("tr");
                    linha.innerHTML = `
                        <th>${usuario.idUsuarios}</th>
                        <td>${usuario.nome}</td>
                        <td>${usuario.empresa_nome}</td>
                        <td>${usuario.dataRegistro}</td>
                        <td class='ativarDados' style="cursor: pointer; color: #41448C;" data-user="${usuario.idUsuarios}">${usuario.cargo.toUpperCase()}</td>
                    `
                    tabela.appendChild(linha);
                } else {
                    const linha = document.createElement("tr");
                    linha.innerHTML = `
                        <th>${usuario.idUsuarios}</th>
                        <td>${usuario.nome}</td>
                        <td>${usuario.empresa_nome}</td>
                        <td>${usuario.dataRegistro}</td>
                        <td class='ativarDados' data-user="${usuario.idUsuarios}" style="cursor: pointer; color: #88418C;">${usuario.cargo.toUpperCase()}</td>
                    `
                    tabela.appendChild(linha);
                }
            }
        });
        const telaDados = document.querySelector('.telaDados');

        document.querySelectorAll('.ativarDados').forEach(classe => {
        classe.addEventListener('click', (e) => {
            userId = e.target.getAttribute("data-user");
        
            telaDados.classList.add('ativadoDados');
            
            btnCadastrar = telaDados.querySelector("#btn_cargo");

            btnCadastrar.setAttribute("data-user", userId)

        })}); 
        
    })
    .catch(erro => {
        console.error("Erro ao buscar usuários:", erro);
    });
}

function mudarCargo(e) {
    var cargo = slt_cargo.value;
    var usuario = e.target.getAttribute("data-user")
    var userId = Number(usuario);

    console.log(userId)

    fetch("/maquina/cargo", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            cargoServer: cargo,
            userIdServer: userId
        })
    }).then(function(resposta){
        console.log("entrei no then do entrar()!!")
            resposta.json().then(function(json){
                console.log(json)

            })
            telaDados.classList.remove('ativadoDados')
            usuarios()
    }).catch(function(resposta){
        console.log(resposta)
    })   
}
    

