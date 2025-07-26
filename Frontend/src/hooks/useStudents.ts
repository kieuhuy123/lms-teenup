import { useState, useEffect, useCallback } from 'react'
import type { Student, CreateStudentData, UpdateStudentData } from '../types'
import { studentService } from '../services'
import { useApi } from './useApi'

export function useStudents () {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // API hooks
  const createStudentApi = useApi(studentService.create)
  const updateStudentApi = useApi(studentService.update)
  const deleteStudentApi = useApi(studentService.delete)

  // Fetch all students
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await studentService.getAll()
      setStudents(data)
    } catch (err: unknown) {
      const error = err as Error
      setError(error.message || 'Không thể tải danh sách học sinh')
    } finally {
      setLoading(false)
    }
  }, [])

  // Get students by parent ID
  const getStudentsByParent = useCallback(async (parentId: string) => {
    try {
      const data = await studentService.getByParentId(parentId)
      return data
    } catch (err: unknown) {
      const error = err as Error
      throw new Error(error.message || 'Không thể tải danh sách học sinh')
    }
  }, [])

  // Create student
  const createStudent = useCallback(
    async (data: CreateStudentData) => {
      try {
        const newStudent = await createStudentApi.execute(data)
        if (newStudent) {
          setStudents(prev => [newStudent, ...prev])
          return newStudent
        }
      } catch (error) {
        console.error('Failed to createStudent', error)
        throw error
      }
    },
    [createStudentApi]
  )

  // Update student
  const updateStudent = useCallback(
    async (id: string, data: UpdateStudentData) => {
      try {
        const updatedStudent = await updateStudentApi.execute(id, data)
        if (updatedStudent) {
          setStudents(prev =>
            prev.map(student => (student._id === id ? updatedStudent : student))
          )
          return updatedStudent
        }
      } catch (error) {
        console.error('Failed to updateStudent', error)
        throw error
      }
    },
    [updateStudentApi]
  )

  // Delete student
  const deleteStudent = useCallback(
    async (id: string) => {
      try {
        await deleteStudentApi.execute(id)
        setStudents(prev => prev.filter(student => student._id !== id))
      } catch (error) {
        console.error('Failed to deleteStudent', error)
        throw error
      }
    },
    [deleteStudentApi]
  )

  // Load students on mount
  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  return {
    students,
    loading:
      loading ||
      createStudentApi.loading ||
      updateStudentApi.loading ||
      deleteStudentApi.loading,
    error:
      error ||
      createStudentApi.error ||
      updateStudentApi.error ||
      deleteStudentApi.error,
    fetchStudents,
    getStudentsByParent,
    createStudent,
    updateStudent,
    deleteStudent,
    refetch: fetchStudents
  }
}
