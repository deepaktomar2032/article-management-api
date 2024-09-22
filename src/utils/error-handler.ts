import { message } from './locale'

export const LogErrorMessage = (error: unknown): string => {
   let errorMessage: string

   if (error instanceof Error) {
      errorMessage = error.message
   } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message)
   } else if (typeof error === 'string') {
      errorMessage = error
   } else {
      errorMessage = message.Something_went_wrong
   }
   return errorMessage
}
