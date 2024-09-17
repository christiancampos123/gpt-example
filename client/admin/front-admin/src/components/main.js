class Main extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.padding = this.getAttribute('padding') || '0'
    this.gap = this.getAttribute('gap') || '2rem'
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
        <style>
          main{
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: ${this.gap};
            height: 100%;
            padding: ${this.padding};
          }
        </style>
        <main>
          <slot></slot>
        </main>
      `
  }
}

customElements.define('main-component', Main)
