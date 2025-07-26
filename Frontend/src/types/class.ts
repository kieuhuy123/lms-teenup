export interface TimeSlot {
  start_time: string
  end_time: string
}

export interface Class {
  _id: string
  name: string
  subject: string
  day_of_week:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday'
  time_slot: TimeSlot
  teacher_name: string
  max_students: number
  registered_students?: number
  available_slots?: number
  createdAt: string
  updatedAt: string
}

export interface CreateClassData {
  name: string
  subject: string
  day_of_week:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday'
  time_slot: TimeSlot
  teacher_name: string
  max_students: number
}

export interface ClassRegistration {
  _id: string
  class_id: string | Class
  student_id: string
  registration_date: string
  status: 'active' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface CreateRegistrationData {
  student_id: string
}
