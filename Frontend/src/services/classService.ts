import { apiClient, extractApiData } from './api'
import { API_CONFIG } from '../config/api'
import type {
  Class,
  CreateClassData,
  ClassRegistration,
  CreateRegistrationData,
  Student,
  ApiResponse
} from '../types'

export const classService = {
  // Lấy tất cả classes
  getAll: async (): Promise<Class[]> => {
    const response = await apiClient.get<ApiResponse<Class[]>>(
      API_CONFIG.ENDPOINTS.CLASSES
    )
    return extractApiData(response)
  },

  // Lấy classes theo ngày
  getByDay: async (day: string): Promise<Class[]> => {
    const response = await apiClient.get<ApiResponse<Class[]>>(
      `${API_CONFIG.ENDPOINTS.CLASSES}?day=${day}`
    )
    return extractApiData(response)
  },

  // Lấy class theo ID
  getById: async (id: string): Promise<Class> => {
    const response = await apiClient.get<ApiResponse<Class>>(
      `${API_CONFIG.ENDPOINTS.CLASSES}/${id}`
    )
    return extractApiData(response)
  },

  // Tạo class mới
  create: async (data: CreateClassData): Promise<Class> => {
    const response = await apiClient.post<ApiResponse<Class>>(
      API_CONFIG.ENDPOINTS.CLASSES,
      data
    )
    return extractApiData(response)
  },

  // Đăng ký student vào class
  registerStudent: async (
    classId: string,
    data: CreateRegistrationData
  ): Promise<ClassRegistration> => {
    const response = await apiClient.post<ApiResponse<ClassRegistration>>(
      `${API_CONFIG.ENDPOINTS.CLASSES}/${classId}/register`,
      data
    )
    return extractApiData(response)
  },

  // Lấy danh sách students trong class
  getClassStudents: async (classId: string): Promise<Student[]> => {
    const response = await apiClient.get<ApiResponse<Student[]>>(
      `${API_CONFIG.ENDPOINTS.CLASSES}/${classId}/students`
    )
    return extractApiData(response)
  },

  // Cập nhật class
  update: async (
    id: string,
    data: Partial<CreateClassData>
  ): Promise<Class> => {
    const response = await apiClient.put<ApiResponse<Class>>(
      `${API_CONFIG.ENDPOINTS.CLASSES}/${id}`,
      data
    )
    return extractApiData(response)
  },

  // Xóa class
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.CLASSES}/${id}`)
  }
}
