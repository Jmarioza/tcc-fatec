import { read, utils, WorkBook, WorkSheet, writeFile } from 'xlsx'
import { exportToExcelBuffer } from './exportToExcelBuffer'

export function processExcelFile<T>(file: File): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      if (e.target?.result) {
        const workbook: WorkBook = read(e.target.result, { type: 'binary' })
        const worksheetName = workbook.SheetNames[0]
        const worksheet: WorkSheet = workbook.Sheets[worksheetName]
        const jsonData: T[] = utils.sheet_to_json(worksheet)
        resolve(jsonData)
      } else {
        reject(new Error('Falha ao ler o arquivo.'))
      }
    }
    fileReader.readAsBinaryString(file)
  })
}

interface Props {
  fileName: string
  worksheetName: string
  data: string[][]
}

export const exportPlan = ({ worksheetName, fileName, data }: Props) => {
  const workbook: WorkBook = utils.book_new()
  const worksheet: WorkSheet = utils.aoa_to_sheet(data)
  utils.book_append_sheet(workbook, worksheet, worksheetName)
  exportToExcelBuffer(workbook)
  writeFile(workbook, `${fileName}.xlsx`, {
    bookType: 'xlsx',
    type: 'binary',
  })
}
