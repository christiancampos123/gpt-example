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
            align-items: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 0 23%;
            width: 54%;
          }

          @media (max-width: 1200px) {
            main{
              padding: 0 5%;
              width: 90%;
            }
          }

          @media (max-width: 800px) {
            main{
              padding: 0 5%;
              width: 90%;
            }
          }
        </style>
        <main>
          <slot></slot>
        </main>
      `
  }
}

customElements.define('main-component', Main)
