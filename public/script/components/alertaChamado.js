class AlertChamado extends HTMLElement {
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
        const responsavel = this.getAttribute("responsavel");
        const time = this.getAttribute("time");
        const desc = this.getAttribute("desc");
        const datetime = this.getAttribute("datetime");
        const suporte = this.getAttribute("suporte");
        const comentario = this.getAttribute("comentario") || "Sem comentários.";


        let optionsStatus = "";

        if (criticality == "Concluido") {
            optionsStatus = `Resolvido por ${suporte}`
        } else if(criticality == "Andamento"){
            optionsStatus = `Atribuido a ${suporte}`
        }
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
                    margin-bottom: 20px;
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
                
                .Pendente {
                    background-color: #dc3545;
                    color: #fff; 
                }
                
                .Andamento {
                    background-color: #ffc107;
                    color: #fff; 
                }
                    .Concluido {
                    background-color: #4caf50;
                    color: #fff; 
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
                
                .info-col {
                    display: flex;
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
                .info.date {
                    color: #fff;
                    background-color:rgb(119, 116, 116);
                    text-align: center;
                    padding: 10px;
                }
                
                .info.more-info {
                    text-align: center;
                    background-color: #B69CF6;
                    color: white;
                    padding: 10px;
                }

                  .feedback {
                margin-top: 15px;
                padding-top: 10px;
                border-top: 1px solid #ddd;
            }

            .toggle-header {
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                color: #3A2E5D;
                font-size: 1.2rem;
                font-weight: 600;
                user-select: none;
            }

            .arrow {
                display: inline-block;
                transition: transform 0.3s ease;
            }

            .arrow.open {
                transform: rotate(90deg);
            }

            .comment-content {
                margin-top: 6px;
                padding-left: 18px;
                font-size: 1rem;
                color: #333;
                display: none;
                transition: all 0.3s ease;
            }

            .comment-content.open {
                display: block;
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
                    <div class="label criticality ${criticality}">${["Pendente", "Andamento", "Concluido"].includes(criticality) ? criticality : "Status inválido"}</div>
                    <div class="label component"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M12 8v5h5v-2h-3V8z"></path><path d="M21.292 8.497a8.957 8.957 0 0 0-1.928-2.862 9.004 9.004 0 0 0-4.55-2.452 9.09 9.09 0 0 0-3.626 0 8.965 8.965 0 0 0-4.552 2.453 9.048 9.048 0 0 0-1.928 2.86A8.963 8.963 0 0 0 4 12l.001.025H2L5 16l3-3.975H6.001L6 12a6.957 6.957 0 0 1 1.195-3.913 7.066 7.066 0 0 1 1.891-1.892 7.034 7.034 0 0 1 2.503-1.054 7.003 7.003 0 0 1 8.269 5.445 7.117 7.117 0 0 1 0 2.824 6.936 6.936 0 0 1-1.054 2.503c-.25.371-.537.72-.854 1.036a7.058 7.058 0 0 1-2.225 1.501 6.98 6.98 0 0 1-1.313.408 7.117 7.117 0 0 1-2.823 0 6.957 6.957 0 0 1-2.501-1.053 7.066 7.066 0 0 1-1.037-.855l-1.414 1.414A8.985 8.985 0 0 0 13 21a9.05 9.05 0 0 0 3.503-.707 9.009 9.009 0 0 0 3.959-3.26A8.968 8.968 0 0 0 22 12a8.928 8.928 0 0 0-.708-3.503z"></path></svg>${time}</div>
                </div>
                
                <div class="identification">
                    <h1>${responsavel}</h1>
                </div>
                
                <div class="desc">
                    <span>${desc}</span>
                </div>
                
                <div class="infos">
                    <div class="info-col">
                        <div class="info date">
                            <span>${datetime}</span>
                        </div>
                    
                        <div class="info more-info">
                            <span>Mais informações</span>
                        </div>
                    </div>
                </div>
                ${optionsStatus ? `<div>${optionsStatus}</div>` : ""}

            <div class="feedback">
                <div class="toggle-header" id="toggleComentario">
                    <span class="arrow" id="arrow">&#9654;</span>
                    Comentários
                </div>
                <div class="comment-content" id="comentario">${comentario}</div>
            </div>
             </div>
            
        `
        const toggle = this.shadowRoot.getElementById("toggleComentario");
        const comment = this.shadowRoot.getElementById("comentario");
        const arrow = this.shadowRoot.getElementById("arrow");
        
        //Abrir e fechar
        toggle.addEventListener("click", () => {
            comment.classList.toggle("open");
            arrow.classList.toggle("open");
        });
    }
}

customElements.define("alerta-chamado", AlertChamado);