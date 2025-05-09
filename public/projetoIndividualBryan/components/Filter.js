class Filter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
                <div class="w-[calc((100%/3)-10px)] h-8 relative" id="filter-${this.getAttribute("filter-name")}">
                    <div class="filter-content border border-purple-900 w-full h-full rounded-full flex justify-evenly items-center text-xl font-medium text-purple-900 cursor-pointer">
                        <i class="bi ${this.getAttribute("icon")}"></i>
                        <span>${this.getAttribute("text") || this.getAttribute("filter-name")}</span>
                        <i class="bi bi-caret-down-fill"></i>
                    </div>
                
                    <div class="options-div w-full h-fit absolute z-10 bg-white options shadow-lg scale-y-0 origin-top transition-transform duration-300">
                        
                    </div>
                </div>
            `;

        this.options();
        this.openOrCloseOptions();
    }

    options () {
        let options = this.getAttribute('options');
        options = eval(options)
        options = options.sort((a, b) => a.value > b.value ? 1 : -1)

        // const icon = this.getAttribute('icon');
        const filterId = "filter-" + this.getAttribute('filter-name');

        const select = document.querySelector(`#${filterId} .options`);


        select.insertAdjacentHTML("beforeend", `
            <div class="p-2">
                <span class="clean-filter text-purple-900 font-bold cursor-pointer hover:text-purple-600 transition-all">Limpar filtro</span>
            </div>
        `);

        eval(options).forEach((option) => {
            if(option.value === this.getAttribute("value")) return;

            select.insertAdjacentHTML('beforeend', `
                        <div value="${option.value}" text=${option.text} class="option w-full h-10 flex justify-start items-center indent-5 text-purple-900 hover:bg-purple-900 hover:text-white cursor-pointer transition-all border-b">
                            <span class="font-medium text-xl">${option.text}</span>
                        <div>`
            );
        })


        this.selectOption();
        this.cleanFilter();
    }


    selectOption() {
        const optionsElements = this.querySelectorAll('.option');

        optionsElements.forEach((option) => {
            option.addEventListener('click', () => {
                const value = option.getAttribute('value');
                const text = option.getAttribute('text');

                this.setAttribute('value', value);
                this.setAttribute('text', text);

                this.render()
            });
        });
    }


    cleanFilter() {
        const el = this.querySelector(".clean-filter")

        el.onclick = () => {
            this.removeAttribute("value");
            this.removeAttribute("text");
            this.render();
        }

    }

    openOrCloseOptions() {
        const filterContent = this.querySelector('.filter-content');
        const optionsDiv = this.querySelector(".options-div");



        filterContent.addEventListener('click', (e) => {
           optionsDiv.classList.toggle('scale-y-100');
        });

    }
}

customElements.define('filter-select', Filter);

