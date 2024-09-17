class Column extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })

    this.defaultOptions = {
      gap: '1rem',
      justifyContent: 'flex-start'
    }

    this.options = {}
  }

  static get observedAttributes () {
    return ['options']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    this.options = JSON.parse(newValue)
    this.render()
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.options = Object.assign({}, this.defaultOptions, this.options)

    this.shadow.innerHTML =
      /* html */`
      <style>
        :host{
          display: block;
          width: 100%;
        }

        .column{
          display: flex;
          gap: ${this.options.gap};
          justify-content: ${this.options.justifyContent};
        }
      </style>
      <div class="column">
        <slot></slot>
      </div>
    `
  }
}

customElements.define('column-component', Column)
