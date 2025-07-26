import { useState } from 'react'
import { MoreHorizontal, Plus, Edit, Trash2, Phone, Mail } from 'lucide-react'
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
import type { Parent } from '@/types'
import { formatDate } from '@/utils/date'
import { Loading } from '@/components/Loading'
import { ErrorMessage } from '@/components/ErrorMessage'
import { ParentForm } from './ParentForm'

interface ParentListProps {
  parents: Parent[]
  loading: boolean
  error: string | null
  onCreateParent: (data: any) => Promise<void>
  onUpdateParent: (id: string, data: any) => Promise<void>
  onDeleteParent: (id: string) => Promise<void>
}

export function ParentList ({
  parents,
  loading,
  error,
  onCreateParent,
  onUpdateParent,
  onDeleteParent
}: ParentListProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingParent, setEditingParent] = useState<Parent | null>(null)

  const handleEdit = (parent: Parent) => {
    setEditingParent(parent)
    setShowForm(true)
  }

  const handleSubmit = async (data: any) => {
    if (editingParent) {
      await onUpdateParent(editingParent._id, data)
    } else {
      await onCreateParent(data)
    }
    setEditingParent(null)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingParent(null)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className='p-8'>
          <Loading text='Đang tải danh sách phụ huynh...' />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
          <div>
            <CardTitle className='text-lg sm:text-xl'>
              Danh sách phụ huynh
            </CardTitle>
            <CardDescription className='text-sm'>
              Quản lý thông tin phụ huynh trong hệ thống
            </CardDescription>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className='w-full sm:w-auto'
          >
            <Plus className='h-4 w-4 mr-2' />
            Thêm phụ huynh
          </Button>
        </CardHeader>
        <CardContent className='p-0 sm:p-6'>
          {/* Mobile Cards View */}
          <div className='block sm:hidden space-y-3 p-4'>
            {parents.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                Chưa có phụ huynh nào
              </div>
            ) : (
              parents.map(parent => (
                <Card key={parent._id} className='p-4'>
                  <div className='flex justify-between items-start mb-3'>
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-medium truncate'>{parent.name}</h3>
                      <p className='text-sm text-muted-foreground'>
                        {formatDate(parent.createdAt)}
                      </p>
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
                        <DropdownMenuItem onClick={() => handleEdit(parent)}>
                          <Edit className='h-4 w-4 mr-2' />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteParent(parent._id)}
                          className='text-red-600'
                        >
                          <Trash2 className='h-4 w-4 mr-2' />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-sm'>
                      <Phone className='h-4 w-4 text-muted-foreground' />
                      <span>{parent.phone}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <Mail className='h-4 w-4 text-muted-foreground' />
                      <span className='truncate'>{parent.email}</span>
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
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead className='hidden md:table-cell'>Email</TableHead>
                  <TableHead className='hidden lg:table-cell'>
                    Ngày tạo
                  </TableHead>
                  <TableHead className='w-[50px]'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='text-center py-8 text-muted-foreground'
                    >
                      Chưa có phụ huynh nào
                    </TableCell>
                  </TableRow>
                ) : (
                  parents.map(parent => (
                    <TableRow key={parent._id}>
                      <TableCell className='font-medium'>
                        {parent.name}
                      </TableCell>
                      <TableCell>{parent.phone}</TableCell>
                      <TableCell className='hidden md:table-cell max-w-[200px] truncate'>
                        {parent.email}
                      </TableCell>
                      <TableCell className='hidden lg:table-cell'>
                        {formatDate(parent.createdAt)}
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
                              onClick={() => handleEdit(parent)}
                            >
                              <Edit className='h-4 w-4 mr-2' />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDeleteParent(parent._id)}
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

      <ParentForm
        open={showForm}
        onOpenChange={handleCloseForm}
        onSubmit={handleSubmit}
        parent={editingParent || undefined}
        title={editingParent ? 'Chỉnh sửa phụ huynh' : 'Thêm phụ huynh mới'}
      />
    </div>
  )
}
