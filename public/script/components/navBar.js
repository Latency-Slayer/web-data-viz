const parentElement = document.currentScript.parentElement;
const page = document.currentScript.getAttribute("page");


class NavBarComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.querySelectorAll('.toggleOptions').forEach(el =>
            el.addEventListener('click', this.toggleOptions.bind(this))
        );
    }

    toggleOptions() {
        const opcoes = this.shadowRoot.querySelector(".moreOptions");
        opcoes.classList.toggle("open");
    }

    render() {
        this.shadowRoot.innerHTML = `

            <style>

    .navDesktop, .navMobile {

        display: flex;
        height: 100px;
        width: 100%;
        background: #F9FAFB;
        border-bottom: solid rgba(0, 0, 0, 0.3) 1px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        justify-content: space-between;
    }

    .navMobile {
        display: none;
    }

    ul, .name, .nameMinScreen {
        /* border: solid; */
        margin-block-start: 0;
        margin-block-end: 0;
        padding-inline-start: 0;
        padding: 0 50px;
    }

    li, .name, .nameMinScreen, .profile {
        display: flex;
        align-items: center;
        height: 100%;
        /* border: solid; */
    }

    a, .name, .nameMinScreen {
        text-decoration: none;
        color: #56408C;
        font-weight: 400;
        font-size: 1.5vw;
        transition: linear 0.3s;
        cursor: pointer;
    }

    a:hover, .name:hover, .nameMinScreen:hover {
        color: #8564db;
    }

    .arrowDown {
        transform: scaleY(0.8);
    }

    .moreOptions {
        display: none;
        background: white;
        border: solid 2px gainsboro;
        position: absolute;
        top: 80px;
        left: 85vw;
        padding: 0 1rem;
        width: 10vw;
        border-radius: 8px;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
        z-index: 2;
    }

    .moreOptions li {
        flex-direction: column;
        align-items: start;
    }

    .moreOptions div {
        display: flex;
        padding: 1vh 0;
        width: 100%;
        border-bottom: gainsboro solid thin;
        transition: linear 0.3s;
    }

    .exit {
        border: none !important;
    }

    .moreOptions div a {
        padding: 0;
        font-size: 1vw;
        color: gray;
        opacity: 0.8;
        width: 100%;
        /* border: solid; */
    }

    .moreOptions div a:hover {
        opacity: 1;
        color: #56408C;
    }

    .moreOptions.open {
        display: flex;
    }

    .moreOptions li {
        width: 100%;
    }

    @media (max-width: 1350px) {
        .navDesktop {
            display: none;
        }

        .navMobile {
            display: flex;
        }

        .menu {
            display: flex;
            flex-direction: column;
            width: 60px;
            justify-content: center;
            padding: 0 50px;
            /* border: solid; */
            cursor: pointer;
        }
        
        .line {
            background-color: #56408C;
            height: 0.8vh;
            width: 100%;
            /* border-radius: 8px; */
            margin: 5px 0;
        }

        a, .name, .nameMinScreen {
            font-size: 28px;
        }

        .support {
            display: flex !important;
        }

        .moreOptions {
        left: 75vw;
        width: 20vw;
        }

        .moreOptions div a {
        font-size: 2vw;
        /* border: solid; */
    }
    }

    @media (max-width: 1215px) {
        .alerts {
            display: none;
        }

        .moreOptions .alerts {
            display: flex !important;
        }
    }

    @media (max-width: 1020px) {
        .registerServer {
            display: none;
        }

        .moreOptions .registerServer {
            display: flex !important;
        }

        .moreOptions {
            width: 30vw;
            left: 65vw;
        }

        .moreOptions div a {
        font-size: 2.3vw;
        /* border: solid; */
    }
    }

    @media (max-width: 670px) {
        .servers {
            display: none;
        }

        .moreOptions .servers {
            display: flex !important;
        }

        .moreOptions {
            width: 40vw;
            left: 50vw;
        }

        .moreOptions div a {
        font-size: 3.2vw;
        /* border: solid; */
    }
    }

    @media (max-width: 430px) {
        .menu {
            padding: 0 25px 0 0;
        }

        a, .name {
            font-size: 3vh;
            padding: 0 25px;
        }

        .moreOptions {
            width: 45vw;
            left: 40vw;
        }

        .moreOptions div a {
        font-size: 4vw;
        /* border: solid; */
    }
    }


</style>

            <nav class="navDesktop">
                <li>
                    <ul class="servers" id="servers"><a href="../../servidores.html">Servidores</a></ul>
                    <ul class="registerServer" id="registerServer"><a href="../../cadastroMaquina.html">Registrar servidor</a></ul>
                    <ul class="manageUsers" id="manageUsers"><a href="../../cadastroCargo.html">Gerenciar usuários</a></ul>
                    <ul class="support" id="support"><a href="#">Suporte</a></ul>
                </li>

                <div class="profile">
                     <div class="name toggleOptions">${sessionStorage.NAME_USER || 'Guest'} <span class="arrowDown">ㅤ▼</span></div>
                </div>
            </nav>

            <nav class="navMobile">
                <div class="profile">
                     <div class="name">${sessionStorage.NAME_USER || 'Guest'}</div>
                </div>

                <li>
                    <ul class="servers"><a href="../../servidores.html">Servidores</a></ul>
                    <ul class="registerServer"><a href="../../cadastroMaquina.html">Registrar servidor</a></ul>
                </li>

                <div class="menu toggleOptions">
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                </div>
            </nav>

            <div class="moreOptions">
                <li>
                    <div class="servers" style="display: none;"><a href="../../servidores.html">Servidores</a></div>
                    <div class="registerServer" style="display: none;"><a href="../../cadastroMaquina.html">Registrar servidor</a></div>
                    <div class="manageUsers" style="display: none;"><a href="../../cadastroCargo.html">Gerenciar usuários</a></div>
                    <div class="support" style="display: none;"><a href="#">Suporte</a></div>
                    <div class="editProfile"><a href="../../editarPerfil.html">Editar perfil</a></div>
                    <div class="exit"><a href="../../index.html">Encerrar sessão</a></div>
                </li>
            </div>
        `;
    }
}

customElements.define('nav-bar', NavBarComponent);

var registrarServidor = document.getElementById("registerServer")
var gerenciarUsuario = document.getElementById("manageUsers")
var suporte = document.getElementById("support")


if (sessionStorage.getItem('ROLE_USER') === 'Analista de Dados') {
    gerenciarUsuario.style.display = "none"
    registrarServidor.style.display = "none"
}

if (sessionStorage.getItem('ROLE_USER') === 'Gerente') {
    gerenciarUsuario.style.display = "none"
    registrarServidor.style.display = "none"
}