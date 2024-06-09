import { StyleSheet } from '@react-pdf/renderer'

export const styles = StyleSheet.create({
  cell: {
    display: 'flex',
    flexWrap: 'nowrap',
    fontSize: 8,
    textAlign: 'left',
    overflow: 'hidden',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: 2,
    marginLeft: 2,
  },

  isFooter: {
    fontSize: 9,
    fontWeight: 'bold',
  },
})
