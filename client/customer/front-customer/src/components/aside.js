class Aside extends HTMLElement {
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
        aside{
          background-color: hsl(0, 0%, 0%);
          max-width: 260px;
          min-width: 260px;
          height: 100%;
          overflow-x: hidden;
          position: relative;
          transition: max-width 0.2s ease-in-out, min-width 0.2s ease-in-out;
          z-index: 1001;
        }

        aside.active{
          min-width: 0;
          max-width: 0;
        }

        .toggle-aside-button{
          left: 275px;
          height: 2rem;
          position: fixed;
          top: 50%;
          transform: translate(-50%, -50%);
          transition: left 0.2s ease-in-out;
        }

        .toggle-aside-button.active{
          left: 15px;
        }

        .toggle-aside-button button{
          background-color: transparent;
          border: none;
          cursor: pointer;
          outline: none;
        }

        .toggle-aside-button button span{
          background-color: hsl(235, 7%, 31%);
          display: block;
          height: 0.75rem;
          width: 0.25rem;
        }

        .toggle-aside-button:hover button span{
          background-color: hsl(240, 8%, 80%);
        }

        .toggle-aside-button button span:first-child{
          border-radius: 1rem 1rem 0 0;
        }

        .toggle-aside-button button span:last-child{
          border-radius: 0 0 1rem 1rem;
        }

        .toggle-aside-button:hover button span:first-child{
          transform: rotate(15deg);
          transform-origin: 0 0;
        }

        .toggle-aside-button:hover button span:last-child{
          transform: rotate(-15deg);
          transform-origin: 0 100%;
        }

        .toggle-aside-button.active button span:first-child,
        .toggle-aside-button:hover.active button span:first-child{
          transform: rotate(-15deg);
          transform-origin: 100% 0;
        }

        .toggle-aside-button.active button span:last-child,
        .toggle-aside-button:hover.active button span:last-child{
          transform: rotate(15deg);
          transform-origin: 100% 100%;
        }

        .toggle-aside-button .tooltiptext {
          background-color: black;
          border-radius: 0.5rem;
          color: #fff;
          font-family: 'SoehneBuch', sans-serif;
          font-size: 0.8rem;
          margin-top: -0.5rem;
          margin-left: 2rem;
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

        .toggle-aside-button .tooltiptext::after {
          border-color: transparent #000000 transparent transparent;
          border-style: solid;
          border-width: 5px;
          content: " ";
          left: -10px;
          position: absolute;
          top: 45%;
        }

        .toggle-aside-button:hover .tooltiptext.active {
          opacity: 1;
          visibility: visible;
        }

        .model-start{
          position: fixed;
          left: 1rem;
          top: 1rem;
          z-index: 1000;
        }

        .model-start button{
          background-color: transparent;
          border: none;
          cursor: pointer;
          outline: none;
        }

        .model-start svg{
          width: 1.5rem;
        }

        .model-start svg path{
          fill: hsl(0, 0%, 100%);
        }

      </style>
    
      <aside>
        <slot></slot>
      </aside>

      <div class="toggle-aside-button">
        <span class="tooltiptext active">Cerrar barra lateral</span>
        <span class="tooltiptext">Abrir barra lateral</span>
        <button>
          <span></span>
          <span></span>
        </button>
      </div>

      <div class="model-start">
        <button>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.7929 2.79289C18.0118 1.57394 19.9882 1.57394 21.2071 2.79289C22.4261 4.01184 22.4261 5.98815 21.2071 7.20711L12.7071 15.7071C12.5196 15.8946 12.2652 16 12 16H9C8.44772 16 8 15.5523 8 15V12C8 11.7348 8.10536 11.4804 8.29289 11.2929L16.7929 2.79289ZM19.7929 4.20711C19.355 3.7692 18.645 3.7692 18.2071 4.2071L10 12.4142V14H11.5858L19.7929 5.79289C20.2308 5.35499 20.2308 4.64501 19.7929 4.20711ZM6 5C5.44772 5 5 5.44771 5 6V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V14C19 13.4477 19.4477 13 20 13C20.5523 13 21 13.4477 21 14V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6C3 4.34314 4.34315 3 6 3H10C10.5523 3 11 3.44771 11 4C11 4.55228 10.5523 5 10 5H6Z" fill="currentColor"></path></svg>
        </button>
      </div>
    `

    this.shadow.querySelector('.toggle-aside-button').addEventListener('click', event => {
      this.toggleAside()
    })

    this.shadow.querySelector('.model-start').addEventListener('click', (event) => {
      document.dispatchEvent(new CustomEvent('newChat'))
    })
  }

  toggleAside = () => {
    this.shadow.querySelector('.toggle-aside-button').classList.toggle('active')
    this.shadow.querySelector('aside').classList.toggle('active')

    const activeTooltip = this.shadow.querySelector('.toggle-aside-button .tooltiptext.active')
    const hiddenTooltip = this.shadow.querySelector('.toggle-aside-button .tooltiptext:not(.active)')
    activeTooltip.classList.remove('active')
    hiddenTooltip.classList.add('active')
  }
}

customElements.define('aside-component', Aside)
