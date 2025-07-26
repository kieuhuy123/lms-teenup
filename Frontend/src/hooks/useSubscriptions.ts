import { useState, useEffect, useCallback } from 'react'
import type {
  Subscription,
  SubscriptionPackage,
  CreateSubscriptionData,
  CreatePackageData
} from '../types'
import { subscriptionService } from '../services'
import { useApi } from './useApi'

export function useSubscriptions () {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [packages, setPackages] = useState<SubscriptionPackage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // API hooks
  const createSubscriptionApi = useApi(subscriptionService.createSubscription)
  const createPackageApi = useApi(subscriptionService.createPackage)
  const useSessionApi = useApi(subscriptionService.useSession)

  // Fetch all subscriptions
  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await subscriptionService.getAllSubscriptions()
      setSubscriptions(data)
    } catch (err: unknown) {
      const error = err as Error
      setError(error.message || 'Không thể tải danh sách subscription')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch all packages
  const fetchPackages = useCallback(async () => {
    try {
      const data = await subscriptionService.getAllPackages()
      setPackages(data)
    } catch (err: unknown) {
      const error = err as Error
      console.error('Không thể tải packages:', error.message)
    }
  }, [])

  // Get active packages
  const getActivePackages = useCallback(async () => {
    try {
      const data = await subscriptionService.getActivePackages()
      return data
    } catch (err: unknown) {
      const error = err as Error
      throw new Error(error.message || 'Không thể tải gói đang hoạt động')
    }
  }, [])

  // Get subscriptions by student
  const getSubscriptionsByStudent = useCallback(async (studentId: string) => {
    try {
      const data = await subscriptionService.getByStudentId(studentId)
      return data
    } catch (err: unknown) {
      const error = err as Error
      throw new Error(
        error.message || 'Không thể tải subscription của học sinh'
      )
    }
  }, [])

  // Get active subscription for student
  const getActiveSubscription = useCallback(async (studentId: string) => {
    try {
      const data = await subscriptionService.getActiveSubscription(studentId)
      return data
    } catch (err) {
      console.error('Failed to create Package:', err)
      throw err
    }
  }, [])

  // Create package
  const createPackage = useCallback(
    async (data: CreatePackageData) => {
      try {
        const newPackage = await createPackageApi.execute(data)
        if (newPackage) {
          setPackages(prev => [newPackage, ...prev])
          return newPackage
        }
      } catch (error) {
        console.error('Failed to create Package:', error)
        throw error
      }
    },
    [createPackageApi]
  )

  // Create subscription
  const createSubscription = useCallback(
    async (data: CreateSubscriptionData) => {
      try {
        const newSubscription = await createSubscriptionApi.execute(data)
        if (newSubscription) {
          setSubscriptions(prev => [newSubscription, ...prev])
          return newSubscription
        }
      } catch (error) {
        console.error('Failed to create Subscription:', error)
        throw error
      }
    },
    [createSubscriptionApi]
  )

  // Use session
  const useSession = useCallback(
    async (subscriptionId: string) => {
      try {
        const updatedSubscription = await useSessionApi.execute(subscriptionId)
        if (updatedSubscription) {
          setSubscriptions(prev =>
            prev.map(sub =>
              sub._id === subscriptionId ? updatedSubscription : sub
            )
          )
          return updatedSubscription
        }
      } catch (error) {
        console.error('Failed to useSession', error)
        throw error
      }
    },
    [useSessionApi]
  )

  // Load data on mount
  useEffect(() => {
    fetchSubscriptions()
    fetchPackages()
  }, [fetchSubscriptions, fetchPackages])

  return {
    subscriptions,
    packages,
    loading:
      loading ||
      createSubscriptionApi.loading ||
      createPackageApi.loading ||
      useSessionApi.loading,
    error:
      error ||
      createSubscriptionApi.error ||
      createPackageApi.error ||
      useSessionApi.error,
    fetchSubscriptions,
    fetchPackages,
    getActivePackages,
    getSubscriptionsByStudent,
    getActiveSubscription,
    createPackage,
    createSubscription,
    useSession,
    refetch: () => {
      fetchSubscriptions()
      fetchPackages()
    }
  }
}
