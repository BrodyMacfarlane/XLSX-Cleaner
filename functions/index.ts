export const requireUncached = (module) => {
  delete require.cache[require.resolve(module)]
  return require(module)
}

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
        if (typeof icol === 'string') {
          jsonCol[columnToCompile.newColumnName][icol] = json[i][icol]
          delete jsonCol[icol]
        }
        else {
          jsonCol[columnToCompile.newColumnName] = jsonCol[columnToCompile.newColumnName].concat([{ [icol.newCompName]: json[i][icol.oldCompName] }])
          delete jsonCol[icol.oldCompName]
        }
      })
    })
  })
  return newJson
}

export const fixFirstNames = (json, fN, lN) => {
  let newJson = json
  newJson.forEach(jsonCol => {
    if (jsonCol[lN].length === 0) {
      // Handle names such as "John and Jane Smith" to set first name to "John and Jane" and last name to "Smith"
      if (jsonCol[fN].toLowerCase().split(" ").indexOf("and") > -1) {
        jsonCol[lN] = jsonCol[fN].split(" ")[jsonCol[fN].split(" ").length - 1]
        jsonCol[fN] = jsonCol[fN].split(" ").slice(0, [jsonCol[fN].split(" ").length - 1]).join(" ")
      }
      // Handle names such as "John Van Smith" to set first name to "John" and last name to "Van Smith"
      else if (jsonCol[fN].toLowerCase().split(" ").length > 2) {
        jsonCol[lN] = jsonCol[fN].split(" ").slice(1, [jsonCol[fN].split(" ").length]).join(" ")
        jsonCol[fN] = jsonCol[fN].split(" ")[0]
      }
      // Handle names such as "John Smith"
      else {
        jsonCol[lN] = jsonCol[fN].split(" ")[1]
        jsonCol[fN] = jsonCol[fN].split(" ")[0]
      }
    }
  })
  return newJson
}

export const compileToPrimaryKey = (json, primaryKey, columnsToConcat) => {
  let newJson = json
  let compiledObj = {}
  newJson.forEach(jsonCol => {
    if (compiledObj[jsonCol[primaryKey]]) {
      const keys = Object.keys(jsonCol)
      keys.forEach(key => {
        if (columnsToConcat.indexOf(key) > -1) {
          let compArr = compiledObj[jsonCol[primaryKey]][key].concat(jsonCol[key])
          let uniqueCompArr: any[] = [...new Set(compArr.map(c => JSON.stringify(c)))]
          let parsedUniques = uniqueCompArr.map(c => JSON.parse(c))
          compiledObj[jsonCol[primaryKey]][key] = parsedUniques
        }
        else {
          compiledObj[jsonCol[primaryKey]][key] = jsonCol[key]
        }
      })
    }
    else {
      compiledObj[jsonCol[primaryKey]] = jsonCol
    }
  })
  return compiledObj
}

export const compileObjToArray = (compiledObj) => {
  let compiledArr = []
  for (let key in compiledObj) {
    compiledArr.push(compiledObj[key])
  }
  return compiledArr
}

export const noSpaceClean = (json, columns) => {
  let newJson = json
  for (const col of columns) {
    for (const jsonRow of newJson) {
      if (typeof jsonRow[col] === 'string') {
        const noSpaces = jsonRow[col].replace(/\s/g, '')
        jsonRow[col] = noSpaces
      }
    }
  }
  return newJson
}

export const numbersOnlyClean = (json, columns) => {
  let newJson = json
  for (const col of columns) {
    for (const jsonRow of newJson) {
      if (typeof jsonRow[col] === 'string') {
        const noSpaces = jsonRow[col].replace(/\D/g, '')
        jsonRow[col] = noSpaces
      }
    }
  }
  return newJson
}