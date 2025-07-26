export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  status: number
}

export interface ApiError {
  success: false
  message: string
  status: number
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
