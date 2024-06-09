import { WorkBook, write } from 'xlsx'

export const exportToExcelBuffer = (workbook: WorkBook): ArrayBuffer => {
  const excelData = write(workbook, { bookType: 'xlsx', type: 'array' })
  const arrayBuffer = new ArrayBuffer(excelData.length)
  const view = new Uint8Array(arrayBuffer)
  for (let i = 0; i < excelData.length; i++) {
    view[i] = excelData[i]
  }
  return arrayBuffer
}
