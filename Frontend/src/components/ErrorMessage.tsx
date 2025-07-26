import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ErrorMessageProps {
  error: string
  className?: string
}

export function ErrorMessage ({ error, className }: ErrorMessageProps) {
  return (
    <Alert variant='destructive' className={className}>
      <AlertCircle className='h-4 w-4' />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}
