import { columnsToCompile } from '../config.json'

export const compileColumns = (json) => {
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