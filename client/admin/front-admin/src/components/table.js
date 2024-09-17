import isEqual from 'lodash-es/isEqual'
import { store } from '../redux/store.js'
import { showFormElement, showFilter, removeFilterQuery } from '../redux/crud-slice.js'
import Sortable from 'sortablejs'

class Table extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.unsubscribe = null
    this.data = []
  }

  async connectedCallback () {
    this.parent = this.getAttribute('parent') ? JSON.parse(this.getAttribute('parent')) : null
    this.language = this.getAttribute('language') || null
    this.structure = JSON.parse(this.getAttribute('structure').replaceAll("'", '"'))

    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.tableEndpoint === this.getAttribute('endpoint')) {
        this.loadData().then(() => this.render())
      }

      if (currentState.crud.parentElement && this.getAttribute('subtable') && !isEqual(this.parent, currentState.crud.parentElement.data)) {
        this.parent = currentState.crud.parentElement.data
        this.loadData().then(() => this.render())
      }

      if (currentState.crud.filterQuery.query !== this.queryString && currentState.crud.filterQuery.endPoint === `${this.getAttribute('endpoint')}`) {
        this.queryString = currentState.crud.filterQuery.query
        this.loadData().then(() => this.render())
      }
    })

    if (!this.getAttribute('subtable')) {
      this.loadData().then(() => this.render())
    }
  }

  disconnectedCallback () {
    this.unsubscribe && this.unsubscribe()
  }

  async loadData () {
    let endpoint = `${import.meta.env.VITE_API_URL}${this.getAttribute('endpoint')}`

    const query = [
      this.parent ? `parent=${this.parent.id}` : null,
      this.language ? `language=${this.language}` : null
    ].filter(Boolean).join('&')

    endpoint += query ? `?${query}` : ''

    if (this.queryString) {
      endpoint += query ? `&${this.queryString}` : `?${this.queryString}`
    }

    try {
      const response = await fetch(endpoint)

      if (response.status === 200) {
        const data = await response.json()
        this.data = data.rows

        if (data.meta) {
          this.total = data.meta.total
          this.currentPage = data.meta.currentPage
          this.lastPage = data.meta.pages
          this.size = data.meta.size
        }
      } else if (response.status === 500) {
        throw response
      }
    } catch (error) {
      console.log(error)
    }
  }

  async render () {
    this.shadow.innerHTML =
      /* html */`
      <style>

        button {
          background-color: transparent;
          border: none;
          cursor: pointer;
        }

        .table {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 1.5rem;
        }

        .table-buttons {
          background-color: hsl(0, 0%, 100%);
          box-shadow: 5px 10px 19px -7px rgba(0,0,0,0.75);
          display: flex;
          padding: 0 0.5rem;
        }

        .table-button{
          align-items: center;
          display: flex;
          padding: 0.2rem;
        }

        .table-button svg {
          width: 2rem;
        }

        .table-button svg path {
          fill: hsl(236 55% 25%);
        }

        .table-button:hover svg path {
          fill: hsl(272 40% 35%);
        }

        .table-records{
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 1rem;
          min-height: 70vh;
          max-height: 70vh;
          padding: 1rem 10%;
          overflow-x: hidden;
          overscroll-behavior-y: contain;
          overflow-y: auto;
        }

        :host(.dependant) .table-records {
          min-height: 0;
          padding: 0;
        }

        .table-records::-webkit-scrollbar{
          width: 0.7rem; 
        }

        .table-records::-webkit-scrollbar-thumb{
          background-color: hsl(236 55% 25%);
        }

        .table-records::-webkit-scrollbar-thumb:hover{
          background-color: hsl(272 40% 35%);
        }

        .table-record-buttons {
          background-color: hsl(0, 0%, 100%);
          display: flex;
          justify-content: flex-end;
        }

        .table-record-buttons button svg{
          width: 2rem;
        }

        .table-record-buttons svg path{
          fill: hsl(236 55% 25%);
        }

        .table-record-buttons button:hover svg path{
          fill: hsl(272 40% 35%);
        }

        .table-no-records {
          background-color: hsl(272 40% 35%);
          padding: 0.7rem;
        }

        :host(.dependant) .table-no-records {
          width: 100%;
        }

        .table-no-records p {
          color: hsl(0, 0%, 100%);
          font-family: 'Lato', sans-serif;
          font-weight: 400;
          margin: 0;
          text-align: center;
        }

        .table-data{
          background-color: hsl(0, 0%, 0%);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          list-style: none;
          margin: 0;
          padding: 0.5rem;
        }

        .table-data li{
          color: hsl(0, 0%, 100%);
          font-family: 'Lato', sans-serif;
          font-weight: 400;
        }

        .table-data li span {   
          color: hsl(0, 0%, 100%);
          font-family: 'Lato', sans-serif;  
          font-weight: 400;
        }

        .table-data li span::after {
          content: ":";
          margin-right: 0.5rem;
        }

        .table-pagination{
          background-color: hsl(0, 0%, 100%);
          box-shadow: 5px 10px 19px -7px rgba(0, 0, 0, 0.75);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
        }

        .table-pagination-info{
          display: flex;
          justify-content: space-between;
        }

        .table-pagination-info span{
          color: hsl(0, 0%, 0%);
          font-family: 'Lato', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          margin: 0;
        }

        .table-pagination-pages{
          display: flex;
          gap: 0.5rem;
        }

        .table-pagination-page button{
          color: $secondary-color;
          font-family: sans-serif;
          font-weight: 700;
        }

        .table-pagination-page.active button{
          color: $hover-color;
        }

        .table-pagination-page:hover button{
          color: $hover-color;
        }

        .table-pagination-page.inactive button{
          color: hsl(0, 0%, 69%);
          cursor: not-allowed;
        }

        .sortable-group {
          display: flex;
          flex-direction: column;
          list-style: none;
          padding: 1rem 0;
        }

        .sortable-row {
          background-color: hsl(272 40% 35%);
          border: 1px solid #ddd;
          color: hsl(100, 100%, 100%);
          cursor: move;
          font-family: 'Roboto', sans-serif;
          font-weight: 700;
          margin: 0.5rem 0;
          padding: 1em;
        }

        .sortable-row.sortable-ghost {
          background-color: hsl(19, 100%, 50%);
        }
      </style>

      <section class="table-section">
        <div class="table-buttons"></div>
        <div class="table"></div>
        <div class="table-pagination"></div>
      </section>
    `

    if (this.structure.tableButtons) {
      const tableButtons = this.shadow.querySelector('.table-buttons')

      Object.keys(this.structure.tableButtons).forEach(tableButton => {
        const tableButtonElement = document.createElement('button')
        tableButtonElement.classList.add('table-button')

        if (this.structure.tableButtons[tableButton] === 'filterButton') {
          if (this.queryString) {
            tableButtonElement.classList.add('table-filter-reset-button')
            tableButtonElement.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.76,20.83L17.6,18L14.76,15.17L16.17,13.76L19,16.57L21.83,13.76L23.24,15.17L20.43,18L23.24,20.83L21.83,22.24L19,19.4L16.17,22.24L14.76,20.83M12,12V19.88C12.04,20.18 11.94,20.5 11.71,20.71C11.32,21.1 10.69,21.1 10.3,20.71L8.29,18.7C8.06,18.47 7.96,18.16 8,17.87V12H7.97L2.21,4.62C1.87,4.19 1.95,3.56 2.38,3.22C2.57,3.08 2.78,3 3,3V3H17V3C17.22,3 17.43,3.08 17.62,3.22C18.05,3.56 18.13,4.19 17.79,4.62L12.03,12H12Z" /></svg>
            `
          } else {
            tableButtonElement.classList.add('table-filter-button')
            tableButtonElement.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11 11L16.76 3.62A1 1 0 0 0 16.59 2.22A1 1 0 0 0 16 2H2A1 1 0 0 0 1.38 2.22A1 1 0 0 0 1.21 3.62L7 11V16.87A1 1 0 0 0 7.29 17.7L9.29 19.7A1 1 0 0 0 10.7 19.7A1 1 0 0 0 11 18.87V11M13 16L18 21L23 16Z" /></svg>
            `
          }
        }

        if (this.structure.tableButtons[tableButton] === 'sortableButton') {
          tableButtonElement.classList.add('sortable-button')
          tableButtonElement.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9,3L5,7H8V14H10V7H13M16,17V10H14V17H11L15,21L19,17H16Z" /></svg>
          `
        }

        tableButtons.appendChild(tableButtonElement)
      })
    }

    if (!this.getAttribute('subtable')) {
      const tablePagination = this.shadow.querySelector('.table-pagination')

      const tablePaginationInfo = document.createElement('div')
      tablePaginationInfo.classList.add('table-pagination-info')
      tablePagination.appendChild(tablePaginationInfo)

      const tablePaginationTotal = document.createElement('div')
      tablePaginationTotal.classList.add('table-pagination-total')
      tablePaginationInfo.appendChild(tablePaginationTotal)

      const tablePaginationTotalSpan = document.createElement('span')
      tablePaginationTotalSpan.textContent = this.total === 1 ? `${this.total} registro en total,  mostrando ${this.size} por página` : `${this.total} registros en total, mostrando ${this.size} por página`
      tablePaginationTotal.appendChild(tablePaginationTotalSpan)

      const tablePaginationPages = document.createElement('div')
      tablePaginationPages.classList.add('table-pagination-pages')
      tablePaginationInfo.appendChild(tablePaginationPages)

      if (this.lastPage > 1) {
        const previousPageUrl = document.createElement('div')

        if (this.currentPage === 1) {
          previousPageUrl.classList.add('table-pagination-button', 'inactive')
        } else {
          previousPageUrl.classList.add('table-pagination-button')
        }

        previousPageUrl.id = 'previousPageUrl'
        tablePaginationPages.appendChild(previousPageUrl)

        const previousPageButton = document.createElement('button')
        previousPageButton.textContent = '<<'
        previousPageUrl.appendChild(previousPageButton)

        const currentPage = document.createElement('div')
        currentPage.classList.add('table-pagination-page', 'active')
        tablePaginationPages.appendChild(currentPage)

        const currentPageSpan = document.createElement('span')
        currentPageSpan.textContent = `Mostrando la página ${this.currentPage} de un total de ${this.lastPage}`
        currentPage.appendChild(currentPageSpan)

        const nextPageUrl = document.createElement('div')

        if (this.currentPage === this.lastPage) {
          nextPageUrl.classList.add('table-pagination-button', 'inactive')
        } else {
          nextPageUrl.classList.add('table-pagination-button')
        }

        nextPageUrl.id = 'nextPageUrl'
        tablePaginationPages.appendChild(nextPageUrl)

        const nextPageButton = document.createElement('button')
        nextPageButton.textContent = '>>'
        nextPageUrl.appendChild(nextPageButton)
      } else {
        const firstPageUrl = document.createElement('div')
        firstPageUrl.classList.add('table-pagination-page', 'inactive')
        firstPageUrl.id = 'firstPageUrl'
        tablePaginationPages.appendChild(firstPageUrl)

        const firstPageButton = document.createElement('button')
        firstPageButton.textContent = '<<'
        firstPageUrl.appendChild(firstPageButton)
      }
    }

    await this.getTableData()
    await this.renderTableButtons()
    await this.renderPaginationButtons()
  }

  async getTableData () {
    const table = this.shadow.querySelector('.table')
    const tableRecords = document.createElement('div')
    tableRecords.classList.add('table-records')
    table.appendChild(tableRecords)

    if (this.data.length === 0) {
      const tableNoRecords = document.createElement('div')
      tableNoRecords.classList.add('table-no-records')
      const message = document.createElement('p')
      message.innerHTML = 'No hay registros'
      tableNoRecords.appendChild(message)
      tableRecords.appendChild(tableNoRecords)
      return
    }

    this.data.forEach(element => {
      const tableRow = document.createElement('div')
      tableRow.classList.add('table-row')

      if (this.structure.sortable) {
        tableRow.dataset.id = element.id
      }

      const tableButtons = document.createElement('div')
      tableButtons.classList.add('table-record-buttons')
      tableRow.appendChild(tableButtons)

      const tableRowData = document.createElement('ul')
      tableRowData.classList.add('table-data')
      tableRow.appendChild(tableRowData)

      const headers = this.structure.headers
      const recordButtons = this.structure.recordButtons

      Object.keys(headers).forEach(key => {
        const tableElementData = document.createElement('li')
        const tableDataHeader = document.createElement('span')

        tableDataHeader.classList.add('table-data-header')
        tableDataHeader.innerHTML = headers[key].label
        tableElementData.appendChild(tableDataHeader)

        if (element[headers[key].field]) {
          tableElementData.innerHTML += element[headers[key].field]
        }

        tableRowData.appendChild(tableElementData)
      })

      Object.keys(recordButtons).forEach((recordButton) => {
        const tableButton = document.createElement('button')
        tableButton.classList.add('table-button')

        if (recordButtons[recordButton] === 'view') {
          tableButton.classList.add('edit-button')
          tableButton.dataset.id = element.id
          tableButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                        </svg>`
        }

        if (recordButtons[recordButton] === 'edit') {
          tableButton.classList.add('edit-button')
          tableButton.dataset.id = element.id
          tableButton.innerHTML = `
                        <svg viewBox="0 0 24 24">
                            <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                        </svg>`
        }

        if (recordButtons[recordButton] === 'remove') {
          tableButton.classList.add('remove-button')
          tableButton.dataset.id = element.id
          tableButton.innerHTML = `
                        <svg viewBox="0 0 24 24">
                            <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                        </svg>`
        }

        tableButtons.appendChild(tableButton)
      })

      tableRecords.appendChild(tableRow)
    })
  }

  async renderTableButtons () {
    const tableSection = this.shadow.querySelector('.table-section')

    tableSection.addEventListener('click', async (event) => {
      if (event.target.closest('.sortable-button')) {
        const sortableButton = event.target.closest('.sortable-button')

        if (sortableButton.classList.contains('active')) {
          sortableButton.classList.remove('active')
          sortableButton.querySelector('path').setAttribute('d', 'M9,3L5,7H8V14H10V7H13M16,17V10H14V17H11L15,21L19,17H16Z')
          this.shadow.querySelector('.table').innerHTML = ''
          await this.getTableData()
        } else {
          sortableButton.classList.add('active')
          sortableButton.querySelector('path').setAttribute('d', 'M22,14A2,2 0 0,1 20,16H4A2,2 0 0,1 2,14V10A2,2 0 0,1 4,8H20A2,2 0 0,1 22,10V14M4,14H8V10H4V14M10,14H14V10H10V14M16,14H20V10H16V14Z')
          this.shadow.querySelector('.table').innerHTML = ''
          const table = this.shadow.querySelector('.table')

          let url = `${import.meta.env.VITE_API_URL}${this.getAttribute('endpoint')}/sortable`

          const query = [
            this.parent ? `parent=${this.parent.id}` : null,
            this.language ? `language=${this.language}` : null
          ].filter(Boolean).join('&')

          url += query ? `?${query}` : ''

          this.sortableData = await fetch(url).then(response => response.json())

          console.log(this.sortableData)
          await this.renderSortable(table, this.sortableData)
        }
      }

      if (event.target.closest('.edit-button')) {
        const editButton = event.target.closest('.edit-button')
        let endpoint = import.meta.env.VITE_API_URL + this.getAttribute('endpoint') + '/' + editButton.dataset.id

        const query = [
          this.parent ? `parent=${this.parent.id}` : null,
          this.language ? `language=${this.language}` : null
        ].filter(Boolean).join('&')

        endpoint += query ? `?${query}` : ''

        try {
          const response = await fetch(endpoint)

          if (response.status === 500 || response.status === 404) {
            throw response
          }

          if (response.status === 200) {
            const data = await response.json()

            const formElement = {
              endPoint: this.getAttribute('endpoint'),
              data
            }

            store.dispatch(showFormElement(formElement))
          }
        } catch (error) {
          document.dispatchEvent(new CustomEvent('message', {
            detail: {
              message: 'Fallo al cargar el elemento',
              type: 'error'
            }
          }))
        }
      }

      if (event.target.closest('.remove-button')) {
        const removeButton = event.target.closest('.remove-button')

        let element = `${import.meta.env.VITE_API_URL}${this.getAttribute('endpoint')}/${removeButton.dataset.id}`

        const query = [
          this.parent ? `parent=${this.parent.id}` : null,
          this.language ? `language=${this.language}` : null
        ].filter(Boolean).join('&')

        element += query ? `?${query}` : ''

        document.dispatchEvent(new CustomEvent('showDeleteModal', {
          detail: {
            element,
            endPoint: this.getAttribute('endpoint')
          }
        }))
      }

      if (event.target.closest('.table-filter-button')) {
        store.dispatch(showFilter(this.getAttribute('endpoint')))
      }

      if (event.target.closest('.table-filter-reset-button')) {
        this.queryString = null
        store.dispatch(removeFilterQuery())
        this.loadData().then(() => this.render())
      }
    })
  }

  async renderSortable (parentElement, elements, nestedElement = false) {
    const table = this.shadow.querySelector('.table')
    const group = nestedElement ? parentElement : document.createElement('div')
    group.classList.add('sortable-group')

    if (!nestedElement) {
      parentElement.appendChild(group)
    }

    for (const item in elements) {
      const element = elements[item]

      if (element.parent && !nestedElement) {
        continue
      }

      const row = document.createElement('div')
      row.classList.add('sortable-row')
      console.log(element)
      row.textContent = `${element.label}: ${element.value}`
      row.dataset.id = element.id

      const nestedGroup = document.createElement('div')
      nestedGroup.classList.add('sortable-group')
      row.appendChild(nestedGroup)

      if (element.children) {
        await this.renderSortable(nestedGroup, element.children, true)
      }

      group.appendChild(row)
    }

    if (!nestedElement) {
      table.querySelectorAll('.sortable-group').forEach(group => {
        // eslint-disable-next-line no-new
        new Sortable(group, {
          group: 'nested',
          sort: true,
          animation: 150,
          fallbackOnBody: true,
          swapThreshold: 1,
          onEnd: async (event) => {
            const items = []
            const sortableElements = event.to.querySelectorAll('.sortable-row')
            sortableElements.forEach((element, index) => {
              items.push({
                id: element.dataset.id,
                parent: element.parentElement.parentElement.dataset.id ? element.parentElement.parentElement.dataset.id : null,
                order: index
              })
            })

            let data = {
              items
            }

            data = {
              ...data,
              ...(this.parent && { parent: this.parent.id }),
              ...(this.language && { language: this.language })
            }

            try {
              const url = `${import.meta.env.VITE_API_URL}${this.getAttribute('endpoint')}/update-order`

              const response = fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              })

              if (response.status === 200) {
                document.dispatchEvent(new CustomEvent('message', {
                  detail: {
                    message: data.message || 'Orden guardado correctamente',
                    type: 'success'
                  }
                }))
              }
            } catch (error) {
              document.dispatchEvent(new CustomEvent('message', {
                detail: {
                  message: data.message || 'Fallo al guardar el orden',
                  type: 'error'
                }
              }))
            }
          }
        })
      })
    }
  }

  async renderPaginationButtons () {
    const tablePaginationButtons = this.shadow.querySelectorAll('.table-pagination-button')

    tablePaginationButtons.forEach(tablePaginationButton => {
      tablePaginationButton.addEventListener('click', async () => {
        let page

        switch (tablePaginationButton.id) {
          case 'previousPageUrl':
            if (parseInt(this.currentPage) === 1) return
            page = parseInt(this.currentPage) - 1
            break

          case 'nextPageUrl':
            if (parseInt(this.currentPage) === parseInt(this.lastPage)) return
            page = parseInt(this.currentPage) + 1
            break
        }

        const endpoint = this.queryString ? `${import.meta.env.VITE_API_URL}${this.getAttribute('endpoint')}?page=${page}&${this.queryString}` : `${import.meta.env.VITE_API_URL}${this.getAttribute('endpoint')}?page=${page}`

        try {
          const response = await fetch(endpoint)

          if (response.status === 500) {
            throw response
          }

          if (response.status === 200) {
            const data = await response.json()
            this.data = data.rows
            this.total = data.meta.total
            this.currentPage = data.meta.currentPage
            this.lastPage = data.meta.pages
            this.size = data.meta.size

            this.render()
          }
        } catch (error) {
          const data = await error.json()

          document.dispatchEvent(new CustomEvent('message', {
            detail: {
              message: data.message || 'Fallo al cargar los datos',
              type: 'error'
            }
          }))
        }
      })
    })
  }
}

customElements.define('table-component', Table)
