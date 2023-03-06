import Progress from "../progress/Progress"
import fs from 'fs/promises'
import Exception from "../exceptions/Exception"

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
  try {
    await fs.mkdir(dir, { recursive: true })
    modified.push(dir)
    Progress.statement(`Created ${dir}`)
  }
  catch (err) {
    Exception.throw(err.message)
  }
}

const createFile = async (file) => {
  try {
    modified.push(file.file)
    await fs.writeFile(file.file, file.contents)
  }
  catch (err) {
    Exception.throw(err.message)
  }
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

const createDirs = async () => {
  for (const dir of dirs) {
    const exists = await validateFileOrDirExists(dir)
    if (!exists) createDir(dir)
  }
  return
}

const createFiles = async () => {
  for (const file of files) {
    const exists = await validateFileOrDirExists(file.file)
    if (!exists) createFile(file)
  }
}

export default async () => {
  await createDirs()
  await createFiles()

  const modifiedString = modified.join(', ')

  if (modified.length) Progress.success(`${modifiedString} created.`)
  Progress.title("Init successful.")
}