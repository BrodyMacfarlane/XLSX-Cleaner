import fs from 'fs/promises'
import { inputFileDir } from '../dir'
import Prompt from './Prompt'
import colors from '@colors/colors/safe'
import Exception from '../exceptions/Exception'

function getFileFromFilename(filename: string) {
  const fileHasExtension = filename.endsWith('.xlsx')
  const file = fileHasExtension ? filename : `${filename}.xlsx`
  return file
}

const validateFileExists = async (file) => {
  try {
    await fs.stat(inputFileDir(file))
    return true
  }
  catch (err) {
    return false
  }
}

export const inputFilePrompt = new Prompt({
  text: `Please place and input the filename located at ${colors.cyan("@/spreadsheets/input/______.xlsx")}`,
  variable: "inputFile",
  stringResponseOptions: (filename) => getFileFromFilename(filename),
  asyncValidation: (file: string) => ({
    fn: (file: string) => validateFileExists(file),
    msg: `File '${file}' does not exist inside of '@/spreadsheets/input/.\nPlease double check the file exists and has the correct extension.`,
  })
})

export default async () => {
  const file = await inputFilePrompt.prompt()

  // try {
  //   await fs.stat(inputFileDir(file))
  // }
  // catch (err) {
  //   Exception.throw(`File '${file}' does not exist inside of '@/spreadsheets/input/.\nPlease double check the file exists and has the correct extension.`)
  // }

  return file
}