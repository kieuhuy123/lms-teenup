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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { parentSchema } from '@/utils/validation'
import type { CreateParentData, Parent } from '@/types'
import { useFormState } from '@/hooks'

interface ParentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateParentData) => Promise<void>
  parent?: Parent
  title?: string
}

export function ParentForm ({
  open,
  onOpenChange,
  onSubmit,
  parent,
  title = 'Thêm phụ huynh mới'
}: ParentFormProps) {
  const { execute, isLoading, error } = useFormState({
    onSuccess: () => {
      onOpenChange(false)
      form.reset()
    }
  })

  const form = useForm<CreateParentData>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      name: parent?.name || '',
      phone: parent?.phone || '',
      email: parent?.email || ''
    }
  })

  const handleSubmit = async (data: CreateParentData) => {
    await execute(() => onSubmit(data))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[95vw] max-w-md mx-auto'>
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

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Số điện thoại *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nhập số điện thoại'
                      type='tel'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Email *</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='Nhập email' {...field} />
                  </FormControl>
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
