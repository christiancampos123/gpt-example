class Message extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  static get observedAttributes () { return ['message', 'type'] }

  connectedCallback () {
    document.addEventListener('message', this.handleMessage.bind(this))
    this.render()
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'message') {
      const message = this.shadow.querySelector('#alert-message')
      message.classList.add('active')

      this.shadow.querySelector('p').textContent = newValue

      setTimeout(function () {
        message.classList.remove('active')
      }, 7000)
    }

    if (name === 'type') {
      const message = this.shadow.querySelector('#alert-message')
      message.classList.add(newValue)
    }
  }

  handleMessage (event) {
    this.setAttribute('message', event.detail.message)
    this.setAttribute('type', event.detail.type)
  }

  render () {
    this.shadow.innerHTML =
        `
        <style>
            #alert-message{
                background-color: hsl(0, 0%, 100%);
                bottom: 3vh;
                opacity: 0;
                padding: 0 1em;
                position: fixed;
                transition: opacity 0.3s;
                right: 2rem;
                width: max-content;
                z-index: -1;
            }

            #alert-message.success{
                border-bottom: 0.2em solid hsl(207, 85%, 69%);
            }

            #alert-message.error{
                border-bottom: 0.2em solid hsl(0, 100%, 50%);
            }

            #alert-message.active{
                opacity: 1;
                z-index: 1;
            }

            p{
                font-family: 'Lato', sans-serif;
                font-size: 1.2em;
            }
        </style>

        <div id="alert-message">
            <p></p>
            <div id="alert-color"></div>
        </div>`
  }
}

customElements.define('message-component', Message)
