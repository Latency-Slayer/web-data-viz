const parentElement = document.currentScript.parentElement;

const page = document.currentScript.getAttribute("page");

parentElement.insertAdjacentHTML("afterbegin",`
    <style>
.navbar {
    display: flex;
    flex-direction: column;
    width: 15vw;
    height: 100vh;
    background-color: rgba(86, 64, 140, 1);
    color: rgba(255, 255, 255, 1);
    align-items: center;
    justify-content: space-between;
    padding: 0 5vh;
}
.profile{
    margin-top: 4vh;
    display: flex;
    flex-direction: column;
    text-align: left;
    width: 100%;
}

hr {
    height: .2vh;
    background: #DADFD2;
    background: linear-gradient(90deg, rgba(218, 223, 210, 1) 0%, rgba(218, 223, 210, 0) 100%);
    border: none;
    margin: 2.6vh 0;
}

#company, #user{
    font-size: 5vh;
}

#cargo {
    font-size: 2vh;
}

.btnsNav{
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-around
}

.buttonNav {
    color: white;
    font-size: 2.4vh;
    text-decoration: none;
    border-radius: 5px;
    padding: 0 10px;
}

.buttonNav button {
    all: unset;
    display: flex;
    width: 15vw;
    padding: 1.5vh 0;
    justify-content: start;
    border-radius: 5px;
    transition: 0.3s ease-in-out;
    align-items: center;
    gap: 25px;
}

.nav-icon {
    font-size: 30px;
}

.buttonNav:hover, .encerrar:hover{
    cursor: pointer;
    background-color: rgb(105, 85, 157);

    /*transform: scale(1.05);*/
    text-decoration: none;
}

.buttonNav.active {
    background-color: white;
    color: #563f8c;
}

.encerrar{
    display: flex;
    align-items: center;
    transition: 0.3s ease-in-out;
    border-radius: 5px;
    gap: 25px;
}   

.logout{
    all: unset;
    display: flex;
    border: none;
    height: 4vh;
    justify-content: start;
    align-items: center;
    font-size: 2.4vh;
    padding: 2.6vh 0;
}

    </style>

    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    
        <div class="navbar">
            <div class="profile">
                <span class="titulo" id="company">${sessionStorage.COMMERCIAL_NAME}</span>
                <hr>
                <span class="titulo" id="user">${sessionStorage.NAME_USER}</span>
                <span class="titulo" id="cargo">${sessionStorage.ROLE_USER}</span>
                <hr>
            </div>
            
            <div class="btnsNav">
                <a class="buttonNav ${page === 'servidores' ? 'active' : ''}" href="./listaServidores.html"><button><i class='bx bxs-server nav-icon'></i>Servidores</button></a>
                <a class="buttonNav ${page === 'registrarServidor' ? 'active' : ''}" href="./cadastroMaquina.html"><button><i class='bx bx-desktop nav-icon'></i>Registrar Servidor</button></a>
                <a class="buttonNav ${page === 'alertas' ? 'active' : ''}" href="./alertas.html"><button><i class='bx bxs-bell nav-icon'></i>Alertas</button></a>
                <a class="buttonNav ${page === 'gerenciarUsuarios' ? 'active' : ''}" href="./usuarios.html"><button> <i class='bx bxs-user-account nav-icon'></i>Gerenciar Usuários</button></a>
                <a class="buttonNav ${page === 'editarPerfil' ? 'active' : ''}" href="./editarPerfil.html"><button><i class='bx bxs-user-circle nav-icon'></i>Editar Perfil</button></a>
                <hr>
                <div class="encerrar">
                    <i class='bx bx-log-in nav-icon'></i>
                    <button class="logout" onclick="window.location.href='index.html'">Encerrar Sessão</button>
                </div>
            </div>
        </div>    
`);
