import { ApiErrorResponse } from "./api-error.types"


export function getApiErrorMessage(error: ApiErrorResponse): string {
  if (error.issues?.length) {
    return error.issues[0].message
  }
  return error.message ?? "Unexpected error"
}