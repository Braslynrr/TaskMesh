import { getApiErrorMessage } from "./api-error.helper"
import { ApiErrorResponse } from "./api-error.types"

export function extractApiErrorMessage(error: unknown): string {
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