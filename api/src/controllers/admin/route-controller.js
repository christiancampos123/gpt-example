const mongooseDb = require('../../models/mongoose')
const LocaleSeo = mongooseDb.LocaleSeo

exports.findAll = async (req, res) => {
  const result = await LocaleSeo.find({ environment: 'admin', languageAlias: req.userLanguage })

  const response = result.reduce((acc, item) => {
    acc[item.url] = {
      filename: item.filename,
      title: item.title,
      description: item.description
    }

    item.slugs.forEach(slug => {
      acc[`${item.url}/${slug.url}`] = {
        filename: item.filename,
        title: slug.title,
        description: slug.description ?? item.description
      }
    })

    return acc
  }, {})

  res.status(200).send(response)
}
