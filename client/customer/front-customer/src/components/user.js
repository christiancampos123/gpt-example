class User extends HTMLElement {

  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    sessionStorage.setItem('customerId', '1')
    this.render()
  }

  render () {

    this.shadow.innerHTML =
      /*html*/`
      <style>
        .user{
          bottom: 0;
          cursor: pointer;
          display: flex;
          gap: 0.5rem;
          padding: 1rem;
          position: absolute;
        }

        .user-logo{
          align-items: center;
          border-radius: 50%;
          display: flex;
          height: 2rem;
          justify-content: center;
          overflow: hidden;
          width: 2rem;
        }

        .user-logo img{
          width: 100%;
        }

        .user-name{
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .user-name h3{
          color: hsl(0, 0%, 100%);
          font-family: 'SoehneBuch', sans-serif;
          font-size: 0.9rem;
          margin: 0;
          overflow: hidden;
          white-space: nowrap;
        }
      </style>
    
      <section class="user">
        <div class="user-logo">
          <img src="images/user-avatar.png" alt="avatar de usuario">
        </div>
        <div class="user-name">
          <h3>Carlos Seda</h3>
        </div>
      </section>
    `
  }
}

customElements.define('user-component', User)