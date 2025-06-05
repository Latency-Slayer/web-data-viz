class Loader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                div {
                    position: fixed;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    margin: auto;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;
        
                    background-color: rgba(0, 0, 0, 0.25);
                    z-index: 1000;
                }
        
                .loader {
                    position: relative;
                    width: 100px;
                    height: 100px;
                }
        
                .loader:before , .loader:after{
                    content: '';
                    border-radius: 50%;
                    position: absolute;
                    inset: 0;
                    box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3) inset;
                }
                .loader:after {
                    box-shadow: 0 3px 0 #9810fa inset;
                    animation: rotate 1s linear infinite;
                }
        
                @keyframes rotate {
                    0% {  transform: rotate(0)}
                    100% { transform: rotate(360deg)}
                }
            </style>

            <div>
                <span class="loader"></span>
            </div>
        `;
    }
}

customElements.define('screen-loader', Loader);

