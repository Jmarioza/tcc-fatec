import { StyleSheet } from '@react-pdf/renderer'

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 4,
    paddingTop: 4,
    borderBottom: '1px solid black',
  },

  accreditorContainer: {
    flexWrap: 'wrap',
    textTransform: 'uppercase',
    fontSize: 6,
    width: 300,
  },

  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    width: '100%',
    textAlign: 'center',
    paddingBottom: 4,
  },

  title: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  period: {
    fontSize: 8,
  },

  dateContainer: {
    textAlign: 'right',
    width: 300,
    fontSize: 6,
  },
})
