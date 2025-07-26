import type { Student } from './student'

export interface SubscriptionPackage {
  _id: string
  name: string
  description: string
  total_sessions: number
  duration_days: number
  price: number
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  _id: string
  student_id: string | Student
  package_id: string | SubscriptionPackage
  start_date: string
  end_date: string
  total_sessions: number
  used_sessions: number
  remaining_sessions?: number
  status: 'active' | 'expired' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface CreateSubscriptionData {
  student_id: string
  package_id: string
  start_date: string
}

export interface CreatePackageData {
  name: string
  description: string
  total_sessions: number
  duration_days: number
  price: number
}
