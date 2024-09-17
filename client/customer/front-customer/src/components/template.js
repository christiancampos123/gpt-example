class Template extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
        <style>
          .template{
            display: grid;
            grid-template-columns: 260px 1fr;
            height: 100%;
          }
        </style>
        <div class="template">
          <slot></slot>
        </div>
      `
  }
}

customElements.define('template-component', Template)
