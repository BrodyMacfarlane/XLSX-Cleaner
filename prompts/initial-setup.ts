import Progress from "../progress/Progress"
import fs from 'fs/promises'

type dir = string
type file = {
  file: string,
  contents: string
}

let modified = []

const validateFileOrDirExists = async (file) => {
  try {
    await fs.stat(file)
    return true
  }
  catch (err) {
    return false
  }
}

const createDir = async (dir) => {
  await fs.mkdir(dir)
  modified.push(dir)
  Progress.statement(`Created ${dir}`)
}

const createFile = async (file) => {
  modified.push(file.file)
  await fs.writeFile(file.file, file.contents)
}

const dirs: dir[] = [
  "spreadsheets/input",
  "spreadsheets/output"
]

const files: file[] = [
  {
    file: "config.json",
    contents: JSON.stringify({
      "columnsToCompile": [
        {
          "newColumnName": "Questionnaire",
          "columnsToInclude": []
        }
      ]
    })
  }
]

export default async () => {
  for (const dir of dirs) {
    const exists = await validateFileOrDirExists(dir)
    if (!exists) createDir(dir)
  }

  for (const file of files) {
    const exists = await validateFileOrDirExists(file.file)
    if (!exists) createFile(file)
  }

  const modifiedString = modified.join(', ')

  if (modified.length) Progress.success(`${modifiedString} created.`)
  Progress.title("Init successful.")
}