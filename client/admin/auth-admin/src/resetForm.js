class ResetForm extends HTMLElement {
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

          :host{
            display: block;
            width: 300px;
          }

          h2{
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-size: 1.5rem;
            font-weight: 600;
            text-align: center;
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
        </style>

        <h2>${this.getAttribute('title')}</h2>

        <form class="form">
          <div class="form-element">
            <div class="form-element-label">
              <label for="email">Email</label>
            </div>
            <div class="form-element-input">
              <input type="email" name="email" id="email" required>
            </div>
          </div>
          <button type="submit" class="form-submit">Enviar</button>
        </form>
        `

    const form = this.shadow.querySelector('form')

    form.addEventListener('submit', (event) => {
      event.preventDefault()
      this.submitForm(form)
    })
  }

  async submitForm (form) {
    const endpoint = import.meta.env.VITE_API_URL
    const formData = new FormData(form)
    const formDataJson = Object.fromEntries(formData.entries())

    try {
      const result = await fetch(`${endpoint}/api/auth/user/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataJson)
      })

      if (result.ok) {
        const data = await result.json()
        console.log(data)
      } else {
        const error = await result.json()
        console.log(error.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
}

customElements.define('reset-form-component', ResetForm)
