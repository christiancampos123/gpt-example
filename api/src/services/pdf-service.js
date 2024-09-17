const puppeteer = require('puppeteer')
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const mongooseDb = require('../models/mongoose')
const Language = mongooseDb.Language

module.exports = class PdfService {
  async createPdf (userId, userType, type, data = []) {
    try {
      const languages = await this.getLanguages()
      const filename = this.getFileName(userType, type, data)
      const result = {}

      for (const language of languages) {
        const folder = path.join(__dirname, `../storage/pdfs/${userType}/${userId}/${type}/${language.alias}`)
        fs.mkdirSync(folder, { recursive: true })

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        const file = path.join(`${folder}/${filename}.pdf`)

        ejs.renderFile(path.join(__dirname, `../templates/pdfs/${userType}/${language.alias}/${type}.ejs`), { data }, async (err, htmlContent) => {
          if (err) {
            console.error('Hubo un error al renderizar el archivo EJS:', err)
            return
          }

          await page.setContent(htmlContent)

          await page.pdf({
            path: file,
            format: 'A4'
          })

          await browser.close()
        })

        result[language.alias] = {
          filename: `${filename}.pdf`,
          path: file
        }
      }

      return result
    } catch (err) {
      console.error('Hubo un error al crear el PDF:', err)
    }
  }

  async createBuffer (userId, userType, type, data = []) {
    try {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()

      return new Promise((resolve, reject) => {
        ejs.renderFile(path.join(__dirname, `../templates/pdfs/${userType}/es/${type}.ejs`), { data }, async (err, htmlContent) => {
          if (err) {
            console.error('Hubo un error al renderizar el archivo EJS:', err)
            browser.close()
            reject(err)
            return
          }

          await page.setContent(htmlContent)

          const buffer = await page.pdf({
            format: 'A4'
          })

          await browser.close()

          resolve(buffer)
        })
      })
    } catch (err) {
      console.error('Hubo un error al crear el PDF:', err)
    }
  }

  async getLanguages () {
    try {
      return await Language.find({ deletedAt: { $exists: false }, selected: true }).lean().exec()
    } catch (err) {
      console.error('Hubo un error al recuperar los idiomas:', err)
    }
  }

  getFileName (userType, type, data) {
    let fileName = ''

    if (userType === 'customer' || userType === 'user') {
      if (type === 'order-details') {
        fileName = `${data.sale.reference}`
      }
    }

    return fileName
  }
}
