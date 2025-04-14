const parentElement = document.currentScript.parentElement;

const page = document.currentScript.getAttribute("page");

parentElement.insertAdjacentHTML("afterbegin",`
    <style>
        
.navbar {
    display: flex;
    flex-direction: column;
    width: 20vw;
    height: 100vh;
    gap: 4vh;
    background-color: rgba(86, 64, 140, 1);
    color: rgba(255, 255, 255, 1);
    align-items: center;
}
.profile{
    margin-top: 4vh;
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-left: 30px;
    font-size: 20px;
    gap: 10px;
}
.profile-line {
    width: 200px;
    margin-right: 50px;
}

#company{
    font-size: 20px;
    margin-bottom: 10px;
}
#user{
    font-size: 20px;
    margin-top: 20px;
}
#cargo {
    font-size: 15px;
    margin-bottom: 20px;
}

.btnsNav{
    margin-top: 20px;
    display: flex;
    margin-left: 30px;
    flex-direction: column;
    gap: 30px;
}

.buttonNav{
    all: unset;
    display: flex;
    gap: 10px;
    width: 15vw;
    font-family: "Konkhmer Sleokchher", serif;
    justify-content: start;
    border-radius: 5px;
    transition: 0.3s;
}

.buttonNav a {
    color: white;
    text-decoration: none;
}

.buttonNav:hover{
    cursor: pointer;
    background-color: rgb(105, 85, 157);
    transform: scale(1.05);
    transition: 0.3s;

}
.encerrar{
    display: flex;
    flex-direction: row;
    margin-top: 100px;
}
.button-logout{
    font-size: 32px;
    margin-right: 10px;
}
.logout{
    all: unset;
    border: none;
    background-color: rgba(86, 64, 140, 1);
    width: 10vw;
    height: 4vh;
    font-weight: bold;
    transition: 0.3s;
}

.logout:hover{
    cursor: pointer;
    transform: scale(1.05);
    background-color: #816fa7;
    transition: 0.3s;
}

    </style>
    <div class="navbar">
            <div class="profile">
                <span class="titulo" id="company">Ubisoft</span>
                <hr class="profile-line">
                <span class="titulo" id="user">Ralph</span>
                <span class="titulo" id="cargo">Gestor de Infraestrutura</span>
                <hr class="profile-line">
            </div>
            <div class="btnsNav">
                <button class="buttonNav"> <i class='bx bx-server' ></i><a href="./dashs/analiticoIndiv.html" ${page == "servidores" ? class='active' : ''}>Servidores</a></button>
                <button class="buttonNav"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: white;"><path d="M20 3H4c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h7v2H8v2h8v-2h-3v-2h7c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 14V5h16l.002 9H4z"></path><path d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 0 0-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z"></path></svg><a href="./cadastroMaquina.html">Registrar Servidor</a></button>
                <button class="buttonNav"> <i class='bx bxs-bell-minus' ></i><a href="./cadastroCargo.html">Alertas</a></button>
                <button class="buttonNav"> <i class='bx bxs-user-badge' ></i><a href="./dashs/analiticoIndiv.html">Gerenciar Usuários</a></button>
                <button class="buttonNav"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:white"><path d="M3 5v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2H5c-1.103 0-2 .897-2 2zm16.001 14H5V5h14l.001 14z"></path><path d="M11 7h2v10h-2zm4 3h2v7h-2zm-8 2h2v5H7z"></path></svg><a href="./dashs/analiticoIndiv.html">Editar Perfil</a></button>
                <hr class="profile-line">
                <div class="encerrar">
                    <i class='bx bx-log-out button-logout'></i>
                    <button class="logout" onclick="window.location.href='index.html'">Encerrar Sessão</button>
                </div>
            </div>
    
        </div>    
`);