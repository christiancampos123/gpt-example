class Menu extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.menuItems = []
  }

  connectedCallback () {
    this.loadData().then(() => this.render())
  }

  async loadData () {
    const url = `${import.meta.env.VITE_API_URL}/api/admin/menus/display/${this.getAttribute('menu')}`
    try {
      const response = await fetch(url)
      this.data = await response.json()
    } catch (error) {
      console.log(error)
    }
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
        <style>
          .menu-container{
            position: relative;
          }

          #menu-button{
            align-items: center;
            border-radius: 50%;
            cursor:pointer;
            display: flex;
            height: 2.7rem;
            justify-content: center;
            position: relative;
            width: 2.7em;
            z-index: 3001;
          }
          
          #menu-button:hover{
            background-color: hsl(272 40% 35%);
          }

          #menu-button.active{
            background-color: hsl(272 40% 35%);
          }

          #menu-button svg{
            fill: hsl(0, 0%, 100%);
            height: 2rem;
            width: 2rem;
          }

          #menu{
            background-color: hsl(0, 0%, 0%);
            border: 0.5rem solid hsl(0, 0%, 100%);
            height: 50vh;
            right: -3rem;
            position: absolute;
            transition: opacity 0.3s;
            top: 4rem;
            opacity: 0;
            padding: 5%;
            visibility: hidden;
            width: 400px;
            z-index: -1;
          }

          #menu.active{
            opacity: 1;
            visibility: visible;
            z-index: 6000;
          }

          nav {
            display: flex;
            align-items: center;
            justify-content: left;
          }
            
          nav ul {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column; 
          }
            
          nav ul li {
            position: relative;
            width: max-content;
          }
            
          nav ul li a {
            display: block;
            font-family: 'Roboto', sans-serif;
            font-size: 1.5em;
            padding: 0.5rem;
            text-decoration: none;
            color: hsl(207, 85%, 69%);
          }

          nav ul li a:hover {
            color: hsl(19, 100%, 50%);
          }

          nav ul li .sub-menu {
            display: none;
          }
          
          nav ul li:hover .sub-menu {
            display: block;
          }
            
          nav ul li:hover > .sub-menu {
            visibility: visible;
            animation: slide-in 0.5s ease-in-out; /* animación de apertura */
          }
            
          .sub-menu {
            position: absolute;
            top: 0;
            left: 100%; 
            visibility: hidden;
            animation: slide-out 0.5s ease-in-out;
          }
        </style>

        <div class="menu-container">
          <div id="menu-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16,20H20V16H16M16,14H20V10H16M10,8H14V4H10M16,8H20V4H16M10,14H14V10H10M4,14H8V10H4M4,20H8V16H4M10,20H14V16H10M4,8H8V4H4V8Z" /></svg>
          </div>

          <div id="menu">
              <nav>
                  <ul>
                
                  </ul>
              </nav>
          </div>
        </div>
        `

    const menuList = this.shadow.querySelector('ul')

    this.data.forEach(menuItem => {
      const li = document.createElement('li')
      const link = document.createElement('a')

      if (menuItem.url) { link.setAttribute('href', `${menuItem.url}`) }

      link.textContent = menuItem.title

      li.appendChild(link)
      this.createSubMenu(menuItem, li)
      menuList.appendChild(li)
    })

    this.shadow.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault()

        menuButton.classList.toggle('active')
        menu.classList.toggle('active')

        document.dispatchEvent(new CustomEvent('newUrl', {
          detail: {
            url: link.getAttribute('href'),
            title: link.textContent
          }
        }))
      })
    })

    const menuButton = this.shadow.querySelector('#menu-button')
    const menu = this.shadow.querySelector('#menu')

    menuButton.addEventListener('click', (event) => {
      menuButton.classList.toggle('active')
      menu.classList.toggle('active')
    })
  }

  createSubMenu (menuItem, li) {
    if (menuItem.children) {
      const subMenu = document.createElement('ul')
      subMenu.classList.add('sub-menu')
      li.append(subMenu)

      Object.values(menuItem.children).forEach(subMenuItem => {
        const subLi = document.createElement('li')
        const subLink = document.createElement('a')

        subLink.setAttribute('href', subMenuItem.customUrl)
        subLink.textContent = subMenuItem.name

        subLi.appendChild(subLink)
        subMenu.appendChild(subLi)

        this.createSubMenu(subMenuItem, subLi)
      })

      li.appendChild(subMenu)
    }
  }
}

customElements.define('menu-component', Menu)
