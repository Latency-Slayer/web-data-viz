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
    /*border: solid red 3px;*/
    height: 100%;
}

.buttonNav{
    all: unset;
    display: flex;
    width: 15vw;
    padding: 2.8vh 0;
    justify-content: start;
    border-radius: 5px;
    transition: 0.3s ease-in-out;
    align-items: center;
}

.buttonNav a {
    color: white;
    font-size: 2.4vh;
    text-decoration: none;
}

svg {
    height: 3vh;
    width: 3vh;
    padding: 0 3vh 0 0;
}

.buttonNav:hover, .encerrar:hover{
    cursor: pointer;
    background-color: rgb(105, 85, 157);
    /*transform: scale(1.05);*/
}

.buttonNav.active {
background-color: white;
color: #563f8c;
}

.buttonNav.active a {
    color: #563f8c;
}

.encerrar{
    display: flex;
    align-items: center;
    transition: 0.3s ease-in-out;
    border-radius: 5px;
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
    
        <div class="navbar">
            <div class="profile">
                <span class="titulo" id="company">Ubisoft</span>
                <hr>
                <span class="titulo" id="user">Ralph</span>
                <span class="titulo" id="cargo">Gestor de Infraestrutura</span>
                <hr>
            </div>
            
            <div class="btnsNav">
                <button class="buttonNav ${page === 'servidores' ? 'active' : ''}"> <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.5155 15.7248C3.78702 15.7062 4.13391 15.7059 4.63158 15.7059H19.3684C19.8661 15.7059 20.213 15.7062 20.4845 15.7248C20.7513 15.7431 20.9067 15.7774 21.0253 15.8268C21.4122 15.988 21.7196 16.2972 21.8798 16.6863C21.9289 16.8056 21.963 16.9619 21.9812 17.2303C21.9997 17.5034 22 17.8523 22 18.3529C22 18.8535 21.9997 19.2025 21.9812 19.4756C21.963 19.744 21.9289 19.9002 21.8798 20.0196C21.7196 20.4087 21.4122 20.7179 21.0253 20.8791C20.9067 20.9285 20.7513 20.9628 20.4845 20.9811C20.213 20.9997 19.8661 21 19.3684 21H4.63158C4.13391 21 3.78702 20.9997 3.5155 20.9811C3.2487 20.9628 3.09333 20.9285 2.97471 20.8791C2.58782 20.7179 2.28044 20.4087 2.12019 20.0196C2.07105 19.9002 2.03701 19.744 2.01881 19.4756C2.00028 19.2025 2 18.8535 2 18.3529C2 17.8523 2.00028 17.5034 2.01881 17.2303C2.03701 16.9619 2.07105 16.8056 2.12019 16.6863C2.28044 16.2972 2.58782 15.988 2.97471 15.8268C3.09333 15.7774 3.2487 15.7431 3.5155 15.7248ZM4.63158 19.4118C5.21293 19.4118 5.68421 18.9377 5.68421 18.3529C5.68421 17.7682 5.21293 17.2941 4.63158 17.2941C4.05023 17.2941 3.57895 17.7682 3.57895 18.3529C3.57895 18.9377 4.05023 19.4118 4.63158 19.4118Z" fill="#FEFDFF"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.63158 8.29412C4.13391 8.29412 3.78702 8.29383 3.5155 8.2752C3.2487 8.25689 3.09333 8.22265 2.97471 8.17322C2.58782 8.01202 2.28044 7.70284 2.12019 7.31367C2.07105 7.19435 2.03701 7.03807 2.01881 6.7697C2.00028 6.49658 2 6.14765 2 5.64706C2 5.14647 2.00028 4.79753 2.01881 4.52441C2.03701 4.25605 2.07105 4.09977 2.12019 3.98044C2.28044 3.59128 2.58782 3.28209 2.97471 3.1209C3.09333 3.07147 3.2487 3.03723 3.5155 3.01892C3.78702 3.00029 4.13391 3 4.63158 3H19.3684C19.8661 3 20.213 3.00029 20.4845 3.01892C20.7513 3.03723 20.9067 3.07147 21.0253 3.1209C21.4122 3.28209 21.7196 3.59128 21.8798 3.98044C21.9289 4.09977 21.963 4.25605 21.9812 4.52441C21.9997 4.79753 22 5.14647 22 5.64706C22 6.14765 21.9997 6.49658 21.9812 6.7697C21.963 7.03807 21.9289 7.19435 21.8798 7.31367C21.7196 7.70284 21.4122 8.01202 21.0253 8.17322C20.9067 8.22265 20.7513 8.25689 20.4845 8.2752C20.213 8.29383 19.8661 8.29412 19.3684 8.29412H4.63158ZM4.63158 9.35294C4.13391 9.35294 3.78702 9.35323 3.5155 9.37186C3.2487 9.39017 3.09333 9.42441 2.97471 9.47384C2.58782 9.63503 2.28044 9.94422 2.12019 10.3334C2.07105 10.4527 2.03701 10.609 2.01881 10.8774C2.00028 11.1505 2 11.4994 2 12C2 12.5006 2.00028 12.8495 2.01881 13.1226C2.03701 13.391 2.07105 13.5473 2.12019 13.6666C2.28044 14.0558 2.58782 14.365 2.97471 14.5262C3.09333 14.5756 3.2487 14.6098 3.5155 14.6281C3.78702 14.6468 4.13391 14.6471 4.63158 14.6471H19.3684C19.8661 14.6471 20.213 14.6468 20.4845 14.6281C20.7513 14.6098 20.9067 14.5756 21.0253 14.5262C21.4122 14.365 21.7196 14.0558 21.8798 13.6666C21.9289 13.5473 21.963 13.391 21.9812 13.1226C21.9997 12.8495 22 12.5006 22 12C22 11.4994 21.9997 11.1505 21.9812 10.8774C21.963 10.609 21.9289 10.4527 21.8798 10.3334C21.7196 9.94422 21.4122 9.63503 21.0253 9.47384C20.9067 9.42441 20.7513 9.39017 20.4845 9.37186C20.213 9.35323 19.8661 9.35294 19.3684 9.35294H4.63158ZM5.68421 12C5.68421 12.5848 5.21293 13.0588 4.63158 13.0588C4.05023 13.0588 3.57895 12.5848 3.57895 12C3.57895 11.4152 4.05023 10.9412 4.63158 10.9412C5.21293 10.9412 5.68421 11.4152 5.68421 12ZM4.63158 6.70588C5.21293 6.70588 5.68421 6.23183 5.68421 5.64706C5.68421 5.06229 5.21293 4.58824 4.63158 4.58824C4.05023 4.58824 3.57895 5.06229 3.57895 5.64706C3.57895 6.23183 4.05023 6.70588 4.63158 6.70588Z" fill="#FEFDFF"></path> </g></svg><a href="./gerenciarServidor.html">Servidores</a></button>
                <button class="buttonNav ${page === 'registrarServidor' ? 'active' : ''}"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: white;"><path d="M20 3H4c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h7v2H8v2h8v-2h-3v-2h7c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 14V5h16l.002 9H4z"></path><path d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 0 0-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z"></path></svg><a href="./cadastroMaquina.html">Registrar Servidor</a></button>
                <button class="buttonNav ${page === 'alertas' ? 'active' : ''}"> <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.35179 20.2418C9.19288 21.311 10.5142 22 12 22C13.4858 22 14.8071 21.311 15.6482 20.2418C13.2264 20.57 10.7736 20.57 8.35179 20.2418Z" fill="#FEFDFF"></path> <path d="M18.7491 9V9.7041C18.7491 10.5491 18.9903 11.3752 19.4422 12.0782L20.5496 13.8012C21.5612 15.3749 20.789 17.5139 19.0296 18.0116C14.4273 19.3134 9.57274 19.3134 4.97036 18.0116C3.21105 17.5139 2.43882 15.3749 3.45036 13.8012L4.5578 12.0782C5.00972 11.3752 5.25087 10.5491 5.25087 9.7041V9C5.25087 5.13401 8.27256 2 12 2C15.7274 2 18.7491 5.13401 18.7491 9Z" fill="#FEFDFF"></path> </g></svg><a href="./alertas.html">Alertas</a></button>
                <button class="buttonNav ${page === 'gerenciarUsuarios' ? 'active' : ''}"> <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9ZM12 20.5C13.784 20.5 15.4397 19.9504 16.8069 19.0112C17.4108 18.5964 17.6688 17.8062 17.3178 17.1632C16.59 15.8303 15.0902 15 11.9999 15C8.90969 15 7.40997 15.8302 6.68214 17.1632C6.33105 17.8062 6.5891 18.5963 7.19296 19.0111C8.56018 19.9503 10.2159 20.5 12 20.5Z" fill="#FEFDFF"></path> </g></svg><a href="./dashs/analiticoIndiv.html">Gerenciar Usuários</a></button>
                <button class="buttonNav ${page === 'editarPerfil' ? 'active' : ''}"> <svg height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path style="fill:#FEFDFF;" d="M102.38,120.188H339.5c11.548,0,20.911-9.362,20.911-20.91s-9.362-20.911-20.911-20.911H102.38 c-11.548,0-20.91,9.362-20.91,20.911S90.832,120.188,102.38,120.188z"></path> <path style="fill:#FEFDFF;" d="M102.38,191.875h181.403c11.548,0,20.91-9.362,20.91-20.911s-9.362-20.91-20.91-20.91H102.38 c-11.548,0-20.91,9.362-20.91,20.91S90.832,191.875,102.38,191.875z"></path> <path style="fill:#FEFDFF;" d="M102.38,263.561h181.403c11.548,0,20.91-9.362,20.91-20.91s-9.362-20.91-20.91-20.91H102.38 c-11.548,0-20.91,9.362-20.91,20.91S90.832,263.561,102.38,263.561z"></path> <path style="fill:#FEFDFF;" d="M211.293,314.337c0-11.548-9.362-20.91-20.91-20.91H102.38c-11.548,0-20.91,9.362-20.91,20.91 s9.362,20.91,20.91,20.91h88.002C201.93,335.248,211.293,325.886,211.293,314.337z"></path> <path style="fill:#FEFDFF;" d="M424.536,163.485V20.91c0-11.548-9.362-20.91-20.91-20.91H38.25C26.702,0,17.34,9.362,17.34,20.91 V491.09c0,11.548,9.362,20.91,20.91,20.91h365.376c11.548,0,20.91-9.362,20.91-20.91V310.596l53.555-53.555l0.001-0.001 C518.336,216.791,479.336,149.345,424.536,163.485z M382.715,470.179H59.161V41.821h323.555V194.38L217.697,359.4 c-2.784,2.778-4.936,6.622-5.755,10.875l-11.977,61.349c-2.523,12.913,7.387,24.917,20.523,24.917 c2.851,0-1.427,0.673,65.444-12.382c4.25-0.85,7.963-2.92,10.781-5.741l86.002-86.002V470.179z M448.521,227.468 c-15.606,15.606-142.017,142.016-166.592,166.591l-19.875-19.875c3.997-3.997,163.538-163.538,166.585-166.584 C441.762,194.49,461.684,214.304,448.521,227.468z"></path> </g> </g> </g> </g></svg><a href="./dashs/analiticoIndiv.html">Editar Perfil</a></button>
                <hr>
                <div class="encerrar">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17.2929 14.2929C16.9024 14.6834 16.9024 15.3166 17.2929 15.7071C17.6834 16.0976 18.3166 16.0976 18.7071 15.7071L21.6201 12.7941C21.6351 12.7791 21.6497 12.7637 21.6637 12.748C21.87 12.5648 22 12.2976 22 12C22 11.7024 21.87 11.4352 21.6637 11.252C21.6497 11.2363 21.6351 11.2209 21.6201 11.2059L18.7071 8.29289C18.3166 7.90237 17.6834 7.90237 17.2929 8.29289C16.9024 8.68342 16.9024 9.31658 17.2929 9.70711L18.5858 11H13C12.4477 11 12 11.4477 12 12C12 12.5523 12.4477 13 13 13H18.5858L17.2929 14.2929Z" fill="#FEFDFF"></path> <path d="M5 2C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H14.5C15.8807 22 17 20.8807 17 19.5V16.7326C16.8519 16.647 16.7125 16.5409 16.5858 16.4142C15.9314 15.7598 15.8253 14.7649 16.2674 14H13C11.8954 14 11 13.1046 11 12C11 10.8954 11.8954 10 13 10H16.2674C15.8253 9.23514 15.9314 8.24015 16.5858 7.58579C16.7125 7.4591 16.8519 7.35296 17 7.26738V4.5C17 3.11929 15.8807 2 14.5 2H5Z" fill="#FEFDFF"></path> </g></svg> 
                    <button class="logout" onclick="window.location.href='index.html'">Encerrar Sessão</button>
                </div>
            </div>
        </div>    
`);