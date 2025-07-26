import axios from 'axios'
import type { AxiosResponse, AxiosError } from 'axios'
import { API_CONFIG } from '../config/api'
import type { ApiResponse, ApiError } from '../types'

// Tạo axios instance
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  error => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error: AxiosError<ApiError>) => {
    console.error(
      '❌ API Response Error:',
      error.response?.data || error.message
    )

    const apiError: ApiError = {
      success: false,
      message:
        error.response?.data?.message || error.message || 'Có lỗi xảy ra',
      status: error.response?.status || 500
    }

    return Promise.reject(apiError)
  }
)

// Helper function để extract data từ response
export const extractApiData = <T>(
  response: AxiosResponse<ApiResponse<T>>
): T => {
  return response.data.data
}
