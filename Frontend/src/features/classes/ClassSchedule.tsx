import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Class } from '@/types'
import { getDayOfWeekLabel } from '@/utils/date'
import { Loading } from '@/components/Loading'
import { ErrorMessage } from '@/components/ErrorMessage'
import { UserPlus, RefreshCw } from 'lucide-react'

interface ClassScheduleProps {
  getWeeklySchedule: () => Promise<Record<string, Class[]>>
  onRegisterStudent: (classItem: Class) => void
  loading?: boolean
  error?: string | null
}

export function ClassSchedule ({
  getWeeklySchedule,
  onRegisterStudent,
  loading = false,
  error = null
}: ClassScheduleProps) {
  const [weeklyClasses, setWeeklyClasses] = useState<Record<string, Class[]>>(
    {}
  )
  const [isLoading, setIsLoading] = useState(false)

  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ]

  const loadSchedule = async () => {
    try {
      setIsLoading(true)
      const schedule = await getWeeklySchedule()
      setWeeklyClasses(schedule)
    } catch (err) {
      console.error('Lỗi khi tải lịch học:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSchedule()
  }, [])

  if (loading || isLoading) {
    return (
      <Card>
        <CardContent className='p-8'>
          <Loading text='Đang tải lịch học tuần...' />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <h2 className='text-xl sm:text-2xl font-bold'>Lịch học tuần</h2>
        <Button
          onClick={loadSchedule}
          variant='outline'
          size='sm'
          className='w-fit'
        >
          <RefreshCw className='h-4 w-4 mr-2' />
          Làm mới
        </Button>
      </div>

      {/* Responsive Grid - 1 col mobile, 2 col tablet, 3+ col desktop */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {days.map(day => (
          <Card key={day} className='h-fit'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base sm:text-lg'>
                {getDayOfWeekLabel(day)}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {weeklyClasses[day]?.length > 0 ? (
                weeklyClasses[day].map(classItem => (
                  <div
                    key={classItem._id}
                    className='p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex-1 min-w-0'>
                        <h4 className='font-medium text-sm truncate'>
                          {classItem.name}
                        </h4>
                        <p className='text-xs text-muted-foreground truncate'>
                          {classItem.subject}
                        </p>
                      </div>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => onRegisterStudent(classItem)}
                        className='h-7 w-7 p-0 flex-shrink-0 ml-2'
                        disabled={classItem.available_slots === 0}
                      >
                        <UserPlus className='h-3 w-3' />
                      </Button>
                    </div>

                    <div className='space-y-2 text-xs'>
                      <div className='flex justify-between items-center'>
                        <span className='text-muted-foreground'>
                          Thời gian:
                        </span>
                        <span className='font-medium text-right'>
                          {classItem.time_slot.start_time} -{' '}
                          {classItem.time_slot.end_time}
                        </span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-muted-foreground'>
                          Giáo viên:
                        </span>
                        <span className='font-medium truncate ml-2 text-right'>
                          {classItem.teacher_name}
                        </span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-muted-foreground'>Còn lại:</span>
                        <Badge
                          variant={
                            classItem.available_slots === 0
                              ? 'destructive'
                              : classItem.available_slots <= 2
                              ? 'secondary'
                              : 'outline'
                          }
                          className='text-xs'
                        >
                          {classItem.available_slots}/{classItem.max_students}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-sm text-muted-foreground text-center py-8 border rounded-lg bg-gray-50'>
                  Không có lớp học
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
