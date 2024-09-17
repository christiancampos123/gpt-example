import { store } from '../redux/store.js'
import { setAssistant, setThread } from '../redux/chat-slice.js'

class Assistants extends HTMLElement {

  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = []
  }

  connectedCallback () {
    this.loadData().then(() => this.render())
  }

  async loadData () {
    const url = `${import.meta.env.VITE_API_URL}/api/customer/assistants`

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('customerAccessToken')
        }
      })

      this.data = await response.json()

    } catch (error) {
      console.log(error)
    }
  }

  render () {

    this.shadow.innerHTML =
    /*html*/`
      <style>
        .assistants{
          padding: 1rem;
        }

        .assistant{
          border: 1px solid hsla(210, 3%, 13%, 0);
          border-radius: 0.3rem;
          display: flex;
          gap: 0.5rem;
          padding: 0.3rem;
        }

        .assistant:hover{
          background-color: hsl(220, 4%, 13%);
          border: 1px solid hsla(210, 3%, 13%, 0.50);
          cursor: pointer;
        }

        .assistant-icon{
          align-items: center;
          background-color: hsl(0, 0%, 100%);
          border-radius: 50%;
          display: flex;
          height: 1.8rem;
          justify-content: center;
          overflow: hidden;
          width: 1.8rem;
        }

        .assistant-icon svg{
          width: 1.2rem;
        }

        .assistant-name{
          align-self: center;
          flex: 1;
        }

        .assistant-name span{
          color: hsl(0, 0%, 100%);
          font-family: 'SoehneBuch', sans-serif; 
          font-size: 0.8rem;
          font-weight: 600;
        }

        .assistant-start{
          align-self: center;
          position: relative;
        }

        .assistant-start svg{
          width: 1.2rem;
        }

        .assistant-start svg path{
          fill: hsl(0, 0%, 100%);
        }

        .assistant-start .tooltiptext {
          background-color: black;
          border-radius: 0.5rem;
          color: #fff;
          font-family: 'SoehneBuch', sans-serif;
          font-size: 0.8rem;
          margin-top: -0.5rem;
          margin-left: 3rem;
          opacity: 0;
          padding: 0.5rem 0;
          pointer-events: none; 
          position: absolute;
          text-align: center;
          transition: opacity 0.3s;
          visibility: hidden;
          width: 100px;
          z-index: 1001;
        }

        .assistant-start .tooltiptext::after {
          border-color: transparent #000000 transparent transparent;
          border-style: solid;
          border-width: 5px;
          content: " ";
          left: -10px;
          position: absolute;
          top: 35%;
        }

        .assistant-start:hover .tooltiptext {
          opacity: 1;
          visibility: visible;
        }
      </style>
    
      <section class="assistants"></section>
    `

    const assistants = this.shadow.querySelector('.assistants')

    this.data.forEach(assistant => {
      const assistantElement = document.createElement('div')
      assistantElement.classList.add('assistant')
      assistantElement.dataset.assistantId = assistant.id

      const assistantIcon = document.createElement('div')
      assistantIcon.classList.add('assistant-icon')
      assistantIcon.innerHTML = ""

      const assistantName = document.createElement('div')
      assistantName.classList.add('assistant-name')
      const name = document.createElement('span')
      name.textContent = assistant.name
      assistantName.appendChild(name)

      const assistantStart = document.createElement('div')
      assistantStart.classList.add('assistant-start')

      assistantStart.innerHTML = `<svg viewBox="0 0 24 24"><path d="M16.7929 2.79289C18.0118 1.57394 19.9882 1.57394 21.2071 2.79289C22.4261 4.01184 22.4261 5.98815 21.2071 7.20711L12.7071 15.7071C12.5196 15.8946 12.2652 16 12 16H9C8.44772 16 8 15.5523 8 15V12C8 11.7348 8.10536 11.4804 8.29289 11.2929L16.7929 2.79289ZM19.7929 4.20711C19.355 3.7692 18.645 3.7692 18.2071 4.2071L10 12.4142V14H11.5858L19.7929 5.79289C20.2308 5.35499 20.2308 4.64501 19.7929 4.20711ZM6 5C5.44772 5 5 5.44771 5 6V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V14C19 13.4477 19.4477 13 20 13C20.5523 13 21 13.4477 21 14V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6C3 4.34314 4.34315 3 6 3H10C10.5523 3 11 3.44771 11 4C11 4.55228 10.5523 5 10 5H6Z"></path></svg>`

      const assistantStartTooltip = document.createElement('span')
      assistantStartTooltip.classList.add('tooltiptext')
      assistantStartTooltip.innerHTML = 'Nuevo chat'
      assistantStart.appendChild(assistantStartTooltip)

      assistantElement.appendChild(assistantIcon)
      assistantElement.appendChild(assistantName)
      assistantElement.appendChild(assistantStart)
      assistants.appendChild(assistantElement)
    });

    this.shadow.querySelector('.assistants').addEventListener('click', (event) => {

      if (event.target.closest('.assistant')){

        const assistantElement = event.target.closest('.assistant')

        this.data.forEach(assistant => {
          if (assistant.id === parseInt(assistantElement.dataset.assistantId)) {
            store.dispatch(setAssistant(assistant))
          }
        })

        store.dispatch(setThread(null))      
      }
    })
  }
}

customElements.define('assistants-component', Assistants)