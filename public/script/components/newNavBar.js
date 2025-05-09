class NewNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        
        `
    }
}

customElements.define('navigation', NewNavbar);