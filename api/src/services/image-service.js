const fs = require('fs/promises')
const path = require('path')
const sharp = require('sharp')

module.exports = class ImageService {
  uploadImage = async images => {
    const result = []

    for (const image of images.file) {
      try {
        const filename = image.originalname.replace(/[\s_]/g, '-')

        const newFilename = await fs.access(path.join(__dirname, `../storage/images/gallery/original/${path.parse(filename).name}.webp`)).then(async () => {
          // TODO Dar al usuario la opción de sobreescribir la imagen
          return `${path.parse(filename).name}-${new Date().getTime()}.webp`
        }).catch(async () => {
          return `${path.parse(filename).name}.webp`
        })

        await sharp(image.buffer)
          .webp({ lossless: true })
          .toFile(path.join(__dirname, `../storage/images/gallery/original/${newFilename}`))

        await sharp(image.buffer)
          .resize(135, 135)
          .webp({ quality: 80 })
          .toFile(path.join(__dirname, `../storage/images/gallery/thumbnail/${newFilename}`))

        result.push(newFilename)
      } catch (error) {
        console.log(error)
      }
    }

    return result
  }

  resizeImages = async (images) => {
    try {
      const resizedImages = {}
      const uploadPromises = []

      for (const image in images) {
        if (!resizedImages.adminImages) {
          resizedImages.adminImages = []
        }

        resizedImages.adminImages.push({
          name: images[image].name,
          filename: images[image].filename,
          title: images[image].title,
          alt: images[image].alt,
          languageAlias: images[image].languageAlias,
          widthPx: 135,
          heightPx: 135
        })

        const imageUploadPromise = new Promise((resolve) => {
          const imageConfigurationPromises = []

          for (const [mediaQuery, imageConfiguration] of Object.entries(images[image].imageConfigurations)) {
            const filename = `${path.parse(images[image].filename).name}-${imageConfiguration.widthPx}x${imageConfiguration.heightPx}.webp`

            const imageResize = {
              originalFilename: images[image].filename,
              filename,
              title: images[image].title,
              alt: images[image].alt,
              widthPx: imageConfiguration.widthPx,
              heightPx: imageConfiguration.heightPx
            }

            const resizePromise = fs.access(path.join(__dirname, `../storage/images/resized/${filename}`))
              .then(async () => {
                const start = new Date().getTime()
                const stats = await fs.stat(path.join(__dirname, `../storage/images/resized/${filename}`))
                imageResize.sizeBytes = stats.size
                const end = new Date().getTime()
                imageResize.latencyMs = end - start
              })
              .catch(async () => {
                const start = new Date().getTime()
                await sharp(path.join(__dirname, `../storage/images/gallery/original/${images[image].filename}`))
                  .resize(parseInt(imageConfiguration.widthPx), parseInt(imageConfiguration.heightPx))
                  .webp({ quality: 80 })
                  .toFile(path.join(__dirname, `../storage/images/resized/${filename}`))

                const end = new Date().getTime()
                imageResize.sizeBytes = (await fs.stat(path.join(__dirname, `../storage/images/resized/${filename}`))).size
                imageResize.latencyMs = end - start
              })

            if (!resizedImages[mediaQuery]) {
              resizedImages[mediaQuery] = {}
            }

            if (images[image].languageAlias === 'all') {
              if (!resizedImages[mediaQuery][images[image].name]) {
                if (!resizedImages[mediaQuery][images[image].name]) {
                  resizedImages[mediaQuery][images[image].name] = (images[image].quantity === 'single') ? {} : []
                }

                if (images[image].quantity === 'single') {
                  resizedImages[mediaQuery][images[image].name] = imageResize
                } else {
                  resizedImages[mediaQuery][images[image].name].push(imageResize)
                }
              }
            } else {
              if (!resizedImages[mediaQuery][images[image].languageAlias]) {
                resizedImages[mediaQuery][images[image].languageAlias] = {}
              }

              if (!resizedImages[mediaQuery][images[image].languageAlias][images[image].name]) {
                resizedImages[mediaQuery][images[image].languageAlias][images[image].name] = (images[image].quantity === 'single') ? {} : []
              }

              if (images[image].quantity === 'single') {
                resizedImages[mediaQuery][images[image].languageAlias][images[image].name] = imageResize
              } else {
                resizedImages[mediaQuery][images[image].languageAlias][images[image].name].push(imageResize)
              }
            }

            imageConfigurationPromises.push(resizePromise)
          }

          Promise.all(imageConfigurationPromises)
          resolve()
        })

        uploadPromises.push(imageUploadPromise)
      }

      await Promise.all(uploadPromises)

      return resizedImages
    } catch (error) {
      return null
    }
  }

  deleteImages = async filename => {
    // TODO: Comprobar si algún elemento de la base de datos está usando la imagen
    try {
      await fs.unlink(path.join(__dirname, `../storage/images/gallery/original/${filename}`))
      await fs.unlink(path.join(__dirname, `../storage/images/gallery/thumbnail/${filename}`))

      return 1
    } catch {
      return 0
    }
  }
}
