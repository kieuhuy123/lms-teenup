import type { ReactNode } from 'react'
import { Header } from './Header'

interface LayoutProps {
  children: ReactNode
}

export function Layout ({ children }: LayoutProps) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <main className='container mx-auto px-4 py-6 sm:py-8 max-w-7xl'>
        {children}
      </main>
    </div>
  )
}
