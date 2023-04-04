import fs from 'fs/promises'
import Prompt from './Prompt'
import colors from '@colors/colors/safe'
import Progress from '../progress/Progress'
import { outputFileDir } from '../dir'
import { promptHistory } from './Prompt'
import { inputFilePrompt } from './filename'
import { primaryKeyPrompt } from './primary-key'
import { noSpaceClean, numbersOnlyClean, requireUncached } from '../functions'
import config from '../config.json'


export default async () => {
  const jsonFile = `${promptHistory(inputFilePrompt.variable)}.json`
  const jsonFilePath = `../${outputFileDir(jsonFile)}`
  const json: JSON = requireUncached(jsonFilePath)




  Progress.statement('Cleaning all columns marked as no space.')
  const noSpaceColumns = config.cleanupMethods["no spaces"]
  const noSpaceJson = noSpaceClean(json, noSpaceColumns)
  Progress.success('Cleaned all columns marked as no space.')


  Progress.statement('Cleaning all columns marked as numbers only.')
  const numbersOnlyColumns = config.cleanupMethods["numbers only"]
  const numbersOnlyJson = numbersOnlyClean(noSpaceJson, numbersOnlyColumns)

  Progress.success('Cleaned all columns marked as numbers only.')

  Progress.statement('Overwriting JSON file with cleaned data.')
  await fs.writeFile(`spreadsheets/output/${jsonFile}`, JSON.stringify(numbersOnlyJson))
  Progress.success('Saved cleaned JSON file.')
}