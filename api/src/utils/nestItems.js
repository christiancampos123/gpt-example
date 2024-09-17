exports.get = (data, parent) => {
  const nestedObject = {}

  data.forEach(function (item) {
    if (item.parent === parent) {
      const children = module.exports.get(data, item.id)

      if (Object.keys(children).length) {
        item.dataValues.children = children
      }

      nestedObject[item.id] = item
    }
  })

  return nestedObject
}
