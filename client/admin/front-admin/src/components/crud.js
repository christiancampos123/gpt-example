class Crud extends HTMLElement {
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
        .crud {
          display: flex;
          justify-content: space-between;
          gap: 2rem;
          margin: 0 auto;
          width: 100%;
        }
        
        .crud-table {
          flex: 1;
        }
        
        .crud-form {
          flex: 2;
        }
      </style>

      <div class="crud">
        <div class="crud-table">
          <slot name="filter"></slot>
          <slot name="table"></slot>
        </div>

        <div class="crud-form">
          <slot name="form"></slot>
        </div>
      </div> 
    `
  }
}

customElements.define('crud-component', Crud)
