import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Users, GraduationCap, Calendar, Package } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Loading } from '@/components/Loading'
import { ErrorMessage } from '@/components/ErrorMessage'
import { useParents, useStudents, useClasses, useSubscriptions } from '@/hooks'

interface StatsCardProps {
  title: string
  value: number
  icon: React.ElementType
  description: string
  loading?: boolean
}

function StatsCard ({
  title,
  value,
  icon: Icon,
  description,
  loading = false
}: StatsCardProps) {
  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3'>
        <CardTitle className='text-sm font-medium truncate pr-2'>
          {title}
        </CardTitle>
        <Icon className='h-4 w-4 text-muted-foreground flex-shrink-0' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold mb-1'>
          {loading ? <Loading size='sm' text='' /> : value.toLocaleString()}
        </div>
        <p className='text-xs text-muted-foreground line-clamp-2'>
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

export function Dashboard () {
  const { parents, loading: parentsLoading, error: parentsError } = useParents()
  const {
    students,
    loading: studentsLoading,
    error: studentsError
  } = useStudents()
  const { classes, loading: classesLoading, error: classesError } = useClasses()
  const {
    subscriptions,
    loading: subscriptionsLoading,
    error: subscriptionsError
  } = useSubscriptions()

  const [recentActivities] = useState([
    {
      id: 1,
      action: 'Phụ huynh mới được thêm',
      time: '2 giờ trước',
      type: 'parent'
    },
    {
      id: 2,
      action: 'Học sinh đăng ký lớp học',
      time: '3 giờ trước',
      type: 'registration'
    },
    {
      id: 3,
      action: 'Gói học mới được tạo',
      time: '5 giờ trước',
      type: 'subscription'
    },
    {
      id: 4,
      action: 'Lớp học được cập nhật',
      time: '1 ngày trước',
      type: 'class'
    }
  ])

  const isLoading =
    parentsLoading || studentsLoading || classesLoading || subscriptionsLoading
  const hasError =
    parentsError || studentsError || classesError || subscriptionsError

  // Tính toán stats
  const activeSubscriptions = subscriptions.filter(
    sub => sub.status === 'active'
  ).length
  const totalClasses = classes.length
  const availableSlots = classes.reduce(
    (total, cls) => total + (cls.available_slots || 0),
    0
  )

  if (hasError) {
    return (
      <div className='space-y-6'>
        <PageHeader
          title='Dashboard'
          description='Tổng quan hệ thống quản lý học tập'
        />
        <ErrorMessage error={hasError} />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Dashboard'
        description='Tổng quan hệ thống quản lý học tập'
        className='px-0'
      />

      {/* Stats Cards - Responsive Grid */}
      <div className='grid gap-4 grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Tổng phụ huynh'
          value={parents.length}
          icon={Users}
          description='Số lượng phụ huynh trong hệ thống'
          loading={parentsLoading}
        />
        <StatsCard
          title='Tổng học sinh'
          value={students.length}
          icon={GraduationCap}
          description='Số lượng học sinh đã đăng ký'
          loading={studentsLoading}
        />
        <StatsCard
          title='Lớp học'
          value={totalClasses}
          icon={Calendar}
          description={`${availableSlots} chỗ trống còn lại`}
          loading={classesLoading}
        />
        <StatsCard
          title='Gói học hoạt động'
          value={activeSubscriptions}
          icon={Package}
          description='Số gói học đang được sử dụng'
          loading={subscriptionsLoading}
        />
      </div>

      {/* Content Cards - Responsive Layout */}
      <div className='grid gap-6 md:grid-cols-2'>
        {/* Quick Stats */}
        <Card className='hover:shadow-md transition-shadow'>
          <CardHeader>
            <CardTitle className='text-lg'>Thống kê nhanh</CardTitle>
            <CardDescription>
              Các chỉ số quan trọng trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loading text='Đang tải thống kê...' className='py-4' />
            ) : (
              <div className='space-y-4'>
                <div className='flex justify-between items-center py-2 border-b'>
                  <span className='text-sm text-muted-foreground'>
                    Tỷ lệ lớp đầy:
                  </span>
                  <span className='font-medium text-sm'>
                    {totalClasses > 0
                      ? `${Math.round(
                          ((totalClasses * 10 - availableSlots) /
                            (totalClasses * 10)) *
                            100
                        )}%`
                      : '0%'}
                  </span>
                </div>
                <div className='flex justify-between items-center py-2 border-b'>
                  <span className='text-sm text-muted-foreground'>
                    Học sinh/phụ huynh:
                  </span>
                  <span className='font-medium text-sm'>
                    {parents.length > 0
                      ? (students.length / parents.length).toFixed(1)
                      : '0'}
                  </span>
                </div>
                <div className='flex justify-between items-center py-2'>
                  <span className='text-sm text-muted-foreground'>
                    Gói học hết hạn:
                  </span>
                  <span className='font-medium text-sm'>
                    {
                      subscriptions.filter(sub => sub.status === 'expired')
                        .length
                    }
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className='hover:shadow-md transition-shadow'>
          <CardHeader>
            <CardTitle className='text-lg'>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Các thay đổi mới nhất trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {recentActivities.map(activity => (
                <div
                  key={activity.id}
                  className='flex items-start justify-between py-3 border-b last:border-0 gap-3'
                >
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate'>
                      {activity.action}
                    </p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      {activity.time}
                    </p>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                      activity.type === 'parent'
                        ? 'bg-blue-500'
                        : activity.type === 'registration'
                        ? 'bg-green-500'
                        : activity.type === 'subscription'
                        ? 'bg-purple-500'
                        : 'bg-orange-500'
                    }`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
