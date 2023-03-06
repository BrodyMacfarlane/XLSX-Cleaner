import XLSX from 'xlsx'
import fs from 'fs/promises'
import Progress from '../progress/Progress'
import { inputFileDir, outputFileDir } from '../dir'
import { inputFilePrompt } from '../prompts/filename'
import { promptHistory } from '../prompts/Prompt'

export default async () => {
  const file = promptHistory(inputFilePrompt.variable)
  Progress.statement(`File: ${file} found. Converting to JSON.`)
  const workbook = XLSX.readFile(inputFileDir(file))
  const sheetNames = workbook.SheetNames
  const sheetContents = workbook.Sheets[sheetNames[0]]
  const json = XLSX.utils.sheet_to_json(sheetContents)
  Progress.statement(`File converted.  Saving json version to @/spreadsheets/output/${file}.json`)
  await fs.writeFile(`${outputFileDir(file)}.json`, JSON.stringify(json))
  Progress.success(`JSON file created.`)
  return json
}