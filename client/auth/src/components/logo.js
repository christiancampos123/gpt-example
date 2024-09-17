class Logo extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.loadData().then(() => this.render())
  }

  async loadData () {
    this.data = {
      title: 'Pedidos'
    }
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>
      a{
        text-decoration: none;
      }
      
      .logo{
        align-items: center;
        display: flex;
        gap: 1rem;
      }

      .logo h1{
        color: hsl(0, 0%, 100%);
        font-family: 'Lato', sans-serif;
        font-size: 1.2rem;
        font-weight: 700;
        margin: 0;
      }
    </style>

    <a href="/">
      <div class="logo">
        <h1>${this.data.title}</h1>
      </div>
    </a>
    `

    this.shadow.querySelector('a').addEventListener('click', (event) => {
      event.preventDefault()
      window.history.pushState({}, '', '/cliente')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
  }
}

customElements.define('logo-component', Logo)
