class AlertCard extends HTMLElement {
    constructor() {
        // Chamando construtor da classe HTMLElement
        super();
        // Encapsulando código no componente (Tudo o que for escrito aqui, não afeta outros componentes.)
        this.attachShadow({ mode: 'open' });
    }

    // Metodo chamado pelo navegador ao renderizar o componente.
    connectedCallback() {
        // Coletando atributos.
        const criticality = this.getAttribute("criticality");
        const tagName = this.getAttribute("tagName");
        const motherboardid = this.getAttribute("motherboardid");
        const cpu = this.getAttribute("cpu");
        const ram = this.getAttribute("ram")
        const disco = this.getAttribute("disco")
        const datetime = this.getAttribute("datetime");

        // Adicionando HTML no elemento.
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Asap:ital,wght@0,100..900;1,100..900&family=Edu+AU+VIC+WA+NT+Guides:wght@400..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
                
                * {
                    margin: 0;
                    padding: 0;
                    font-family: 'Poppins', sans-serif;
                }
                
                :host {
                    height: fit-content;
                }
            
                .card {
                    /*height: 215px;*/
                    border: rgba(58, 46, 93, 0.3) solid 1px;
                    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                    padding: 20px 20px;
                    margin-bottom: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                
                .labels {
                    min-height: 30px !important;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    justify-content: space-between;
                }
                
                .label {
                    border-radius: 3px;            
                    height: 100%;
                    width: fit-content;
                    padding: 4px 10px;
                    font-weight: 400;
                    font-size: 1.2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;            
                }
            
                
                .Crítico {
                    background-color: #c30a03;
                    color: #fff; 
                }
                
                .Atenção {
                    background-color: #ffa507;
                    color: #fff; 
                }
                
                .Normal {
                    background-color: #F0ECFB;
                    color: black;
                }
                
                .identification {
                    background-color: #F0ECFB;
                    color: #56408C;
                    padding: 4px 10px;

                }
                
                .identification span {
                    color: rgba(58, 46, 93, 0.8);
                    font-weight: 400;
                    font-size: 1.2rem;
                }
                
                .desc {
                    margin: 10px 0;
                }
                
                .desc span {
                    font-size: 1.2rem;
                    color: #3A2E5D;
                }
                
                .infos {
                    margin-top: 10px;
                    display: flex;
                    justify-content: space-between;
                }
                
                .info {
                    border-radius: 3px;
                    padding: 4px 10px;
                    font-weight: 400;
                    font-size: 1.2rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            
                
                .info.date {
                    color: #fff;
                    background-color:rgb(138, 135, 135);
                    text-align: center;
                }
                
                 @media (max-width: 1050px) {
                    .card {
                        padding: 20px 20px;
                    }
                 
                    .label {
                        font-size: 2.2vw;
                    }
                 
                    .identification h1 {
                        font-size: 4vw;
                    }
                    
                    .identification span {
                        font-size: 3vw;
                    }
                    
                    .desc span {
                        font-size: 2.8vw;
                    }
                    
                    .info {
                        font-size: 2.5vw;
                    }
                 }
                 
                 @media (max-width: 550px) {                 
                    .label {
                        font-size: 3.5vw;
                    }
                 
                    .identification h1 {
                        font-size: 7vw;
                    }
                    
                    .identification span {
                        font-size: 5vw;
                    }
                    
                    .desc span {
                        font-size: 4vw;
                    }
                    
                    .info {                        
                        font-size: 3vw;
                    }
                
                 }
                 
                 
                 @media (max-width: 400px) {
                    .info {                 
                        font-size: 2.9vw;
                    }
                
                 }
            </style>
            
            
             <div class="card">
                <div class="labels">
                    <div class="label criticality "></div>    
                    <div class="identification"><span class="titulo-tag"></span></div>
                    <div class="info cpu"><span class="cpu-tag"></span></div>
                    <div class="info ram"><span class="ram-tag"></span></div>
                    <div class="info disco"><span class="disco-tag"></span></div>
                     <div class="info date"><span class="datetime-tag"></span></div>
                </div>                
             </div>
            
        `;
        this.shadowRoot.querySelector('.titulo-tag').textContent = tagName;

        this.shadowRoot.querySelector('.card').addEventListener('click', () => {
            window.location.href = `../../dashboardTempoRealNew.html?tag=${motherboardid}`;
        });
    }
    
    updateMetrics({ cpu, ram, disco, datetime, limiteCPU, limiteRAM, limiteDisco, limiteMinimoCPU, limiteMinimoRAM, limiteMinimoDisco }) {
        this.shadowRoot.querySelector(".cpu-tag").textContent = `Uso CPU: ${cpu}%`;
        this.shadowRoot.querySelector(".ram-tag").textContent = `Uso RAM: ${ram}%`;
        this.shadowRoot.querySelector(".disco-tag").textContent = `Uso Disco: ${disco}%`;
        this.shadowRoot.querySelector(".datetime-tag").textContent = `${this.formatarDataISO(datetime)}`;

        const container_cpu = this.shadowRoot.querySelector(".info.cpu");
        const container_ram = this.shadowRoot.querySelector(".info.ram");
        const container_disco = this.shadowRoot.querySelector(".info.disco");
        const criticalityTag = this.shadowRoot.querySelector(".criticality");

        container_cpu.classList.remove("Normal", "Atenção", "Crítico");
        container_ram.classList.remove("Normal", "Atenção", "Crítico");
        container_disco.classList.remove("Normal", "Atenção", "Crítico");
        
        let criticidadeGeral = "Normal";
        
        if (cpu >= limiteCPU) {
            container_cpu.classList.add("Crítico");
            criticidadeGeral = "Crítico";
        } else if (cpu >= limiteMinimoCPU) { 
            container_cpu.classList.add("Atenção");
            if (criticidadeGeral !== "Crítico") criticidadeGeral = "Atenção";
        } else {
            container_cpu.classList.add("Normal");
        }
        
        if (ram >= limiteRAM) {
            container_ram.classList.add("Crítico");
            criticidadeGeral = "Crítico";
        } else if (ram >= limiteMinimoRAM) { 
            container_ram.classList.add("Atenção");
            if (criticidadeGeral !== "Crítico") criticidadeGeral = "Atenção";
        } else {
            container_ram.classList.add("Normal");
        }
        
        if (disco >= limiteDisco) {
            container_disco.classList.add("Crítico");
            criticidadeGeral = "Crítico";
        } else if (disco >= limiteMinimoDisco) { 
            container_disco.classList.add("Atenção");
            if (criticidadeGeral !== "Crítico") criticidadeGeral = "Atenção";
        } else {
            container_disco.classList.add("Normal");
        }
        
        criticalityTag.textContent = criticidadeGeral;
        criticalityTag.className = `label criticality ${criticidadeGeral}`;
    }
    
    formatarDataISO(timestamp) {
        return new Date(timestamp).toISOString().split('T')[0];
    }
}

customElements.define("alert-card", AlertCard);