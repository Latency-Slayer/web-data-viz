class Kpi extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.activateTooltip();
    }

    render() {
        this.innerHTML = `
            <div class="w-full h-44 flex flex-col justify-between p-3 rounded-lg relative bg-white shadow-zinc-400 shadow-md">
                <div>
                    <div class="w-13 h-13 rounded-xl bg-gray-200 flex justify-center items-center">
                        <i class="bi ${this.getAttribute("icon-name")} text-4xl text-purple-900"></i>
                    </div>

                    <span class="text-purple-900 text-lg font-medium">${this.getAttribute("kpi-title")}</span>
                    
                    <i class="bi bi-question-circle text-purple-900 text-3xl absolute top-1 right-2 cursor-pointer" id="${this.getAttribute("id")}"></i>
                </div>

                <span class="text-3xl text-purple-950 font-semibold">${this.getAttribute("value")}</span>
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
