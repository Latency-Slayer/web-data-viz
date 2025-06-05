// import { valor_kpi } from "../valoresKpis";
var valor_kpi_chamados_abertos = 12
var total_chamados_abertos = 20
var pctg_chamados_abertos = 60

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
              <span class="numero">${valor_kpi_chamados_abertos}</span>
              <span class="msg-kpi">chamados em aberto sem responsável</span>
            </div>

            <span class="msg-label">${total_chamados_abertos}% do total de chamados (total de ${total_chamados_abertos})</span>
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



        </style>
        `
    }
}

customElements.define('m-kpi', kpiComponent);