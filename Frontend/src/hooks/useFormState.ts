import { useState, useCallback } from 'react'

interface UseFormStateOptions {
  initialLoading?: boolean
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useFormState (options: UseFormStateOptions = {}) {
  const [isLoading, setIsLoading] = useState(options.initialLoading || false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const execute = useCallback(
    async (asyncFunction: () => Promise<unknown>) => {
      try {
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        await asyncFunction()

        setSuccess(true)
        options.onSuccess?.()
      } catch (err: unknown) {
        const error = err as Error
        const errorMessage = error.message || 'Có lỗi xảy ra'
        setError(errorMessage)
        options.onError?.(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [options]
  )

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setSuccess(false)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    success,
    execute,
    reset,
    clearError
  }
}
