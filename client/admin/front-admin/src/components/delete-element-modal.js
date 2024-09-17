import { store } from '../redux/store.js'
import { showFormElement, refreshTable } from '../redux/crud-slice.js'

class DeleteElementModal extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    document.addEventListener('showDeleteModal', this.handleShowDeleteModal.bind(this))
    this.render()
  }

  handleShowDeleteModal (event) {
    this.element = event.detail.element
    this.endPoint = event.detail.endPoint
    this.shadow.querySelector('.overlayer').classList.add('active')
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style>
          .overlayer {
            align-items: center;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            height: 100vh;
            justify-content: center;
            left: 0;
            opacity: 0;
            position: fixed;
            top: 0;
            transition: opacity 0.3s;
            visibility: hidden;
            width: 100%;
            z-index: -1;
          }

          .overlayer.active {
            opacity: 1;
            visibility: visible;
            z-index: 1000;
          }

          .modal-delete{
            background-color: hsl(0, 0%, 100%);
            position: absolute;
            width: 500px;
          }
          
          .modal-delete-header{
              background-color: $grey;
              border-bottom: 1px solid #e9ecef;
              padding: 0.5em 1em;
              text-align: center;
          }

          .modal-delete-header h4{
              font-size: 1.2em;
              font-family: 'Roboto', sans-serif;
              margin: 0;
          }
          
          .modal-delete-footer{
              display: flex;
          }

          .modal-delete-option{
              color: hsl(0, 0%, 100%);
              cursor: pointer;
              font-weight: 600;
              font-family: 'Roboto', sans-serif;
              text-align: center;
              width: 50%;
          }

          .modal-delete-option:hover{
            filter: brightness(1.2);
          }

          .modal-delete-option#delete-cancel{
              background-color: hsl(183, 98%, 35%);;
          }

          .modal-delete-option#delete-confirm{
              background-color: hsl(0, 65%, 55%);
          }
      </style>

      <div class="overlayer">
        <div class="modal-delete">
          <div class="modal-delete-content">
              <div class="modal-delete-header">
                  <h4>¿Quiere eliminar este registro?</h4>
              </div>

              <div class="modal-delete-footer">
                <div class="modal-delete-option" id="delete-confirm">
                  <h4>Sí</h4>
                </div>
                <div class="modal-delete-option " id="delete-cancel">
                  <h4>No</h4>
                </div>
              </div>
            </div>
        </div>
      </div>
      `

    this.shadow.querySelector('#delete-confirm').addEventListener('click', () => {
      fetch(this.element, {
        method: 'DELETE'
      }).then(response => {
        return response.json()
      }).then(data => {
        store.dispatch(showFormElement({
          endPoint: this.endPoint,
          data: null
        }))

        store.dispatch(refreshTable(this.endPoint))

        document.dispatchEvent(new CustomEvent('message', {
          detail: {
            message: data.message,
            type: 'success'
          }
        }))

        this.shadow.querySelector('.overlayer').classList.remove('active')
      }).catch(error => {
        document.dispatchEvent(new CustomEvent('message', {
          detail: {
            message: error.message,
            type: 'error'
          }
        }))
      })
    })

    this.shadow.querySelector('#delete-cancel').addEventListener('click', () => {
      this.shadow.querySelector('.overlayer').classList.remove('active')
    })
  }
}

customElements.define('delete-element-modal-component', DeleteElementModal)
