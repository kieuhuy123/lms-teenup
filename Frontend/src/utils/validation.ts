import { z } from 'zod'

export const parentSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ')
})

export const studentSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  dob: z.string().min(1, 'Ngày sinh là bắt buộc'),
  gender: z.enum(['male', 'female', 'other']).refine(val => val, {
    message: 'Giới tính là bắt buộc'
  }),
  current_grade: z.string().min(1, 'Lớp học hiện tại là bắt buộc'),
  parent_id: z.string().min(1, 'Phụ huynh là bắt buộc')
})

export const classSchema = z.object({
  name: z.string().min(2, 'Tên lớp phải có ít nhất 2 ký tự'),
  subject: z.string().min(2, 'Môn học là bắt buộc'),
  day_of_week: z.enum([
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ]),
  time_slot: z.object({
    start_time: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Thời gian không hợp lệ'),
    end_time: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Thời gian không hợp lệ')
  }),
  teacher_name: z.string().min(2, 'Tên giáo viên là bắt buộc'),
  max_students: z.number().min(1, 'Số học sinh tối đa phải ít nhất 1')
})
