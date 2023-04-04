import fs from 'fs/promises'
import Prompt from './Prompt'
import colors from '@colors/colors/safe'
import Progress from '../progress/Progress'
import { outputFileDir } from '../dir'
import { promptHistory } from './Prompt'
import { inputFilePrompt } from './filename'
import { compileColumns, addAllColumns, fixFirstNames } from '../functions'


export default async () => {
  const jsonFile = `${promptHistory(inputFilePrompt.variable)}.json`
  const jsonFilePath = `../${outputFileDir(jsonFile)}`
  const json: JSON = require(jsonFilePath)

  Progress.statement('Adding all necessary columns.')
  const allColumnsAddedJson = addAllColumns(json)
  Progress.success('Added all necessary columns.')

  Progress.statement('Adding all necessary columns.')
  const namesFixedJson = fixFirstNames(allColumnsAddedJson)
  Progress.success('Added all necessary columns.')

  Progress.statement('Reformatting column data.')
  const compiledJson = compileColumns(namesFixedJson)
  Progress.success('Reformatted column data.')

  Progress.statement('Overwriting JSON file with reformatted column data.')
  await fs.writeFile(`spreadsheets/output/${jsonFile}`, JSON.stringify(json))
  Progress.success('Saved new JSON file.')

  const allKeys = Object.keys(compiledJson[0])

  Progress.title('Here are the options to select as a primary key.')
  allKeys.forEach(key => console.log(`${colors.cyan(key)}, `))

  const primaryKeyPrompt = new Prompt({
    text: "Which column would you like to use as the new primary key?",
    variable: "primaryKey",
    stringResponseOptions: (primaryKey) => (primaryKey),
    syncValidation: (column: string) => ({
      fn: (column: string) => allKeys.indexOf(column) > -1,
      msg: `Column '${column}' does not exist as a valid primary key.\nPlease double check the spelling and make sure the column exists in the list above.`,
    })
  })

  const primaryKey = await primaryKeyPrompt.prompt()
}