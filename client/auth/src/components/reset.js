class Reset extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')

    if (!token) {
      window.location.href = '/'
    }

    this.render()
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>
      :host{
        align-items: center;
        display: flex;
        flex-direction: column;
        height: 60vh;
        justify-content: center;
      }

      .title{
        padding: 1rem 0;
      }

      h2{
        color: hsl(0, 0%, 100%);
        font-family: 'Lato' , sans-serif;
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0;
        text-align: center;
      }

      .rules{
        display: flex;
        justify-content: flex-start;
        width: 100%;
      }

      .rules ul{
        list-style: none;
        padding: 0;
        width: 100%;
      }

      .rules ul li{
        color: hsl(0, 0%, 100%);
        font-family: 'Lato' , sans-serif;
        font-size: 1rem;
        font-weight: 600;
      }

      form{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
      }

      .form-element{
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
      }

      .form-element-label label{
        color: hsl(0, 0%, 100%);
        font-family: 'Lato' , sans-serif;
        font-weight: 600;
        font-size: 1rem;
        transition: color 0.5s;
      }

      .form-element-input{
        width: 100%;
      }

      .form-element-input input{
        background-color:hsl(226, 63%, 45%);
        border: none;
        border-bottom: 0.1rem solid  hsl(0, 0%, 100%);
        box-sizing: border-box;
        color: hsl(0, 0%, 100%);
        font-family: 'Roboto' , sans-serif;
        font-weight: 600;
        outline: none;
        padding: 0.5rem;
        width: 100%;
      }

      .form-submit{
        background-color: hsl(272 40% 35%);
        border: none;
        border-radius: 0.5rem;
        color: hsl(0, 0%, 100%);
        cursor: pointer;
        font-family: 'Lato', sans-serif;
        font-size: 1rem;      
        margin-top: 1rem;      
        padding: 0.5rem 1rem;
      }

      .form-submit:hover {
        filter: brightness(1.2);
      }

      .message{
        align-items: center;
        display: flex;
        justify-content: flex-start;
        padding: 1rem 0;
        width: 100%;
      }

      .message span{
        color: hsl(0, 0%, 100%);
        font-family: 'Lato' , sans-serif;
        font-size: 1rem;
        font-weight: 600;
      }
    </style>

    <div class="activate">
      <div class="title">
        <h2>Elija una contraseña para su cuenta</h2>
      </div>

      <div class="rules">
        <ul>
          <li>- 8 caracteres como mínimo</li>
          <li>- Al menos una letra mayúscula</li>
          <li>- Al menos un número</li>
        </ul>
      </div>

      <form class="form">
        <div class="form-element">
          <div class="form-element-label">
            <label for="password">Contraseña</label>
          </div>
          <div class="form-element-input">
            <input type="password" name="password" required>
          </div>
        </div>
        <div class="form-element">
          <div class="form-element-label">
            <label for="password">Repita la contraseña</label>
          </div>
          <div class="form-element-input">
            <input type="password" name="repeat-password" required>
          </div>
        </div>
        <button type="submit" class="form-submit">Enviar</button>
      </form>

      <div class="message">
        <span></span>
      </div>
    </div>
    `

    this.shadow.querySelector('.form').addEventListener('submit', async (event) => {
      event.preventDefault()
      const password = this.shadow.querySelector('input[name="password"]').value
      const repeatPassword = this.shadow.querySelector('input[name="repeat-password"]').value
      const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/

      if (password !== repeatPassword) {
        this.shadow.querySelector('.message span').textContent = 'Las contraseñas no coinciden'
        return
      }

      if (!password || !repeatPassword) {
        this.shadow.querySelector('.message span').textContent = 'Los campos no pueden estar vacios'
        return
      }

      if (!regex.test(password)) {
        this.shadow.querySelector('.message span').textContent = 'La contraseña no cumple con los requisitos mínimos'
        return
      }

      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password })
      })

      if (response.ok) {
        this.shadow.querySelector('.message span').textContent = 'Cuenta activada correctamente'
      } else {
        const data = await response.json()
        this.shadow.querySelector('.message span').textContent = data.message
      }
    })
  }
}

customElements.define('reset-component', Reset)
