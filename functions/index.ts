export const addAllColumns = (json) => {
  const columnSet: Set<string> = new Set()
  let newJson = json

  newJson.forEach(obj => {
    const keys = Object.keys(obj)
    keys.forEach(key => {
      columnSet.add(key)
    })
  })

  newJson.forEach(obj => {
    columnSet.forEach(col => {
      if (!obj[col]) {
        obj[col] = ""
      }
    })
  })

  return newJson
}

export const compileColumns = (json) => {
  const columnsToCompile = require('../config.json').columnsToCompile
  let newJson = json
  columnsToCompile.forEach((columnToCompile, columnToCompileIndex) => {
    newJson.forEach((jsonCol, i) => {
      if (typeof columnToCompile.columnsToInclude[0] === 'string') jsonCol[columnToCompile.newColumnName] = {}
      else jsonCol[columnToCompile.newColumnName] = []

      columnToCompile.columnsToInclude.forEach(icol => {
        if (typeof icol === 'string') jsonCol[columnToCompile.newColumnName][icol] = json[i][icol]
        else jsonCol[columnToCompile.newColumnName] = jsonCol[columnToCompile.newColumnName].concat([{ [icol.newCompName]: json[i][icol.oldCompName] }])

        delete jsonCol[icol]
      })
    })
  })
  return newJson
}

export const fixFirstNames = (json) => {
  let newJson = json
  newJson.forEach(jsonCol => {
    if (jsonCol['Owner 1 Last Name'].length === 0) {
      // Handle names such as "John and Jane Smith" to set first name to "John and Jane" and last name to "Smith"
      if (jsonCol['Owner 1 First Name'].toLowerCase().split(" ").indexOf("and") > -1) {
        jsonCol['Owner 1 Last Name'] = jsonCol['Owner 1 First Name'].split(" ")[jsonCol['Owner 1 First Name'].split(" ").length - 1]
        jsonCol['Owner 1 First Name'] = jsonCol['Owner 1 First Name'].split(" ").slice(0, [jsonCol['Owner 1 First Name'].split(" ").length - 1]).join(" ")
      }
      // Handle names such as "John Van Smith" to set first name to "John" and last name to "Van Smith"
      else if (jsonCol['Owner 1 First Name'].toLowerCase().split(" ").length > 2) {
        jsonCol['Owner 1 Last Name'] = jsonCol['Owner 1 First Name'].split(" ").slice(1, [jsonCol['Owner 1 First Name'].split(" ").length]).join(" ")
        jsonCol['Owner 1 First Name'] = jsonCol['Owner 1 First Name'].split(" ")[0]
      }
      // Handle names such as "John Smith"
      else {
        jsonCol['Owner 1 Last Name'] = jsonCol['Owner 1 First Name'].split(" ")[1]
        jsonCol['Owner 1 First Name'] = jsonCol['Owner 1 First Name'].split(" ")[0]
      }
    }
  })
  return newJson
}