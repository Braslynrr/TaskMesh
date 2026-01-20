export interface CardResponse {
  _id: string
  title: string
  description: string
  listId: string
  createdBy: string
  assignedTo: string[]
  createdAt: Date
  updatedAt: Date
}