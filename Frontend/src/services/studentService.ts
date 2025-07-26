import { apiClient, extractApiData } from './api'
import { API_CONFIG } from '../config/api'
import type {
  Student,
  CreateStudentData,
  UpdateStudentData,
  ApiResponse
} from '../types'

export const studentService = {
  // Lấy tất cả students
  getAll: async (): Promise<Student[]> => {
    const response = await apiClient.get<ApiResponse<Student[]>>(
      API_CONFIG.ENDPOINTS.STUDENTS
    )
    return extractApiData(response)
  },

  // Lấy student theo ID
  getById: async (id: string): Promise<Student> => {
    const response = await apiClient.get<ApiResponse<Student>>(
      `${API_CONFIG.ENDPOINTS.STUDENTS}/${id}`
    )
    return extractApiData(response)
  },

  // Lấy students theo parent ID
  getByParentId: async (parentId: string): Promise<Student[]> => {
    const response = await apiClient.get<ApiResponse<Student[]>>(
      `${API_CONFIG.ENDPOINTS.STUDENTS}/parent/${parentId}`
    )
    return extractApiData(response)
  },

  // Lấy students theo grade
  getByGrade: async (grade: string): Promise<Student[]> => {
    const response = await apiClient.get<ApiResponse<Student[]>>(
      `${API_CONFIG.ENDPOINTS.STUDENTS}/grade/${grade}`
    )
    return extractApiData(response)
  },

  // Tạo student mới
  create: async (data: CreateStudentData): Promise<Student> => {
    const response = await apiClient.post<ApiResponse<Student>>(
      API_CONFIG.ENDPOINTS.STUDENTS,
      data
    )
    return extractApiData(response)
  },

  // Cập nhật student
  update: async (id: string, data: UpdateStudentData): Promise<Student> => {
    const response = await apiClient.put<ApiResponse<Student>>(
      `${API_CONFIG.ENDPOINTS.STUDENTS}/${id}`,
      data
    )
    return extractApiData(response)
  },

  // Xóa student
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.STUDENTS}/${id}`)
  }
}
