import { useState, useCallback } from 'react'
import type { ApiError } from '../types'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiReturn<T, TArgs extends unknown[]> extends UseApiState<T> {
  execute: (...args: TArgs) => Promise<T | void>
  reset: () => void
  setData: (data: T) => void
}

export function useApi<T, TArgs extends unknown[] = []> (
  apiFunction: (...args: TArgs) => Promise<T>
): UseApiReturn<T, TArgs> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const execute = useCallback(
    async (...args: TArgs): Promise<T | void> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        const result = await apiFunction(...args)
        setState(prev => ({ ...prev, data: result, loading: false }))
        return result
      } catch (err: unknown) {
        const error = err as ApiError
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Có lỗi xảy ra'
        }))
        throw err
      }
    },
    [apiFunction]
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }))
  }, [])

  return {
    ...state,
    execute,
    reset,
    setData
  }
}
