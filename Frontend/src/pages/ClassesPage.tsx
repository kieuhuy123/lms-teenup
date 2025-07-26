import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { ClassSchedule } from '@/features/classes/ClassSchedule'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useClasses, useStudents } from '@/hooks'
import type { Class } from '@/types'

export function ClassesPage () {
  const { getWeeklySchedule, registerStudent, loading, error } = useClasses()
  const { students } = useStudents()
  const [showRegistration, setShowRegistration] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [registering, setRegistering] = useState(false)

  const handleRegisterStudent = (classItem: Class) => {
    setSelectedClass(classItem)
    setShowRegistration(true)
  }

  const handleSubmitRegistration = async () => {
    if (!selectedClass || !selectedStudent) return

    try {
      setRegistering(true)
      await registerStudent(selectedClass._id, { student_id: selectedStudent })
      setShowRegistration(false)
      setSelectedStudent('')
      setSelectedClass(null)
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error)
    } finally {
      setRegistering(false)
    }
  }

  const handleCloseRegistration = () => {
    setShowRegistration(false)
    setSelectedStudent('')
    setSelectedClass(null)
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Quản lý lớp học'
        description='Xem lịch học tuần và đăng ký học sinh vào lớp'
      />

      <ClassSchedule
        getWeeklySchedule={getWeeklySchedule}
        onRegisterStudent={handleRegisterStudent}
        loading={loading}
        error={error}
      />

      {/* Registration Dialog - Responsive */}
      <Dialog open={showRegistration} onOpenChange={handleCloseRegistration}>
        <DialogContent className='w-[95vw] max-w-md mx-auto'>
          <DialogHeader>
            <DialogTitle className='text-lg'>
              Đăng ký học sinh vào lớp
            </DialogTitle>
          </DialogHeader>

          {selectedClass && (
            <div className='space-y-4'>
              <div className='p-4 bg-gray-50 rounded-lg space-y-2'>
                <h3 className='font-medium text-sm sm:text-base'>
                  {selectedClass.name}
                </h3>
                <p className='text-xs sm:text-sm text-muted-foreground'>
                  {selectedClass.subject} - {selectedClass.teacher_name}
                </p>
                <div className='flex flex-col sm:flex-row sm:justify-between gap-1 text-xs sm:text-sm'>
                  <span>
                    Thời gian: {selectedClass.time_slot.start_time} -{' '}
                    {selectedClass.time_slot.end_time}
                  </span>
                  <span>
                    Chỗ trống: {selectedClass.available_slots}/
                    {selectedClass.max_students}
                  </span>
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>Chọn học sinh *</label>
                <Select
                  onValueChange={setSelectedStudent}
                  value={selectedStudent}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn học sinh' />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student._id} value={student._id}>
                        <div className='flex flex-col'>
                          <span>{student.name}</span>
                          <span className='text-xs text-muted-foreground'>
                            {student.current_grade}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col sm:flex-row gap-2 pt-4'>
                <Button
                  onClick={handleSubmitRegistration}
                  disabled={!selectedStudent || registering}
                  className='w-full sm:w-auto'
                >
                  {registering ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>
                <Button
                  variant='outline'
                  onClick={handleCloseRegistration}
                  className='w-full sm:w-auto'
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
