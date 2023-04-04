import fs from 'fs/promises'
import Prompt from './Prompt'
import colors from '@colors/colors/safe'
import Progress from '../progress/Progress'
import { outputFileDir } from '../dir'
import { promptHistory } from './Prompt'
import { inputFilePrompt } from './filename'
import { compileColumns, addAllColumns, fixFirstNames, requireUncached } from '../functions'
import config from '../config.json'

export const primaryKeyPrompt = new Prompt({
  text: "Which column would you like to use as the new primary key?",
  variable: "primaryKey",
  stringResponseOptions: (primaryKey) => (primaryKey),
  syncValidation: (column: string) => ({
    fn: (column: string) => {
      const allKeys = Object.keys(requireUncached(`../${outputFileDir(`${promptHistory(inputFilePrompt.variable)}.json`)}`)[0])
      return allKeys.indexOf(column) > -1
    },
    msg: `Column '${column}' does not exist as a valid primary key.\nPlease double check the spelling and make sure the column exists in the list above.`,
  })
})

export default async () => {
  const jsonFile = `${promptHistory(inputFilePrompt.variable)}.json`
  const jsonFilePath = `../${outputFileDir(jsonFile)}`
  const json: JSON = requireUncached(jsonFilePath)

  Progress.statement('Adding all necessary columns.')
  const allColumnsAddedJson = addAllColumns(json)
  Progress.success('Added all necessary columns.')

  Progress.statement('Adding all necessary columns.')
  const namesFixedJson = config.firstNameColumn && config.lastNameColumn ? fixFirstNames(allColumnsAddedJson, config.firstNameColumn, config.lastNameColumn) : allColumnsAddedJson
  Progress.success('Added all necessary columns.')

  Progress.statement('Reformatting column data.')
  const compiledJson = compileColumns(namesFixedJson)
  Progress.success('Reformatted column data.')

  Progress.statement('Overwriting JSON file with reformatted column data.')
  await fs.writeFile(`spreadsheets/output/${jsonFile}`, JSON.stringify(compiledJson))
  Progress.success('Saved new JSON file.')

  const allKeys = Object.keys(compiledJson[0])
  Progress.title('Here are the options to select as a primary key.')
  allKeys.forEach(key => console.log(`${colors.cyan(key)}, `))


  await primaryKeyPrompt.prompt()
}