import isEqual from 'lodash-es/isEqual'
import { store } from '../redux/store.js'
import { newPrompt } from '../redux/chat-slice.js'

class Examples extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = []
    this.unsubscribe = null
    this.assistant = null
  }

  connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.chat.assistant && !isEqual(this.assistant, currentState.chat.assistant) && currentState.chat.assistant.examples.length > 0) {
        this.assistant = currentState.chat.assistant
        this.render()
      }

      if (currentState.chat.prompt) {
        this.shadow.querySelector('.examples').innerHTML = ''
      }
    })
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
      <style>
        :host{
          width: 100%;
        }
        
        .examples{
          display: grid;
          grid-template-columns: repeat(2 , minmax(300px,1fr));
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .example{
          border: 1px solid hsl(0, 0%, 40%);
          border-radius: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          justify-content: center;
          padding: 1rem;
          position: relative;
        }

        .example:hover{
          background-color: hsl(236, 10%, 28%);
          cursor: pointer;
        }

        .example-title h2{
          color: hsla(0, 0%, 100%, 0.7);
          font-family: 'SoehneBuch', Arial;
          font-size: 0.8rem;
          font-weight: 600;
          margin: 0;
        }

        .example-description p{
          color: hsl(0, 0%, 100%);
          font-family: 'SoehneBuch', Arial;
          font-size: 0.9em;
          margin: 0;
          opacity: 0.5;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .example .example-send{
          align-items: center;
          background-color: hsla(236, 10%, 28%, 0.911);
          display: flex;
          height: 90%;
          justify-content: center;
          opacity: 0;
          position: absolute;
          right: 0;
          width: 10%;
          z-index: 1000;
        }

        .example:hover .example-send{
          opacity: 1;
        }

        .example-send-button{
          background-color: hsl(235, 11%, 23%);
          border-radius: 0.3rem;
          padding: 0.25rem;
        }

        .example-send-button svg{
          height: 0.8rem;
          width: 0.8rem;
        }

        .example-send-button svg path{
          fill: white;
        }

        .example-send-button .tooltiptext{
          background-color: black;
          border-radius: 0.5rem;
          color: #fff;
          font-family: 'SoehneBuch', sans-serif;
          font-size: 0.8rem;
          margin-top: -3.5rem;
          margin-left: -5rem;
          opacity: 0;
          padding: 0.5rem 0;
          pointer-events: none; 
          position: absolute;
          text-align: center;
          transition: opacity 0.3s;
          width: 150px;
          z-index: 1001;
        }

        .example-send-button .tooltiptext::after {
          border-color: rgb(0, 0, 0) transparent transparent transparent;
          border-style: solid;
          border-width: 5px;
          content: "";
          left: 45%;
          position: absolute;
          top: 100%;   
        }

        .example-send-button:hover .tooltiptext{
          opacity: 1;
          visibility: visible;
        }

        @media (max-width: 800px) {
          .examples{
            grid-template-columns: repeat(1, 1fr);
          }
        }
      </style>
    
      <section class="examples"></section>
    `

    const examples = this.shadow.querySelector('.examples')

    this.assistant.examples.forEach(example => {
      const exampleElement = document.createElement('article')
      exampleElement.classList.add('example')
      exampleElement.dataset.prompt = example.prompt

      const exampleTitle = document.createElement('div')
      exampleTitle.classList.add('example-title')

      const exampleTitleH2 = document.createElement('h2')
      exampleTitleH2.textContent = example.title

      const exampleDescription = document.createElement('div')
      exampleDescription.classList.add('example-description')

      const exampleDescriptionP = document.createElement('p')
      exampleDescriptionP.textContent = example.description

      const exampleSend = document.createElement('div')
      exampleSend.classList.add('example-send')

      const exampleSendButton = document.createElement('div')
      exampleSendButton.classList.add('example-send-button')

      const exampleSendButtonTooltip = document.createElement('span')
      exampleSendButtonTooltip.classList.add('tooltiptext')
      exampleSendButtonTooltip.textContent = 'Haz click para enviar'

      exampleSendButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z" /></svg>'

      exampleSendButton.appendChild(exampleSendButtonTooltip)
      exampleSend.appendChild(exampleSendButton)
      exampleTitle.appendChild(exampleTitleH2)
      exampleDescription.appendChild(exampleDescriptionP)
      exampleElement.appendChild(exampleTitle)
      exampleElement.appendChild(exampleDescription)
      exampleElement.appendChild(exampleSend)
      examples.appendChild(exampleElement)
    })

    examples.addEventListener('click', (event) => {
      if (event.target.closest('.example')) {
        const prompt = event.target.closest('.example').dataset.prompt
        store.dispatch(newPrompt(prompt))
      }
    })
  }
}

customElements.define('examples-component', Examples)
