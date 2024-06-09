export interface TransactionOccurrenceDTO {
  id: number
  transactionId: number
  dateTime: string
  userCancel: number
  occurrence: string
  reason: string
  occurrenceType: string
}
