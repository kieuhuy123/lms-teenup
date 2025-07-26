import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
  className?: string
}

export function PageHeader ({
  title,
  description,
  children,
  className
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6',
        className
      )}
    >
      <div className='flex-1 min-w-0'>
        <h1 className='text-2xl sm:text-3xl font-bold tracking-tight truncate'>
          {title}
        </h1>
        {description && (
          <p className='text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base line-clamp-2'>
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0'>
          {children}
        </div>
      )}
    </div>
  )
}
