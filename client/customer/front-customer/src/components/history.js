class History extends HTMLElement {

  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = []
    this.socket = new WebSocket(import.meta.env.VITE_WS_URL);
  }

  connectedCallback () {

    this.socket.addEventListener('message', event => {
      
      const { channel, data } = JSON.parse(event.data);

      if (channel === 'history') {
        this.updateChat(data);
      }
    });

    this.loadData().then(() => this.render())
  }

  updateChat (data) {

    const list = this.shadow.querySelector('.history-record-messages ul')
    const li = document.createElement('li')
    li.dataset.threadId = data.threadId
    li.dataset.assistantEndpoint = data.assistantEndpoint
    list.prepend(li)

    const span = document.createElement('span')
    li.appendChild(span)

    for (let i = 0; i < data.resume.length; i++) {
      setTimeout(() => {
        span.textContent += data.resume[i];
      }, i * 50);
    }
  }

  async loadData () {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customer/chats`, {
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
      .history{
        max-height: 80vh;
        overflow-x: hidden; 
        overflow-y: auto;
        padding: 1rem 0;
        width: 100%;
      }

      .history::-webkit-scrollbar{
        background: transparent; 
        width: 0;
      }

      .history:hover::-webkit-scrollbar{
        width: 5px; 
      }

      .history:hover::-webkit-scrollbar-thumb{
        background-color: hsl(0, 0%, 53%); 
        border-radius: 1rem;
      }

      .history:hover::-webkit-scrollbar-thumb:hover{
        background-color: hsl(0, 0%, 78%); 
      }

      .history-record{
        margin-bottom: 2rem;
      }

      .history-record-title{
        margin: 0 1rem 1rem 1rem;  
      }

      .history-record-title h3{
        color: hsl(0, 0%, 40%);
        font-family: 'SoehneBuch', sans-serif; 
        font-size: 0.7rem;
        text-transform: capitalize;
        white-space: nowrap;
      }

      .history-record-messages ul{
        display: flex;
        flex-direction: column;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .history-record-messages ul li{
        cursor: pointer;
        margin: 0 0.5rem;
        max-width: 85%;
      }

      .history-record-messages ul li span{
        color: hsl(0, 0%, 100%);
        display: inline-block;
        font-family: Arial, Helvetica, sans-serif; 
        font-size: 0.8rem;
        overflow: hidden;
        padding: 0.5rem;
        position: relative;
        text-decoration: none;
        white-space: nowrap;
        width: 100%;
        z-index: 0;
      }

      .history-record-messages ul li a::after {
        background: linear-gradient(90deg, hsla(0, 0%, 0%, 0) 0%, hsla(0, 0%, 0%, 0.502) 50%, hsl(0, 0%, 0%) 100%);
        bottom: 0;
        content: '';
        pointer-events: none;
        position: absolute;
        right: 0;
        top: 0;
        width: 2rem; 
        z-index: 1000;
      } 

      .history-record-messages ul li a:hover{
        background-color: hsl(220, 4%, 13%);
        border-radius: 0.3rem;
      }

      .history-record-messages ul li a:hover::after {
        background: linear-gradient(90deg, hsla(220, 4%, 13%, 0) 0%, hsla(220, 4%, 13%, 0.5) 50%, hsla(220, 4%, 13%, 1) 100%);
        bottom: 0;
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 5rem; 
        z-index: 1000;
      }
    </style>
  
    <section class="history">
      <article class="history-record">
        <div class="history-record-title">
          <h3>Conversaciones</h3>
        </div>
        <nav class="history-record-messages">
          <ul>

          </ul>
        </nav>
      </article>
    </section>
    `
    const list = this.shadow.querySelector('.history-record-messages ul')

    this.data.forEach( chat => {
      const li = document.createElement('li')
      li.dataset.threadId = chat.threadId
      li.dataset.assistantEndpoint = chat.assistantEndpoint
      list.appendChild(li)

      const span = document.createElement('span')
      span.textContent = chat.resume
      li.appendChild(span)
    })

    list.addEventListener('click', event => {

      const li = event.target.closest('li')

      if (li) {
        const threadId = li.dataset.threadId
        const assistantEndpoint = li.dataset.assistantEndpoint
        
        
      }
    })
  }
}

customElements.define('history-component', History);