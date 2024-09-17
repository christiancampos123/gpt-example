const data = [
  {
    environment: 'admin',
    entity: 'dashboard',
    filename: 'dashboard.html',
    languageAlias: 'es',
    url: '/admin',
    title: 'Panel de Administración',
    description: 'Página principal del administrador',
    sitemap: false
  },
  {
    environment: 'admin',
    entity: 'menus',
    filename: 'menus.html',
    languageAlias: 'es',
    url: '/admin/menus',
    title: 'Menús',
    description: 'Administración de menús del sitio',
    sitemap: false
  },
  {
    environment: 'admin',
    entity: 'users',
    filename: 'users.html',
    languageAlias: 'es',
    url: '/admin/usuarios',
    title: 'Usuarios',
    description: 'Gestión de usuarios del sistema',
    sitemap: false
  },
  {
    environment: 'admin',
    entity: 'customers',
    filename: 'customers.html',
    languageAlias: 'es',
    url: '/admin/clientes',
    title: 'Clientes',
    description: 'Administración de clientes del sistema',
    sitemap: false
  },
  {
    environment: 'admin',
    entity: 'customers-credentials',
    filename: 'customers-credentials.html',
    languageAlias: 'es',
    url: '/admin/credenciales-de-clientes',
    title: 'Credenciales de Clientes',
    description: 'Gestión de credenciales para clientes',
    sitemap: false
  },
  {
    environment: 'admin',
    entity: 'commercial-categories',
    filename: 'commercial-categories.html',
    languageAlias: 'es',
    url: '/admin/categorias-de-comercios',
    title: 'Categorías de Comercios',
    description: 'Gestión de categorías de comercios',
    sitemap: false
  },
  {
    environment: 'admin',
    entity: 'assistants',
    filename: 'assistants.html',
    languageAlias: 'es',
    url: '/admin/asistentes',
    title: 'Asistentes',
    description: 'Gestión de asistentes',
    sitemap: false
  },
  {
    environment: 'customer',
    entity: 'home',
    filename: 'home.html',
    languageAlias: 'es',
    url: '/',
    title: 'CustomGPT',
    description: 'CustomGPT',
    sitemap: false
  },
  {
    environment: 'auth',
    entity: 'activation',
    filename: 'activate.html',
    languageAlias: 'es',
    url: '/cuenta/activacion',
    title: 'Activar cuenta',
    description: 'Activar cuenta',
    sitemap: false
  },
  {
    environment: 'auth',
    entity: 'reset',
    filename: 'reset.html',
    languageAlias: 'es',
    url: '/cuenta/reset',
    title: 'Reinicio de contraseña',
    description: 'Reinicio de contraseña',
    sitemap: false
  }
]

module.exports = async function (mongoose) {
  async function insertSeeder () {
    const Model = require('../../models/mongoose/locale-seo.js')(mongoose)
    await Model.insertMany(data)
  }

  insertSeeder()
}
