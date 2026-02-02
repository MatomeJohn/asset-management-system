// Frontend Custom Hooks

import { useNavigate } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { useAuthStore, useAssetStore, useMaintenanceStore } from '../store'
import { authAPI, assetAPI, maintenanceAPI } from '../services/api'
import { User, Asset, MaintenanceRecord } from '../types'

// useAuth Hook
export const useAuth = () => {
  const navigate = useNavigate()
  const { setUser, setToken, setLoading, setError } = useAuthStore()

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true)
        const result = await authAPI.login(email, password)
        console.log('Login response:', result)
        console.log('User data from response:', result.user)
        console.log('User name:', result.user?.name)
        console.log('User full object:', JSON.stringify(result.user))
        setUser(result.user as User)
        setToken(result.token as string)
        setError(null)
      } catch (error: any) {
        setError(error.message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setUser, setToken, setLoading, setError]
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        setLoading(true)
        const result = await authAPI.register(name, email, password)
        console.log('Register response:', result)
        console.log('Register user data:', result.user)
        console.log('Register user name:', result.user?.name)
        setUser(result.user as User)
        setToken(result.token as string)
        setError(null)
      } catch (error: any) {
        setError(error.message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setUser, setToken, setLoading, setError]
  )

  const logout = useCallback(() => {
    const { logout: storeLogout } = useAuthStore.getState()
    storeLogout()
    navigate('/login')
  }, [navigate])

  return { login, register, logout }
}

// useAssets Hook
export const useAssets = () => {
  const {
    assets,
    setAssets,
    addAsset,
    updateAsset,
    removeAsset,
    setPagination,
  } = useAssetStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAssets = useCallback(
    async (page = 1, limit = 10, filters?: any) => {
      try {
        setLoading(true)
        const result = await assetAPI.getAssets(page, limit, filters)
        console.log('fetchAssets result:', result)
        const assetsData = (result.assets || result.data) as Asset[]
        console.log('Setting assets:', assetsData)
        setAssets(assetsData)
        if (result.pagination) {
          setPagination(result.pagination)
        }
      } catch (err: any) {
        console.error('Error fetching assets:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [setAssets, setPagination]
  )

  const fetchAssetById = useCallback(async (id: string) => {
    try {
      setLoading(true)
      return await assetAPI.getAssetById(id)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createAsset = useCallback(
    async (data: any) => {
      try {
        setLoading(true)
        const result = await assetAPI.createAsset(data)
        addAsset(result as Asset)
        return result
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [addAsset]
  )

  const editAsset = useCallback(
    async (id: string, data: any) => {
      try {
        setLoading(true)
        const result = await assetAPI.updateAsset(id, data)
        updateAsset(result as Asset)
        return result
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [updateAsset]
  )

  const deleteAsset = useCallback(
    async (id: string) => {
      try {
        setLoading(true)
        await assetAPI.deleteAsset(id)
        removeAsset(id)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [removeAsset]
  )

  return {
    assets,
    loading,
    error,
    fetchAssets,
    fetchAssetById,
    createAsset,
    editAsset,
    deleteAsset,
  }
}

// useMaintenance Hook
export const useMaintenance = () => {
  const { records, setRecords } = useMaintenanceStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMaintenanceRecords = useCallback(async (assetId: string) => {
    try {
      setLoading(true)
      const result = await maintenanceAPI.getMaintenanceByAsset(assetId)
      setRecords((result || []) as MaintenanceRecord[])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [setRecords])

  const addMaintenanceRecord = useCallback(
    async (assetId: string, data: any) => {
      try {
        setLoading(true)
        const result = await maintenanceAPI.addMaintenance(assetId, data)
        // Fetch updated maintenance records to ensure UI is synchronized
        const updatedRecords = await maintenanceAPI.getMaintenanceByAsset(assetId)
        setRecords((updatedRecords || []) as MaintenanceRecord[])
        return result
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [setRecords]
  )

  const editMaintenanceRecord = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true)
      return await maintenanceAPI.updateMaintenance(id, data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteMaintenanceRecord = useCallback(async (id: string) => {
    try {
      setLoading(true)
      await maintenanceAPI.deleteMaintenance(id)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    records,
    loading,
    error,
    fetchMaintenanceRecords,
    addMaintenanceRecord,
    editMaintenanceRecord,
    deleteMaintenanceRecord,
  }
}

// useAsync Hook (generic)
export const useAsync = <T,>(asyncFunction: () => Promise<T>) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    try {
      setStatus('pending')
      const result = await asyncFunction()
      setData(result)
      setStatus('success')
      return result
    } catch (err: any) {
      setError(err.message)
      setStatus('error')
    }
  }, [asyncFunction])

  const reset = useCallback(() => {
    setStatus('idle')
    setData(null)
    setError(null)
  }, [])

  return { execute, reset, status, data, error }
}

// useFormValidation Hook
export const useFormValidation = <T,>(
  initialValues: T,
  validators: Record<keyof T, (value: any) => string>,
  onSubmit: (values: T) => Promise<void>
) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (touched[name] && validators[name as keyof T]) {
      const error = validators[name as keyof T](value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e: any) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    if (validators[name as keyof T]) {
      const error = validators[name as keyof T](values[name as keyof T])
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    
    Object.keys(validators).forEach((key) => {
      const error = validators[key as keyof T](values[key as keyof T])
      if (error) {
        newErrors[key] = error
      }
    })

    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      try {
        setIsSubmitting(true)
        await onSubmit(values)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  }
}
