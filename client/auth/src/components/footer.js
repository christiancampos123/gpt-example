class Footer extends HTMLElement {
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
        footer{
          background-color: hsl(0, 0%, 0%);
          border-top: 2px solid hsl(0, 0%, 100%);
          padding: 2rem 5%;
          width: 90%;
        }
      </style>
      <footer>
        <slot></slot>
      </footer>
    `
  }
}

customElements.define('footer-component', Footer)
