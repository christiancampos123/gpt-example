class Main extends HTMLElement {
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
          main{
            background-color: hsl(240deg 79.84% 22.85%);
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            min-height: 100%;
            padding: 2rem 1rem;
          }
        </style>
        <main>
          <slot></slot>
        </main>
      `
  }
}

customElements.define('main-component', Main)
