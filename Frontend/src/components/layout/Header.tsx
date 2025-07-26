import { useState } from 'react'
import {
  Book,
  Users,
  GraduationCap,
  Calendar,
  Package,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate, useLocation } from 'react-router-dom'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Book },
  { name: 'Phụ huynh', href: '/parents', icon: Users },
  { name: 'Học sinh', href: '/students', icon: GraduationCap },
  { name: 'Lớp học', href: '/classes', icon: Calendar },
  { name: 'Gói học', href: '/subscriptions', icon: Package }
]

export function Header () {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleNavClick = (href: string) => {
    navigate(href)
    setIsMobileMenuOpen(false) // Close mobile menu after navigation
  }

  return (
    <header className='border-b bg-white sticky top-0 z-50'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center gap-2 flex-shrink-0'>
            <Book className='h-6 w-6 text-primary' />
            <span className='text-xl font-bold hidden sm:block'>LMS Admin</span>
            <span className='text-lg font-bold sm:hidden'>LMS</span>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex items-center gap-1'>
            {navigation.map(item => {
              const Icon = item.icon
              const isActive = location.pathname === item.href

              return (
                <Button
                  key={item.name}
                  variant={isActive ? 'outline' : 'ghost'}
                  size='sm'
                  onClick={() => navigate(item.href)}
                  className='flex items-center gap-2'
                >
                  <Icon className='h-4 w-4' />
                  <span className='hidden xl:inline'>{item.name}</span>
                </Button>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant='ghost'
            size='sm'
            className='lg:hidden'
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className='h-5 w-5' />
            ) : (
              <Menu className='h-5 w-5' />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className='lg:hidden border-t bg-white'>
            <nav className='py-2 space-y-1'>
              {navigation.map(item => {
                const Icon = item.icon
                const isActive = location.pathname === item.href

                return (
                  <Button
                    key={item.name}
                    variant={isActive ? 'outline' : 'ghost'}
                    size='sm'
                    onClick={() => handleNavClick(item.href)}
                    className='w-full justify-start gap-3 px-4 py-3'
                  >
                    <Icon className='h-4 w-4' />
                    {item.name}
                  </Button>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
