class NotFound extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.loadData().then(() => this.render())
  }

  async loadData () {
    this.data = {
      title: 'GameXop',
      image: {
        url: 'http://localhost:5175/public/logo.svg',
        alt: 'Logo de GameXop'
      }
    }
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>
      .not-found{
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        height: 100vh;
        width: 100%;
      }

      .not-found img{
        height: 10rem;
        width: 10rem;
      }

      .not-found h1{
        color: hsl(0, 0%, 100%);
        font-family: 'Lato', sans-serif;
        font-size: 3rem;
        font-weight: 700;
        margin: 0;
        text-shadow: 2px 0 0 hsl(284deg 100% 50%), -2px 0 0 hsl(284deg 100% 50%), 0 2px 0 hsl(284deg 100% 50%), 0 -2px 0 hsl(284deg 100% 50%), 1px 1px hsl(284deg 100% 50%), -1px -1px 0 hsl(284deg 100% 50%), 1px -1px 0 hsl(284deg 100% 50%), -1px 1px 0 hsl(284deg 100% 50%);
      }

      .not-found p{
        color: hsl(0, 0%, 100%);
        font-family: 'Lato', sans-serif;
        font-size: 1.5rem;
        font-weight: 400;
        margin: 1rem;
      }

      .not-found a{
        background-color: hsl(284deg 100% 50%);
        border-radius: 0.5rem;
        color: hsl(0, 0%, 100%);
        font-family: 'Lato', sans-serif;
        font-size: 1.2rem;
        font-weight: 400;
        padding: 1rem 2rem;
        text-decoration: none;
      }
    </style>

    <div class="not-found">
      <img src="${this.data.image.url}" alt="${this.data.image.alt}" />
      <h1>${this.data.title}</h1>
      <p>La página que buscas no existe</p>
      <a href="/">Volver al inicio</a>
    </div>
    `

    this.shadow.querySelector('a').addEventListener('click', (event) => {
      event.preventDefault()
      window.history.pushState({}, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
  }
}

customElements.define('notfound-component', NotFound)
