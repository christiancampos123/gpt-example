class Margins extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.space = this.getAttribute('space') || 1
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
        <style>
          .row{
            box-sizing: border-box;
            padding: 0  ${this.space}%;
          }
        </style>
        <div class="margins">
          <slot></slot>
        </div>
      `
  }
}

customElements.define('margins-component', Margins)
