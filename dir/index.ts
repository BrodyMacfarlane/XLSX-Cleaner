import path from 'path'

export const mainDir = path.join('require.main.filename', '../')
export const inputFileDir = (inputFile: string) => `${mainDir}/spreadsheets/input/${inputFile}`
export const outputFileDir = (outputFile: string) => `${mainDir}/spreadsheets/output/${outputFile}`