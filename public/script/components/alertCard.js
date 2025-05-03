const parentElement = document.currentScript.parentElement;
const criticality = document.currentScript.getAttribute("criticality");
const component = document.currentScript.getAttribute("component");
const uuid = document.currentScript.getAttribute("uuid");
const tagName = document.currentScript.getAttribute("tagName");

parentElement.insertAdjacentHTML("afterbegin", `
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Asap:ital,wght@0,100..900;1,100..900&family=Edu+AU+VIC+WA+NT+Guides:wght@400..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

        * {
            margin: 0;
            padding: 0;
            font-family: 'Poppins', sans-serif;
        }
    
        .card {
            width: 450px;
            height: 270px;
            border: 2px solid rgba(103,86,147,0.47);
            box-shadow: 1px 1px 3px rgba(58,46,93,0.3);
            border-radius: 8px;
            padding: 5px 20px;
        }
        
        .labels {
            height: 50px;
            display: flex;
            align-items: center;
            
            gap: 10px;
        }
        
        .label {
            border-radius: 3px;            
            height: 60%;
            width: fit-content;
            padding: 0 20px;
            font-weight: 500;
            font-size: 1.2rem;
            
            display: flex;
            align-items: center;
            justify-content: center;            
        }
        
        .criticality {
            
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
        
        .identification h1 {
            color: #3A2E5D;
            font-weight: 400;
            margin-bottom: -15px;
        }
        
        .identification span {
            color: #3A2E5D;
            font-weight: 400;
            font-size: 1.3rem;
        }
        
        .desc {
            margin-top: 10px;
        }
        
        .desc span {
            font-size: 1.2rem;
        }
        
        .infos {
            margin-top: 10px;
            display: flex;
            justify-content: center;
            gap: 5px;
        }
        
        .info-col {
            width: calc(90% / 2);
            
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .info {
            border-radius: 3px;
        }
        
        .info.capturing {
            color: #F62821;
            background: #fbecec;
            font-weight: 400;
            
        }
        
        .info.limit {
            color: #56408C;
            background-color: #F0ECFB;
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
            <span>O processador ultrapassou o limite de temperatura.</span>
        </div>
        
        <div class="infos">
            <div class="info-col">
                <div class="info capturing">
                    <span>Valor capturado: 85C°</span>
                </div>
            
                <div class="info limit">
                    <span>Limite: 75C°</span>
                </div>
            </div>
            
            <div class="info-col">
                <div class="info date">
                    <span>01/05/2025 21:00:20</span>
                </div>
            
                <div class="info more-info">
                    <span>Mais informações</span>
                </div>
            </div>
        </div>
    </div>
`);