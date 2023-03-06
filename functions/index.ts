export const compileColumns = (json) => {
  const columnsToCompile = require('../config.json')
  let newJson = json
  columnsToCompile.forEach((ocol, i) => {
    newJson[i][ocol.newColumnName] = {}
    ocol.columnsToInclude.forEach(icol => {
      newJson[i][ocol.newColumnName][icol] = json[i][icol]
      delete newJson[i][icol]
    })
  })
  return newJson
}