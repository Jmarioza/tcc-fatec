import { CellObject } from 'sheetjs-style'

type Style = CellObject['s']

export const header: Style = {
  border: {
    bottom: {
      color: { rgb: '4766ff' },
      style: 'thin',
    },
  },
  font: {
    color: { rgb: '7d94ab' },
  },
  alignment: {
    horizontal: 'center',
    vertical: 'center',
  },
}

export const footer: Style = {
  border: {
    top: {
      style: 'dashed',
      color: { rgb: '4766ff' },
    },
  },
  font: {
    bold: true,
  },
}

export const color: Style = {
  fill: {
    fgColor: { rgb: 'cce6ff' },
  },
}

export const noColor: Style = {}
