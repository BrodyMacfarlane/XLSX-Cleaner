import initialSetup from './initial-setup'
import xlsxConversion from '../functions/xlsx-conversion'
import filename from './filename'
import primaryKey from './primary-key'

export default async () => {
  await initialSetup()
  await filename()
  await xlsxConversion()
  await primaryKey()
  // await compileDuplicates()
}