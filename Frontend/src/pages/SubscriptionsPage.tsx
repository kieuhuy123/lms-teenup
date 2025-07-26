import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/PageHeader'
import { Loading } from '@/components/Loading'
import { ErrorMessage } from '@/components/ErrorMessage'
import { useSubscriptions, useStudents } from '@/hooks'
import { formatDate } from '@/utils/date'
import { Plus, Play, Package, Calendar } from 'lucide-react'

export function SubscriptionsPage () {
  const { subscriptions, packages, loading, error, useSession } =
    useSubscriptions()
  const { students } = useStudents()

  const getStudentName = (studentId: string | any) => {
    if (typeof studentId === 'object' && studentId?.name) {
      return studentId.name
    }
    const student = students.find(s => s._id === studentId)
    return student?.name || 'N/A'
  }

  const getPackageName = (packageId: string | any) => {
    if (typeof packageId === 'object' && packageId?.name) {
      return packageId.name
    }
    const pkg = packages.find(p => p._id === packageId)
    return pkg?.name || 'N/A'
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      active: { label: 'Đang hoạt động', variant: 'default' as const },
      expired: { label: 'Hết hạn', variant: 'secondary' as const },
      cancelled: { label: 'Đã hủy', variant: 'destructive' as const }
    }
    return (
      labels[status as keyof typeof labels] || {
        label: status,
        variant: 'outline' as const
      }
    )
  }

  const handleUseSession = async (subscriptionId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn sử dụng 1 buổi học?')) {
      try {
        await useSession(subscriptionId)
      } catch (error) {
        console.error('Lỗi khi sử dụng buổi học:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Quản lý gói học' />
        <Card>
          <CardContent className='p-8'>
            <Loading text='Đang tải danh sách gói học...' />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Quản lý gói học' />
        <ErrorMessage error={error} />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Quản lý gói học'
        description='Theo dõi và quản lý các gói học của học sinh'
      />

      {/* Package Stats - Responsive Grid */}
      <div className='grid gap-4 grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium flex items-center gap-2'>
              <Package className='h-4 w-4' />
              <span className='hidden sm:inline'>Tổng gói học</span>
              <span className='sm:hidden'>Tổng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold'>
              {subscriptions.length}
            </div>
            <p className='text-xs text-muted-foreground'>Tất cả gói đã tạo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium flex items-center gap-2'>
              <Play className='h-4 w-4' />
              <span className='hidden sm:inline'>Đang hoạt động</span>
              <span className='sm:hidden'>Hoạt động</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold'>
              {subscriptions.filter(sub => sub.status === 'active').length}
            </div>
            <p className='text-xs text-muted-foreground'>
              Gói đang được sử dụng
            </p>
          </CardContent>
        </Card>
        <Card className='col-span-2 lg:col-span-1'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium flex items-center gap-2'>
              <Calendar className='h-4 w-4' />
              <span className='hidden sm:inline'>Tổng buổi học</span>
              <span className='sm:hidden'>Buổi học</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-xl sm:text-2xl font-bold'>
              {subscriptions.reduce(
                (total, sub) => total + sub.total_sessions,
                0
              )}
            </div>
            <p className='text-xs text-muted-foreground'>
              Đã sử dụng:{' '}
              {subscriptions.reduce(
                (total, sub) => total + sub.used_sessions,
                0
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
          <div>
            <CardTitle className='text-lg sm:text-xl'>
              Danh sách gói học
            </CardTitle>
            <CardDescription className='text-sm'>
              Theo dõi tiến độ sử dụng gói học của từng học sinh
            </CardDescription>
          </div>
          <Button className='w-full sm:w-auto'>
            <Plus className='h-4 w-4 mr-2' />
            Tạo gói học
          </Button>
        </CardHeader>
        <CardContent className='p-0 sm:p-6'>
          {/* Mobile Cards View */}
          <div className='block md:hidden space-y-3 p-4'>
            {subscriptions.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                Chưa có gói học nào
              </div>
            ) : (
              subscriptions.map(subscription => {
                const statusInfo = getStatusLabel(subscription.status)
                const remainingSessions =
                  subscription.total_sessions - subscription.used_sessions

                return (
                  <Card key={subscription._id} className='p-4'>
                    <div className='flex justify-between items-start mb-3'>
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-medium text-sm truncate'>
                          {getStudentName(subscription.student_id)}
                        </h3>
                        <p className='text-xs text-muted-foreground truncate'>
                          {getPackageName(subscription.package_id)}
                        </p>
                      </div>
                      <Badge variant={statusInfo.variant} className='text-xs'>
                        {statusInfo.label}
                      </Badge>
                    </div>

                    <div className='space-y-2 text-sm'>
                      <div className='flex justify-between items-center'>
                        <span className='text-muted-foreground'>Buổi học:</span>
                        <div className='flex items-center gap-2'>
                          <span>
                            {subscription.used_sessions}/
                            {subscription.total_sessions}
                          </span>
                          <Badge
                            variant={
                              remainingSessions > 0 ? 'outline' : 'secondary'
                            }
                            className='text-xs'
                          >
                            Còn {remainingSessions}
                          </Badge>
                        </div>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-muted-foreground'>Thời hạn:</span>
                        <div className='text-right'>
                          <div className='text-xs'>
                            {formatDate(subscription.start_date)}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            đến {formatDate(subscription.end_date)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {subscription.status === 'active' && remainingSessions > 0 && (
                      <div className='mt-3 pt-3 border-t'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleUseSession(subscription._id)}
                          className='w-full'
                        >
                          <Play className='h-3 w-3 mr-1' />
                          Sử dụng buổi học
                        </Button>
                      </div>
                    )}
                  </Card>
                )
              })
            )}
          </div>

          {/* Desktop Table View */}
          <div className='hidden md:block'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Học sinh</TableHead>
                  <TableHead className='hidden lg:table-cell'>
                    Gói học
                  </TableHead>
                  <TableHead>Buổi học</TableHead>
                  <TableHead className='hidden xl:table-cell'>
                    Thời hạn
                  </TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className='w-[100px]'>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className='text-center py-8 text-muted-foreground'
                    >
                      Chưa có gói học nào
                    </TableCell>
                  </TableRow>
                ) : (
                  subscriptions.map(subscription => {
                    const statusInfo = getStatusLabel(subscription.status)
                    const remainingSessions =
                      subscription.total_sessions - subscription.used_sessions

                    return (
                      <TableRow key={subscription._id}>
                        <TableCell className='font-medium'>
                          {getStudentName(subscription.student_id)}
                        </TableCell>
                        <TableCell className='hidden lg:table-cell max-w-[150px] truncate'>
                          {getPackageName(subscription.package_id)}
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <span className='text-sm'>
                              {subscription.used_sessions}/
                              {subscription.total_sessions}
                            </span>
                            <Badge
                              variant={
                                remainingSessions > 0 ? 'outline' : 'secondary'
                              }
                              className='text-xs'
                            >
                              Còn {remainingSessions}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className='hidden xl:table-cell'>
                          <div className='text-sm'>
                            <div>{formatDate(subscription.start_date)}</div>
                            <div className='text-muted-foreground text-xs'>
                              đến {formatDate(subscription.end_date)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={statusInfo.variant}
                            className='text-xs'
                          >
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {subscription.status === 'active' &&
                            remainingSessions > 0 && (
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={() =>
                                  handleUseSession(subscription._id)
                                }
                              >
                                <Play className='h-3 w-3 mr-1' />
                                <span className='hidden lg:inline'>Dùng</span>
                              </Button>
                            )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
