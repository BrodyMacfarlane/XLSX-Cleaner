import initialSetup from './initial-setup'
import xlsxJsonConversion from '../functions/xlsx-conversion'
import jsonXlsxConversion from '../functions/json-conversion'
import filename from './filename'
import primaryKey from './primary-key'
import compileDuplicates from './compile-duplicates'
import fieldCleanups from './field-cleanups'

export default async () => {
  await initialSetup()
  await filename()
  await xlsxJsonConversion()
  await fieldCleanups()
  await primaryKey()
  await compileDuplicates()
  await jsonXlsxConversion()
}