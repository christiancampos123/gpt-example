class Logo extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  static get observedAttributes () {}

  connectedCallback () {
    this.render()
  }

  attributeChangedCallback (name, oldValue, newValue) {}

  render () {
    this.shadow.innerHTML =
      `
      <style>
          h2 {   
              color: hsl(0, 0%, 100%);
              font-family: 'Roboto', sans-serif;
              font-size: 2em;
              font-weight: 600;
              margin: 0;
              text-decoration: none;
          }
      </style>

      <h2>${this.getAttribute('title')}</h2>
      `
  }
}

customElements.define('logo-component', Logo)
