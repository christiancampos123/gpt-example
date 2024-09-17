const pluralize = require('pluralize')

exports.camelCase = async (name) => {
  name = name.toLowerCase()

  if (name.includes('_')) {
    const words = name.split('_')
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1))
    const camelCaseName = capitalizedWords.join('')

    return camelCaseName
  } else {
    const camelCaseName = name.charAt(0).toUpperCase() + name.slice(1)
    return camelCaseName
  }
}

exports.kebabCase = async (name) => {
  if (name.includes('_')) {
    const words = name.split('_')
    const kebabCaseName = words.join('-')

    return kebabCaseName
  }

  if (name.includes(' ')) {
    const words = name.split(' ')
    const kebabCaseName = words.join('-')

    return kebabCaseName
  }

  return name
}

exports.kebabCaseToCamelCase = async (name) => {
  return name
    .split('-')
    .map((word, index) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join('')
}

exports.singularize = async (name) => {
  return pluralize.singular(name)
}

exports.pluralize = async (name) => {
  return pluralize.plural(name)
}
