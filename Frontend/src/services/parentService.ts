import { apiClient, extractApiData } from './api'
import { API_CONFIG } from '../config/api'
import type {
  Parent,
  CreateParentData,
  UpdateParentData,
  ApiResponse
} from '../types'

export const parentService = {
  // Lấy tất cả parents
  getAll: async (): Promise<Parent[]> => {
    const response = await apiClient.get<ApiResponse<Parent[]>>(
      API_CONFIG.ENDPOINTS.PARENTS
    )
    return extractApiData(response)
  },

  // Lấy parent theo ID
  getById: async (id: string): Promise<Parent> => {
    const response = await apiClient.get<ApiResponse<Parent>>(
      `${API_CONFIG.ENDPOINTS.PARENTS}/${id}`
    )
    return extractApiData(response)
  },

  // Tạo parent mới
  create: async (data: CreateParentData): Promise<Parent> => {
    const response = await apiClient.post<ApiResponse<Parent>>(
      API_CONFIG.ENDPOINTS.PARENTS,
      data
    )
    return extractApiData(response)
  },

  // Cập nhật parent
  update: async (id: string, data: UpdateParentData): Promise<Parent> => {
    const response = await apiClient.put<ApiResponse<Parent>>(
      `${API_CONFIG.ENDPOINTS.PARENTS}/${id}`,
      data
    )
    return extractApiData(response)
  },

  // Xóa parent
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.PARENTS}/${id}`)
  }
}
