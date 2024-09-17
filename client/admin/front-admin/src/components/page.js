class PageComponent extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.basePath = this.getAttribute('base-path') || ''
  }

  async connectedCallback () {
    await this.getRoutes()
    this.render()
    window.onpopstate = () => this.handleRouteChange()
  }

  handleRouteChange () {
    this.render()
  }

  async getRoutes () {
    this.screenWidth = window.innerWidth
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/routes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ screenWidth: this.screenWidth })
    })

    if (response.ok) {
      this.routes = await response.json()
    } else {
      const data = await response.json()

      if (data.redirection) {
        window.location.href = data.redirection
      }
    }
  }

  render () {
    const path = window.location.pathname
    this.getTemplate(path)
  }

  async getTemplate (path) {
    const filename = this.routes[path]?.filename ?? '404.html'
    document.title = this.routes[path]?.title ?? '404'
    document.querySelector('meta[name="description"]').setAttribute('content', this.routes[path]?.description)

    await this.loadPage(filename)
  }

  async loadPage (filename) {
    const response = await fetch(`${this.basePath}/pages/${filename}`)
    const html = await response.text()

    document.startViewTransition(() => {
      this.shadowRoot.innerHTML = html
      document.documentElement.scrollTop = 0
    })
  }
}

customElements.define('page-component', PageComponent)
