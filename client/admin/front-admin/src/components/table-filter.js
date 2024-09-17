import { store } from '../redux/store.js'
import { hideFilter } from '../redux/crud-slice.js'

class TableFilter extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.unsubscribe = null
  }

  connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.tableFilter && currentState.crud.tableFilter === this.getAttribute('endpoint')) {
        this.render()
      }

      if (currentState.crud.tableFilter === null) {
        this.shadow.querySelector('.table-filter')?.classList.remove('active')
      }
    })
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        .table-filter {
          align-items: center;
          background-color: hsla(0, 0%, 0%, 0.6);
          display: flex;
          height: 100vh;
          justify-content: center;
          left: 0;
          opacity: 0;
          position: fixed;
          top: 0;
          transition: opacity 0.3s, visibility 0.3s;
          visibility: hidden;
          width: 100%;
          z-index: 5000;
        }

        .table-filter.active {
          opacity: 1;
          visibility: visible;
        }

        .table-filter-container {
          background-color: hsl(0 0% 0%);
          border: 3px solid hsl(0 0% 100%);
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 1rem;
          width: 40%;
        }

        .table-filter-header {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }

        .table-filter-header h2 {
          color: hsl(0 0% 100%);
          font-family: 'Lato', sans-serif;
          font-size: 1.3rem;
          margin: 0;
        }

        .close-button {
          align-items: center;
          background-color: transparent;
          border: none;
          cursor: pointer;
          display: flex;
        }

        .close-button svg {
          fill: hsl(0 0% 100%);
          height: 2rem;
          width: 2rem;
        }

        .close-button:hover svg {
          fill: hsl(272 40% 35%);
        }
      </style>

      <div class="table-filter">
        <div class="table-filter-container">
          <div class="table-filter-header">
            <h2>Filtrar datos</h2>
            <button type="button" class="close-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    `

    const tableFilter = this.shadow.querySelector('.table-filter')
    tableFilter.classList.add('active')

    const tableFilterContainer = this.shadow.querySelector('.table-filter-container')

    const closeButton = this.shadow.querySelector('.close-button')
    closeButton.addEventListener('click', () => {
      store.dispatch(hideFilter())
    })

    const form = document.createElement('form-component')
    form.setAttribute('endpoint', `${this.getAttribute('endpoint')}`)
    form.setAttribute('structure', this.getAttribute('structure'))
    form.setAttribute('method', 'GET')
    tableFilterContainer.appendChild(form)
  }
}

customElements.define('table-filter-component', TableFilter)
