import { apiClient, extractApiData } from './api'
import { API_CONFIG } from '../config/api'
import type {
  Subscription,
  SubscriptionPackage,
  CreateSubscriptionData,
  CreatePackageData,
  ApiResponse
} from '../types'

export const subscriptionService = {
  // === SUBSCRIPTION PACKAGES ===

  // Lấy tất cả packages
  getAllPackages: async (): Promise<SubscriptionPackage[]> => {
    const response = await apiClient.get<ApiResponse<SubscriptionPackage[]>>(
      API_CONFIG.ENDPOINTS.PACKAGES
    )
    return extractApiData(response)
  },

  // Lấy active packages
  getActivePackages: async (): Promise<SubscriptionPackage[]> => {
    const response = await apiClient.get<ApiResponse<SubscriptionPackage[]>>(
      `${API_CONFIG.ENDPOINTS.PACKAGES}?status=active`
    )
    return extractApiData(response)
  },

  // Lấy package theo ID
  getPackageById: async (id: string): Promise<SubscriptionPackage> => {
    const response = await apiClient.get<ApiResponse<SubscriptionPackage>>(
      `${API_CONFIG.ENDPOINTS.PACKAGES}/${id}`
    )
    return extractApiData(response)
  },

  // Tạo package mới
  createPackage: async (
    data: CreatePackageData
  ): Promise<SubscriptionPackage> => {
    const response = await apiClient.post<ApiResponse<SubscriptionPackage>>(
      API_CONFIG.ENDPOINTS.PACKAGES,
      data
    )
    return extractApiData(response)
  },

  // === SUBSCRIPTIONS ===

  // Lấy tất cả subscriptions
  getAllSubscriptions: async (): Promise<Subscription[]> => {
    const response = await apiClient.get<ApiResponse<Subscription[]>>(
      API_CONFIG.ENDPOINTS.SUBSCRIPTIONS
    )
    return extractApiData(response)
  },

  // Lấy subscription theo ID
  getSubscriptionById: async (id: string): Promise<Subscription> => {
    const response = await apiClient.get<ApiResponse<Subscription>>(
      `${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS}/${id}`
    )
    return extractApiData(response)
  },

  // Lấy subscriptions theo student ID
  getByStudentId: async (studentId: string): Promise<Subscription[]> => {
    const response = await apiClient.get<ApiResponse<Subscription[]>>(
      `${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS}/student/${studentId}`
    )
    return extractApiData(response)
  },

  // Lấy active subscription của student
  getActiveSubscription: async (
    studentId: string
  ): Promise<Subscription | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Subscription>>(
        `${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS}/student/${studentId}/active`
      )
      return extractApiData(response)
    } catch (error: any) {
      if (error.status === 404) {
        return null
      }
      throw error
    }
  },

  // Tạo subscription mới
  createSubscription: async (
    data: CreateSubscriptionData
  ): Promise<Subscription> => {
    const response = await apiClient.post<ApiResponse<Subscription>>(
      API_CONFIG.ENDPOINTS.SUBSCRIPTIONS,
      data
    )
    return extractApiData(response)
  },

  // Sử dụng một session
  useSession: async (id: string): Promise<Subscription> => {
    const response = await apiClient.patch<ApiResponse<Subscription>>(
      `${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS}/${id}/use`
    )
    return extractApiData(response)
  },

  // Cancel subscription
  cancelSubscription: async (id: string): Promise<Subscription> => {
    const response = await apiClient.patch<ApiResponse<Subscription>>(
      `${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS}/${id}/cancel`
    )
    return extractApiData(response)
  }
}
