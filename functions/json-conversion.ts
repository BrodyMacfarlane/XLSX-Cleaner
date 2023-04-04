import XLSX from 'xlsx'
import Progress from '../progress/Progress'
import { outputFileDir } from '../dir'
import { inputFilePrompt } from '../prompts/filename'
import { promptHistory } from '../prompts/Prompt'

export default async () => {
  const file = promptHistory(inputFilePrompt.variable)
  Progress.statement(`File: ${file}-final.json found. Converting to XLSX.`)
  const json = require(`../spreadsheets/output/${file}-final.json`)
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(json)
  XLSX.utils.book_append_sheet(workbook, worksheet)
  Progress.statement(`File converted.  Saving xlsx version to @/spreadsheets/output/${file}`)
  await XLSX.writeFile(workbook, outputFileDir(file))
  Progress.success(`XLSX file created.`)
  return json
}