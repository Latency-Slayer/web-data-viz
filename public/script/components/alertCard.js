class AlertCard extends HTMLElement {
    constructor() {
        // Chamando construtor da classe HTMLElement
        super();
        // Encapsulando código no componente (Tudo o que for escrito aqui, não afeta outros componentes.)
        this.attachShadow({mode: 'open'});
    }

    // Metodo chamado pelo navegador ao renderizar o componente.
    connectedCallback() {
        // Coletando atributos.
        const criticality = this.getAttribute("criticality");
        const component = this.getAttribute("component");
        const uuid = this.getAttribute("uuid");
        const tagName = this.getAttribute("tagName");
        const desc = this.getAttribute("desc");
        const capturing = this.getAttribute("capturing");
        const limit = this.getAttribute("limit");
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
                    border: 2px solid rgba(103,86,147,0.47);
                    box-shadow: 1px 1px 3px rgba(58,46,93,0.3);
                    border-radius: 8px;
                    padding: 20px 20px;
                    
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                
                .labels {
                    min-height: 30px !important;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .label {
                    border-radius: 3px;            
                    height: 100%;
                    width: fit-content;
                    padding: 0 20px;
                    font-weight: 500;
                    font-size: 1.2rem;
                    
                    display: flex;
                    align-items: center;
                    justify-content: center;            
                }
                
                .component {
                    background-color: #F0ECFB;
                    color: #56408C;
                }
                
                .Crítico {
                    background-color: #FBECEC;
                    color: #F62821; 
                }
                
                .Atenção {
                    background-color: #f6b321;
                    color: #3a3804; 
                }
                
                .identification {
                    margin-top: 15px;
                }
                
                .identification h1 {
                    color: #3A2E5D;
                    font-weight: 400;
                    font-size: 1.6rem;
                }
                
                .identification span {
                    color: #3A2E5D;
                    font-weight: 400;
                    font-size: 1.2rem;
                }
                
                .desc {
                    margin: 10px 0;
                }
                
                .desc span {
                    font-size: 1.2rem; 
                }
                
                .infos {
                    margin-top: 10px;
                    display: flex;
                    justify-content: space-between;
                }
                
                .info-col {
                    width: calc(97% / 2);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 8px;
                }
                
                .info {
                    border-radius: 3px;
                    padding: 4px 10px;
                    font-weight: 400;
                    
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .info.capturing {
                    color: #F62821;
                    background: #fbecec;
                }
                
                .info.limit {
                    color: #56408C;
                    background-color: #F0ECFB;
                }
                
                .info.date {
                    color: #575757;
                    background-color: #F7F7F7;
                    text-align: center;
                }
                
                .info.more-info {
                    text-align: center;
                    background-color: #B69CF6;
                    color: white;
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
                    <div class="label criticality ${criticality}">${["Crítico", "Atenção"].includes(criticality) ? criticality : "Atributo 'criticality' inválido"}</div>    
                    <div class="label component">${component}</div>
                </div>
                
                <div class="identification">
                    <h1>${uuid}</h1>
                    <span>#${tagName}</span>
                </div>
                
                <div class="desc">
                    <span>${desc}</span>
                </div>
                
                <div class="infos">
                    <div class="info-col">
                        <div class="info capturing">
                            <span>Valor capturado: ${capturing}</span>
                        </div>
                    
                        <div class="info limit">
                            <span>Limite: ${limit}</span>
                        </div>
                    </div>
                    
                    <div class="info-col">
                        <div class="info date">
                            <span>${datetime}</span>
                        </div>
                    
                        <div class="info more-info">
                            <span>Mais informações</span>
                        </div>
                    </div>
                </div>
             </div>
            
        `
    }
}

customElements.define("alert-card", AlertCard);