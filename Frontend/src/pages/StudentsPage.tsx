import { useState } from 'react'
import {
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/PageHeader'
import { Loading } from '@/components/Loading'
import { ErrorMessage } from '@/components/ErrorMessage'
import { StudentForm } from '@/features/students/StudentForm'
import { useStudents, useParents } from '@/hooks'
import { formatDate } from '@/utils/date'
import type { Student } from '@/types'

export function StudentsPage () {
  const {
    students,
    loading,
    error,
    createStudent,
    updateStudent,
    deleteStudent
  } = useStudents()
  const { parents } = useParents()
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setShowForm(true)
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingStudent) {
        await updateStudent(editingStudent._id, data)
      } else {
        await createStudent(data)
      }
      setEditingStudent(null)
    } catch (error) {
      console.error('Lỗi khi lưu học sinh:', error)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingStudent(null)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
      try {
        await deleteStudent(id)
      } catch (error) {
        console.error('Lỗi khi xóa học sinh:', error)
      }
    }
  }

  const getGenderLabel = (gender: string) => {
    const labels = { male: 'Nam', female: 'Nữ', other: 'Khác' }
    return labels[gender as keyof typeof labels] || gender
  }

  const getParentName = (parentId: string | any) => {
    if (typeof parentId === 'object' && parentId?.name) {
      return parentId.name
    }
    const parent = parents.find(p => p._id === parentId)
    return parent?.name || 'N/A'
  }

  if (loading) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Quản lý học sinh' />
        <Card>
          <CardContent className='p-8'>
            <Loading text='Đang tải danh sách học sinh...' />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Quản lý học sinh' />
        <ErrorMessage error={error} />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Quản lý học sinh'
        description='Thêm, sửa, xóa thông tin học sinh trong hệ thống'
      />

      <Card>
        <CardHeader className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
          <div>
            <CardTitle className='text-lg sm:text-xl'>
              Danh sách học sinh
            </CardTitle>
            <CardDescription className='text-sm'>
              Quản lý thông tin học sinh và phụ huynh
            </CardDescription>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className='w-full sm:w-auto'
          >
            <Plus className='h-4 w-4 mr-2' />
            Thêm học sinh
          </Button>
        </CardHeader>
        <CardContent className='p-0 sm:p-6'>
          {/* Mobile Cards View */}
          <div className='block sm:hidden space-y-3 p-4'>
            {students.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                Chưa có học sinh nào
              </div>
            ) : (
              students.map(student => (
                <Card key={student._id} className='p-4'>
                  <div className='flex justify-between items-start mb-3'>
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-medium truncate'>{student.name}</h3>
                      <div className='flex items-center gap-2 mt-1'>
                        <Badge variant='outline' className='text-xs'>
                          {getGenderLabel(student.gender)}
                        </Badge>
                        <span className='text-xs text-muted-foreground'>
                          {student.current_grade}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => handleEdit(student)}>
                          <Edit className='h-4 w-4 mr-2' />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(student._id)}
                          className='text-red-600'
                        >
                          <Trash2 className='h-4 w-4 mr-2' />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className='space-y-2 text-sm'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4 text-muted-foreground' />
                      <span>{formatDate(student.dob)}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Users className='h-4 w-4 text-muted-foreground' />
                      <span className='truncate'>
                        {getParentName(student.parent_id)}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className='hidden sm:block'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead className='hidden md:table-cell'>
                    Ngày sinh
                  </TableHead>
                  <TableHead>Giới tính</TableHead>
                  <TableHead>Lớp</TableHead>
                  <TableHead className='hidden lg:table-cell'>
                    Phụ huynh
                  </TableHead>
                  <TableHead className='w-[50px]'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className='text-center py-8 text-muted-foreground'
                    >
                      Chưa có học sinh nào
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map(student => (
                    <TableRow key={student._id}>
                      <TableCell className='font-medium'>
                        {student.name}
                      </TableCell>
                      <TableCell className='hidden md:table-cell'>
                        {formatDate(student.dob)}
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline' className='text-xs'>
                          {getGenderLabel(student.gender)}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.current_grade}</TableCell>
                      <TableCell className='hidden lg:table-cell max-w-[150px] truncate'>
                        {getParentName(student.parent_id)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              onClick={() => handleEdit(student)}
                            >
                              <Edit className='h-4 w-4 mr-2' />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(student._id)}
                              className='text-red-600'
                            >
                              <Trash2 className='h-4 w-4 mr-2' />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <StudentForm
        open={showForm}
        onOpenChange={handleCloseForm}
        onSubmit={handleSubmit}
        parents={parents}
        student={editingStudent || undefined}
        title={editingStudent ? 'Chỉnh sửa học sinh' : 'Thêm học sinh mới'}
      />
    </div>
  )
}
