import type { Parent } from './parent'

export interface Student {
  _id: string
  name: string
  dob: string
  gender: 'male' | 'female' | 'other'
  current_grade: string
  parent_id: string | Parent
  createdAt: string
  updatedAt: string
}

export interface CreateStudentData {
  name: string
  dob: string
  gender: 'male' | 'female' | 'other'
  current_grade: string
  parent_id: string
}

export interface UpdateStudentData {
  name?: string
  dob?: string
  gender?: 'male' | 'female' | 'other'
  current_grade?: string
  parent_id?: string
}
