class Header extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })

    this.optionSettings = {
      label: 'Header',
      category: 'Layout',
      screenSizes: ['xs', 'sm', 'md', 'lg'],
      styles: {
        backgroundColor: { type: 'color', default: 'transparent' },
        height: { type: 'text', default: '75px' },
        paddingTop: { type: 'text', default: '0' },
        paddingBottom: { type: 'text', default: '0' },
        paddingLeft: { type: 'text', default: '0' },
        paddingRight: { type: 'text', default: '0' }
      }
    }

    this.options = this.initializeOptions()
  }

  static get observedAttributes () {
    return ['options']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'options') {
      try {
        const optionsUpdate = JSON.parse(newValue)
        this.options = { ...this.initializeOptions(), ...optionsUpdate }
      } catch (error) {
        this.options = this.initializeOptions()
      }

      this.render()
    }
  }

  connectedCallback () {
    this.render()
  }

  initializeOptions () {
    return Object.keys(this.optionSettings.styles).reduce((acc, key) => {
      acc[key] = this.optionSettings.styles[key].default
      return acc
    }, {})
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style>
        header{
          background-color: ${this.options.backgroundColor};
          box-sizing: border-box;
          height: ${this.options.height};
          min-height: ${this.options.height};
          padding-top: ${this.options.paddingTop};
          padding-bottom: ${this.options.paddingBottom};
          padding-left: ${this.options.paddingLeft};
          padding-right: ${this.options.paddingRight};
          width: 100%;
        }
      </style>
      <header>
        <slot></slot>
      </header>
    `
  }
}

customElements.define('header-component', Header)
