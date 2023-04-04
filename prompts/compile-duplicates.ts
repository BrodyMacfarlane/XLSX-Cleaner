import fs from 'fs/promises'
import Prompt from './Prompt'
import colors from '@colors/colors/safe'
import Progress from '../progress/Progress'
import { outputFileDir } from '../dir'
import { promptHistory } from './Prompt'
import { inputFilePrompt } from './filename'
import { primaryKeyPrompt } from './primary-key'
import { compileToPrimaryKey, compileObjToArray, requireUncached } from '../functions'
import config from '../config.json'

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export default async () => {
  const jsonFile = `${promptHistory(inputFilePrompt.variable)}.json`
  const finalJsonFile = `${promptHistory(inputFilePrompt.variable)}-final.json`
  const jsonFilePath = `../${outputFileDir(jsonFile)}`
  const json: JSON = requireUncached(jsonFilePath)
  const primaryKey = promptHistory(primaryKeyPrompt.variable)
  const columnsToConcatObjs = config.columnsToCompile.filter(col => typeof col.columnsToInclude[0] !== 'string')
  const columnsToConcat = columnsToConcatObjs.map(col => col.newColumnName)


  Progress.statement('Compiling all columns towards primary key.')
  const compiledObj = compileToPrimaryKey(json, primaryKey, columnsToConcat)
  Progress.success('Compiled all columns towards primary key.')

  Progress.statement('Compiling created obj to array.')
  const compiledArr = compileObjToArray(compiledObj)
  Progress.success('Compiled created obj to array.')

  Progress.statement('Overwriting JSON file with final compiled data.')
  await fs.writeFile(`spreadsheets/output/${finalJsonFile}`, JSON.stringify(compiledArr))
  await fs.unlink(`spreadsheets/output/${jsonFile}`)
  Progress.success('Saved final JSON file.')
}