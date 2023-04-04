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

  // console.log(json[0])
}