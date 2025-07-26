import { useState, useEffect, useCallback } from 'react'
import type {
  Class,
  CreateClassData,
  Student,
  CreateRegistrationData
} from '../types'
import { classService } from '../services'
import { useApi } from './useApi'

export function useClasses () {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // API hooks
  const createClassApi = useApi(classService.create)
  const registerStudentApi = useApi(classService.registerStudent)

  // Fetch all classes
  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await classService.getAll()
      setClasses(data)
    } catch (err: unknown) {
      const error = err as Error
      setError(error.message || 'Không thể tải danh sách lớp học')
    } finally {
      setLoading(false)
    }
  }, [])

  // Get classes by day
  const getClassesByDay = useCallback(async (day: string) => {
    try {
      const data = await classService.getByDay(day)
      return data
    } catch (err) {
      const error = err as Error
      throw new Error(error.message || 'Không thể tải lớp học theo ngày')
    }
  }, [])

  // Get class students
  const getClassStudents = useCallback(
    async (classId: string): Promise<Student[]> => {
      try {
        const data = await classService.getClassStudents(classId)
        return data
      } catch (err: unknown) {
        const error = err as Error
        throw new Error(error.message || 'Không thể tải danh sách học sinh')
      }
    },
    []
  )

  // Create class
  const createClass = useCallback(
    async (data: CreateClassData) => {
      try {
        const newClass = await createClassApi.execute(data)
        if (newClass) {
          setClasses(prev => [newClass, ...prev])
          return newClass
        }
      } catch (error) {
        console.error('Failed to create class:', error)
        throw error
      }
    },
    [createClassApi]
  )

  // Register student to class
  const registerStudent = useCallback(
    async (classId: string, data: CreateRegistrationData) => {
      try {
        const registration = await registerStudentApi.execute(classId, data)
        // Refresh classes to update registered count
        await fetchClasses()
        return registration
      } catch (error) {
        console.error('Failed to registerStudent:', error)
        throw error
      }
    },
    [registerStudentApi, fetchClasses]
  )

  // Get weekly schedule (7 days)
  const getWeeklySchedule = useCallback(async () => {
    try {
      const days = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
      ]
      const weeklyClasses: Record<string, Class[]> = {}

      for (const day of days) {
        weeklyClasses[day] = await getClassesByDay(day)
      }

      return weeklyClasses
    } catch (err: unknown) {
      const error = err as Error
      throw new Error(error.message || 'Không thể tải lịch học tuần')
    }
  }, [getClassesByDay])

  // Load classes on mount
  useEffect(() => {
    fetchClasses()
  }, [fetchClasses])

  return {
    classes,
    loading: loading || createClassApi.loading || registerStudentApi.loading,
    error: error || createClassApi.error || registerStudentApi.error,
    fetchClasses,
    getClassesByDay,
    getClassStudents,
    getWeeklySchedule,
    createClass,
    registerStudent,
    refetch: fetchClasses
  }
}
