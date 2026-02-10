import { ZodError } from "zod"
import { getApiErrorMessage } from "./api-error.helper"
import { ApiErrorResponse } from "./api-error.types"

export function extractApiErrorMessage(error: unknown): string {


  if(typeof error === "object" && (error as any)?.issues !== undefined ){
      const data =  error as ZodError
      return data.issues.reduce( (all, issue) => `${all} ${issue.message}`, "")
  }
      
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response?.data === "object"
  ) {
    const data = (error as any).response.data as ApiErrorResponse
    return getApiErrorMessage(data)
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Unexpected error"
}