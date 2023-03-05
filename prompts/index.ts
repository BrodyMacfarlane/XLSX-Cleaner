import xlsxConversion from '../functions/xlsx-conversion'
import filename from './filename'

export default async () => {
  await filename()
  await xlsxConversion()
}