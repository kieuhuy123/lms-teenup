import { useState, useEffect, useCallback } from 'react'
import type { Parent, CreateParentData, UpdateParentData } from '../types'
import { parentService } from '../services'
import { useApi } from './useApi'

export function useParents () {
  const [parents, setParents] = useState<Parent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // API hooks
  const createParentApi = useApi(parentService.create)
  const updateParentApi = useApi(parentService.update)
  const deleteParentApi = useApi(parentService.delete)

  // Fetch all parents
  const fetchParents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await parentService.getAll()
      setParents(data)
    } catch (err: unknown) {
      const error = err as Error
      setError(error.message || 'Không thể tải danh sách phụ huynh')
    } finally {
      setLoading(false)
    }
  }, [])

  // Create parent
  const createParent = useCallback(
    async (data: CreateParentData) => {
      try {
        const newParent = await createParentApi.execute(data)
        if (newParent) {
          setParents(prev => [newParent, ...prev])
          return newParent
        }
      } catch (error) {
        console.error('Failed to create Parent', error)
        throw error
      }
    },
    [createParentApi]
  )

  // Update parent
  const updateParent = useCallback(
    async (id: string, data: UpdateParentData) => {
      try {
        const updatedParent = await updateParentApi.execute(id, data)
        if (updatedParent) {
          setParents(prev =>
            prev.map(parent => (parent._id === id ? updatedParent : parent))
          )
          return updatedParent
        }
      } catch (error) {
        console.error('Failed to updateParent', error)
        throw error
      }
    },
    [updateParentApi]
  )

  // Delete parent
  const deleteParent = useCallback(
    async (id: string) => {
      try {
        await deleteParentApi.execute(id)
        setParents(prev => prev.filter(parent => parent._id !== id))
      } catch (error) {
        console.error('Failed to deleteParent', error)
        throw error
      }
    },
    [deleteParentApi]
  )

  // Load parents on mount
  useEffect(() => {
    fetchParents()
  }, [fetchParents])

  return {
    parents,
    loading:
      loading ||
      createParentApi.loading ||
      updateParentApi.loading ||
      deleteParentApi.loading,
    error:
      error ||
      createParentApi.error ||
      updateParentApi.error ||
      deleteParentApi.error,
    fetchParents,
    createParent,
    updateParent,
    deleteParent,
    refetch: fetchParents
  }
}
