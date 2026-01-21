
export type ApiIssue = {
  message: string,
  field?: string  
}

export type ApiErrorResponse = {
  message: string,
  issues?: ApiIssue[]
}