import XLSX, { CellObject, WorkBook, WorkSheet } from 'sheetjs-style'

interface WriteWorkBookProps {
  data: CellObject[][]
  worksheetName: string
  fileName: string
}

export function writeWorkBook({
  data,
  fileName,
  worksheetName,
}: WriteWorkBookProps) {
  const workbook: WorkBook = XLSX.utils.book_new()
  const worksheet: WorkSheet = XLSX.utils.aoa_to_sheet<CellObject>(data)
  XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName)
  XLSX.writeFile(workbook, fileName, {
    bookType: 'xlsx',
    type: 'binary',
  })
}
