import XLSX from 'xlsx'
import fs from 'fs/promises'
import Progress from '../progress/Progress'
import { inputFileDir, outputFileDir } from '../dir'
import { getFileFromFilename, inputFileNamePrompt } from '../prompts/filename'
import prompt from 'prompt'

export default async () => {
  const file = getFileFromFilename(prompt.history(inputFileNamePrompt.variable).value)
  Progress.statement(`File: ${file} found. Converting to JSON.`)
  const json = XLSX.readFile(inputFileDir(file))
  Progress.statement(`File converted.  Saving json version to @/spreadsheets/output/${file}.json`)
  await fs.writeFile(`${outputFileDir(file)}.json`, JSON.stringify(json))
  Progress.success(`JSON file created.`)
  return json
}