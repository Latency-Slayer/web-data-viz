class kpiComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
                <div class="kpi">
          <div class="box-kpi">
            <span class="titulo-kpi">Chamados chamados e chamados</span>

            <div class="center-infos">
              <span class="numero">12</span>
              <span class="msg-kpi">chamados em aberto sem responsável</span>
            </div>

            <span class="msg-label">60% do total de chamados (total de 20)</span>
          </div>
        </div>

        <style>
            
.kpi {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20.8vh;
    background: white;
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: solid #C4B5FD 0.3vh;
    padding: 2.2vh 0;
}

.box-kpi {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* border: solid red; */
    width: calc(100% - 2vw);
    /* height: calc(100% - 2vh); */
}

.titulo-kpi {
    color: #4D1D95;
    display: flex;
    /* border: solid; */
    font-size: 1.2vw;
    font-weight: 500;
}

.center-infos {
    display: flex;
    justify-content: space-between;
    /* border: solid green; */
}

.numero {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 9vh;
    font-weight: 700;
    color: #EF4444;
}

.msg-kpi {
    display: flex;
    justify-content: center;
    align-items: center;
    /* border: solid purple; */
    width: calc(100% - 10vh);
    font-size: 3vh;
    color: #EF4444;
    font-weight: 500;
}

.msg-label {
    display: flex;
    width: fit-content;
    color: #991B1B;
    font-weight: 500;
    background-color: #FECACA;
    padding: 0.3vh 1.5vw;
    border-radius: 2vw;
    font-size: 1vw;
}

@media (max-width: 1650px) {
    .titulo-kpi {
        font-size: 1.4vw;
    }

    .msg-kpi {
        font-size: 2.8vh;
    }
}

@media (max-width: 1590px) {
    .msg-kpi {
        font-size: 2.4vh;
    }
}

@media (max-width: 1500px) {
    .kpis {
        flex-direction: row;
        width: 100%;
        height: fit-content;
    }

    .kpi {
        width: calc((100% / 3) - 30px);
    }
}

@media (max-width: 1150px) {
    .kpis {
        flex-direction: column;
    }

    .kpi {
        height: fit-content;
        width: 100%;
    }

    .titulo-kpi {
        font-size: 3vw;
    }

    .numero {
        font-size: 13vw;
    }

    .msg-kpi {
        font-size: 5vw;
        width: calc(100% - 15vw);
    }

    .msg-label {
        font-size: 3vw;
        border-radius: 3vw;
        padding-left: 3vh;
        padding-right: 3vh;
    }
}
        </style>
        `
    }
}

customElements.define('m-kpi', kpiComponent);