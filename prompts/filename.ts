import fs from 'fs/promises'
import { inputFileDir } from '../dir'
import Prompt from './Prompt'
import colors from '@colors/colors/safe'
import Exception from '../exceptions/Exception'

export function getFileFromFilename(filename: string) {
  const fileHasExtension = filename.endsWith('.xlsx')
  const file = fileHasExtension ? filename : `${filename}.xlsx`
  return file
}

export const inputFileNamePrompt = new Prompt({
  text: `Please place and input the filename located at ${colors.cyan("@/spreadsheets/input/______.xlsx")}`,
  variable: "inputFileName",
  stringResponseOptions: (filename) => (filename),
})

export default async () => {
  const filename = await inputFileNamePrompt.prompt()
  const file = getFileFromFilename(filename)

  try {
    await fs.stat(inputFileDir(file))
  }
  catch (err) {
    Exception.throw(`File '${file}' does not exist inside of '@/spreadsheets/input/.\nPlease double check the file exists and has the correct extension.`)
  }

  return file
}