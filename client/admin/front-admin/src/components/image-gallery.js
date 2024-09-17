import { store } from '../redux/store.js'
import { showImage, removeImage } from '../redux/images-slice.js'

class ImageGallery extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    document.addEventListener('openGallery', this.handleOpenGallery.bind(this))
    this.render()
  }

  handleOpenGallery (event) {
    this.openGallery()
  }

  async render () {
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
            z-index: 5000;
          }

          .modal {
            height: 80%;
            position: absolute;
            width: 80%;
          }

          .modal-content {
            background-color: white;
            border: 1px solid #888;
            border-radius: 5px;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            position: relative;
            width: 100%;
          }

          .modal-header {
            align-items: center;
            display: flex;
            height: 5%;
            justify-content: space-between;
            padding: 1%;
            width: 98%;
          }

          .modal-header h2 {
            font-family: 'Lato', sans-serif;
            margin: 0;
          }

          .modal-header .close {
            color: hsl(0, 0%, 40%);
            float: right;
            font-size: 2rem;
            font-weight: bold;
          }

          .modal-header .close:hover,
          .modal-header .close:focus {
            color: hsl(0, 0%, 20%);
            text-decoration: none;
            cursor: pointer;
          }

          .modal-body {
            border-bottom: 1px solid hsl(0, 0%, 90%);
            border-top: 1px solid hsl(0, 0%, 90%);
            display: flex;
            height: 85%;
          }

          .image-gallery {
            align-content: flex-start;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            height: 96%;
            overflow: scroll;
            overscroll-behavior-y: contain;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 1%;
            width: 80%;
          }

          .image-gallery-loader {
            background-color: hsl(0, 0%, 90%);
            border-left: 1px solid hsl(0, 0%, 80%);
            height: 100%;
            overflow: scroll;
            overscroll-behavior-y: contain;
            overflow-y: auto;
            overflow-x: hidden;
            width: 20%;
          }

          .upload-image {
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
            cursor: pointer;
            height: 135px;
            margin: 5px;
            overflow: hidden;
            padding: 5px;
            position: relative;
            width: 135px;
          }

          .upload-image input[type="file"] {
            display: none;
          }

          .upload-image label {
            align-items: center;  
            background-color: hsl(207, 85%, 69%);
            border: none;
            box-sizing: border-box;
            color: white;
            cursor: pointer;
            display: flex;
            font-family: 'Lato', sans-serif;
            font-size: 16px;
            height: 100%;
            justify-content: center;
            text-align: center;
            text-decoration: none;
            transition-duration: 0.4s;
            width: 100%;
          }

          .upload-image label:hover {
            filter: brightness(1.2);
          }

          .upload-image label svg {
            fill: white;
            height: 4em;
            width: 4rem;
          }

          .image-gallery .image {
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
            cursor: pointer;
            height: 135px;
            margin: 5px;
            overflow: hidden;
            padding: 5px;
            position: relative;
            width: 135px;
          }

          .image-gallery .image:hover {
            border: 1px solid #aaa;
          }

          .image-gallery .image img {
            background-color: hsl(0, 0%, 0%);
            height: 100%;
            width: 100%;
          }

          .image-gallery .image.selected {
            border: 0.2rem solid #4CAF50;
          }

          .delete-button {
            background-color: hsl(0, 100%, 50%);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            font-size: 12px;
            height: 20px;
            opacity: 0;
            position: absolute;
            right: 0.2rem;
            top: 0.2rem;
            transition: opacity 0.3s ease;
            width: 20px;
            z-index: 2001;
          }

          .image:hover .delete-button {
            opacity: 1;
          }

          .delete-button:hover {
            background-color: hsl(0, 100%, 30%);
          }

          .image-gallery-information{
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin: 1.5rem 1rem;
          }

          .image-gallery-loader-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }

          .image-gallery-loader-form label {
            color: hsl(0, 0%, 40%);
            font-family: 'Lato', sans-serif;
          }   

          .image-gallery-loader-form input {
            border: none;
            border-bottom: 1px solid hsl(0, 0%, 80%);
            box-sizing: border-box;
            font-family: 'Lato', sans-serif;
            height: 2rem;
            outline: none;  
            padding: 0.5rem;
            width: 100%;
          }

          .modal-footer {
            align-items: center;
            display: flex;
            justify-content: flex-end;
            padding: 1rem;
          }

          .modal-footer button {
            background-color: hsl(0, 0%, 90%);
            border: none;
            border-radius: 5px;
            color: white;
            font-size: 16px;
            padding: 12px 24px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            transition-duration: 0.4s;
          }

          .modal-footer button.active {
            background-color: hsl(236 55% 25%);
            cursor: pointer;
          }

          .modal-footer button.active:hover {
            background-color: hsl(272 40% 35%);
          }
        </style>

        <div class="overlayer">
          <div class="modal">
            <div class="modal-content">
              <div class="modal-header">
                <h2>Galería</h2>
                <span class="close">&times;</span>
              </div>
              <div class="modal-body">
                <div class="image-gallery"></div>
                <div class="image-gallery-loader">
                  <div class="image-gallery-information">
                    <div class="image-gallery-loader-form">
                      <label for="title">Título</label>
                      <input type="text" name="title" />
                    </div>
                    <div class="image-gallery-loader-form">
                      <label for="description">Texto alternativo</label>
                      <input type="text" name="alt" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-primary">Elegir imagen</button>
              </div>
            </div>
          </div>
        </div>
        `

    await this.getThumbnails()

    this.shadow.querySelector('.overlayer').addEventListener('click', (event) => {
      if (event.target.closest('.close')) {
        this.closeGallery()
      }

      if (event.target.closest('.image')) {
        this.selectImage(event.target.closest('.image'))
      }

      if (event.target.closest('.modal-footer button')) {
        if (event.target.classList.contains('active')) {
          this.createThumbnail()
        }
      }

      if (event.target.closest('.delete-button')) {
        this.deleteImage(event.target.closest('.image').dataset.filename)
      }
    })
  }

  async openGallery () {
    const image = store.getState().images.imageGallery

    this.shadow.querySelector('.overlayer').classList.add('active')
    this.shadow.querySelector('input[name="title"]').value = image.title || ''
    this.shadow.querySelector('input[name="alt"]').value = image.alt || ''

    const imageElement = this.shadow.querySelector(`.image[data-filename="${image.filename}"]`)

    if (imageElement) {
      imageElement.classList.add('selected')
      this.shadow.querySelector('.modal-footer button').classList.add('active')
    }
  }

  async getThumbnails () {
    try {
      const imageGallery = this.shadow.querySelector('.image-gallery')
      imageGallery.innerHTML = ''
      const result = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/images`)
      const data = await result.json()
      const files = data.rows

      const uploadImage = document.createElement('div')
      const label = document.createElement('label')
      const input = document.createElement('input')

      uploadImage.classList.add('upload-image')
      label.setAttribute('for', 'file')
      input.setAttribute('type', 'file')
      input.setAttribute('id', 'file')
      input.setAttribute('name', 'file')
      input.setAttribute('accept', 'image/*')

      input.addEventListener('change', (event) => {
        this.uploadImage(event.target.files[0])
      })

      label.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" /></svg>'

      uploadImage.appendChild(label)
      uploadImage.appendChild(input)

      imageGallery.appendChild(uploadImage)

      files.forEach(file => {
        const imageContainer = document.createElement('div')
        const image = document.createElement('img')

        imageContainer.classList.add('image')
        imageContainer.setAttribute('data-filename', file.filename)
        image.src = `${import.meta.env.VITE_API_URL}/api/admin/images/${file.filename}`

        const deleteButton = document.createElement('button')
        deleteButton.classList.add('delete-button')
        deleteButton.innerHTML = 'X'

        imageContainer.appendChild(deleteButton)
        imageContainer.appendChild(image)
        imageGallery.appendChild(imageContainer)
      })
    } catch (e) {
      console.log(e)
    }
  }

  async uploadImage (file) {
    const formData = new FormData()
    formData.append('file', file)

    const result = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/images`, {
      method: 'POST',
      body: formData
    })

    const filenames = await result.json()

    this.shadow.querySelectorAll('.image').forEach((item) => {
      item.classList.remove('selected')
    })

    filenames.forEach(filename => {
      const imageContainer = document.createElement('div')
      const image = document.createElement('img')

      imageContainer.classList.add('image', 'selected')
      imageContainer.setAttribute('data-filename', filename)
      image.src = `${import.meta.env.VITE_API_URL}/api/admin/images/${filename}`

      const deleteButton = document.createElement('button')
      deleteButton.classList.add('delete-button')
      deleteButton.innerHTML = 'X'

      imageContainer.appendChild(deleteButton)
      imageContainer.appendChild(image)

      const uploadImage = this.shadow.querySelector('.upload-image')
      uploadImage.insertAdjacentElement('afterend', imageContainer)
    })

    this.shadow.querySelector('.modal-footer button').classList.add('active')

    this.shadow.querySelector('input[name="alt"]').value = ''
    this.shadow.querySelector('input[name="title"]').value = ''
  }

  async selectImage (image) {
    this.shadow.querySelectorAll('.image').forEach(item => {
      item.classList.remove('selected')
    })

    image.classList.add('selected')

    this.shadow.querySelector('.modal-footer button').classList.add('active')
  }

  async deleteImage (filename) {
    const result = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/images/${filename}`, {
      method: 'DELETE'
    })

    if (result.status === 200) {
      this.shadow.querySelector(`.image[data-filename="${filename}"`).remove()
      this.shadow.querySelector('.modal-footer button').classList.remove('active')

      if (store.getState().images.imageGallery.filename === filename) {
        store.dispatch(removeImage(store.getState().images.imageGallery))
      }
    }
  }

  async createThumbnail () {
    let image = store.getState().images.imageGallery
    const alt = this.shadow.querySelector('input[name="alt"]').value
    const title = this.shadow.querySelector('input[name="title"]').value
    const filename = this.shadow.querySelector('.image.selected').getAttribute('data-filename')
    image = { ...image, alt, title, filename }

    if (store.getState().images.imageGallery.filename) {
      store.dispatch(removeImage(store.getState().images.imageGallery))
    }

    store.dispatch(showImage(image))

    this.closeGallery()
  }

  async closeGallery () {
    this.shadow.querySelector('.modal-footer button').classList.remove('active')

    this.shadow.querySelectorAll('.image').forEach(item => {
      item.classList.remove('selected')
    })

    this.shadow.querySelector('.overlayer').classList.remove('active')
  }
}

customElements.define('image-gallery-component', ImageGallery)
