// Export tất cả types từ một file duy nhất
export * from './parent'
export * from './student'
export * from './class'
export * from './subscription'
export * from './api'

// Common types
export interface SelectOption {
  value: string
  label: string
}

export interface FormState {
  isLoading: boolean
  error: string | null
}
