class PageTitle extends HTMLElement {
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
      h1{
        color: hsl(0, 0%, 100%);
        font-family: 'Lato', sans-serif;
        font-size: 1.2rem;
        font-weight: 700;
        margin: 0;
      }
    </style>

    <h1>${this.getAttribute('title')}</h1>
    `
  }
}

customElements.define('page-title-component', PageTitle)
