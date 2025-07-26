export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  ENDPOINTS: {
    PARENTS: '/api/v1/parents',
    STUDENTS: '/api/v1/students',
    CLASSES: '/api/v1/classes',
    SUBSCRIPTIONS: '/api/v1/lms-subscriptions',
    PACKAGES: '/api/v1/subscription-packages'
  },
  TIMEOUT: 10000
} as const
