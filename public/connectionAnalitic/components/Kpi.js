class Kpi extends HTMLElement {
    constructor() {
        super();
    }

    set value (value) {
        this.setAttribute('value', value);
    }

    set subvalue (subvalue) {
        this.setAttribute('subvalue', subvalue);
    }

    static get observedAttributes() {
        return ["value", "subvalue"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(!oldValue) return;

        if(name === "value") {
            if(!isNaN(Number(newValue))) {
                this.querySelector("#value").textContent = Intl.NumberFormat("pt-br").format(newValue);
                return;
            }

            this.querySelector("#value").textContent = newValue;
        } else if(name === "subvalue") {
            this.querySelector("#subvalue").textContent = newValue;
        }

    }

    connectedCallback() {
        this.render();
        this.activateTooltip();
    }

    render() {
        this.innerHTML = `
            <div class="lg:mt-0 mb-5 w-full h-44 flex flex-col justify-between p-3 rounded-lg relative bg-white shadow-zinc-400 shadow-md">
                <div>
                    <div class="w-13 h-13 rounded-xl bg-gray-200 flex justify-center items-center">
                        <i class="bi ${this.getAttribute("icon-name")} text-4xl text-purple-900" id="icon"></i>
                    </div>

                    <span class="text-purple-900 lg:text-2xl text-4xl font-light" id="title">${this.getAttribute("kpi-title")}</span>
                    
                    <i class="bi bi-question-circle text-purple-900 text-3xl absolute top-1 right-2 cursor-pointer" id="${this.getAttribute("id")}"></i>
                </div>

                <div>
                    <span class="lg:text-3xl text-4xl text-purple-950 font-semibold" id="value">${this.getAttribute("value")}</span>
                    <span class="text-md text-purple-950 font-semibold" id="subvalue">${this.getAttribute("subvalue") || ""}</span>
                </div>
            </div>
        `;
    }

    activateTooltip() {
        const hintText = this.getAttribute("hint");
        const hintId = this.getAttribute("id");
        const hintElement = this.querySelector(`#${hintId}`);

        if (hintElement && hintText) {
            tippy(hintElement, {
                content: hintText,
                placement: 'top'
            });
        }
    }
}

customElements.define('kpi-card', Kpi);
