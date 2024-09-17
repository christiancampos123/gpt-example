class Header extends HTMLElement {
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
        header{
          align-items: center;
          background-color: hsla(0, 0%, 0%);
          display: flex;
          justify-content: space-between;
          min-height: 5vh;
          padding: 0.5rem 1rem;
        }
      </style>
      <header>
        <slot></slot>
      </header>
    `
  }
}

customElements.define('header-component', Header)
