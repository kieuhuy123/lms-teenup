import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { studentSchema } from '@/utils/validation'
import type { CreateStudentData, Student, Parent } from '@/types'
import { useFormState } from '@/hooks'

interface StudentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateStudentData) => Promise<void>
  parents: Parent[]
  student?: Student
  title?: string
}

export function StudentForm ({
  open,
  onOpenChange,
  onSubmit,
  parents,
  student,
  title = 'Thêm học sinh mới'
}: StudentFormProps) {
  const { execute, isLoading, error } = useFormState({
    onSuccess: () => {
      onOpenChange(false)
      form.reset()
    }
  })

  const form = useForm<CreateStudentData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: student?.name || '',
      dob: student?.dob ? student.dob.split('T')[0] : '',
      gender: student?.gender || 'male',
      current_grade: student?.current_grade || '',
      parent_id: typeof student?.parent_id === 'string' ? student.parent_id : ''
    }
  })

  const handleSubmit = async (data: CreateStudentData) => {
    await execute(() => onSubmit(data))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-lg'>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Họ và tên *</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập họ và tên' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='dob'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm'>Ngày sinh *</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm'>Giới tính *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn giới tính' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='male'>Nam</SelectItem>
                        <SelectItem value='female'>Nữ</SelectItem>
                        <SelectItem value='other'>Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='current_grade'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Lớp học hiện tại *</FormLabel>
                  <FormControl>
                    <Input placeholder='VD: Lớp 8' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='parent_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Phụ huynh *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn phụ huynh' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {parents.map(parent => (
                        <SelectItem key={parent._id} value={parent._id}>
                          <div className='flex flex-col'>
                            <span>{parent.name}</span>
                            <span className='text-xs text-muted-foreground'>
                              {parent.phone}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className='text-sm text-red-600 bg-red-50 p-3 rounded-md'>
                {error}
              </div>
            )}

            <div className='flex flex-col sm:flex-row gap-2 pt-4'>
              <Button
                type='submit'
                disabled={isLoading}
                className='w-full sm:w-auto'
              >
                {isLoading ? 'Đang xử lý...' : 'Lưu'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                className='w-full sm:w-auto'
              >
                Hủy
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
