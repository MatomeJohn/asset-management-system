// Frontend API Service Layer

/// <reference types="vite/client" />
import { Asset, AssetFilters, MaintenanceRecord, MaintenanceInput, DashboardStats, User } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function apiRequest<T>(
  method: string,
  endpoint: string,
  data?: any
): Promise<T> {
  const token = localStorage.getItem('token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config: RequestInit = {
    method,
    headers,
  }

  if (data) {
    config.body = JSON.stringify(data)
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)
  const result = await response.json()

  console.log(`API Response for ${method} ${endpoint}:`, result)

  if (!response.ok) {
    throw new Error(result.message || 'API request failed')
  }

  return result
}

// Authentication APIs
export const authAPI = {
  register: (name: string, email: string, password: string): Promise<{ user: User; token: string }> =>
    apiRequest('POST', '/auth/register', { name, email, password }),

  login: (email: string, password: string): Promise<{ user: User; token: string }> =>
    apiRequest('POST', '/auth/login', { email, password }),
}

// Asset APIs
export const assetAPI = {
  getAssets: (page = 1, limit = 10, filters?: AssetFilters): Promise<{ data?: Asset[]; assets?: Asset[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.category && { category: filters.category }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.location && { location: filters.location }),
    })
    return apiRequest('GET', `/assets?${params}`)
  },

  getAssetById: (id: string): Promise<Asset> => apiRequest('GET', `/assets/${id}`),

  createAsset: (data: any): Promise<Asset> => apiRequest('POST', '/assets', data),

  updateAsset: (id: string, data: any): Promise<Asset> => apiRequest('PUT', `/assets/${id}`, data),

  deleteAsset: (id: string): Promise<void> => apiRequest('DELETE', `/assets/${id}`),
}

// User APIs
export const userAPI = {
  getUsers: (): Promise<{ users: User[] }> => apiRequest('GET', '/users'),

  getUserById: (id: string): Promise<User> => apiRequest('GET', `/users/${id}`),

  updateUserRole: (id: string, role: string): Promise<User> =>
    apiRequest('PUT', `/users/${id}/role`, { role }),
}

// Maintenance APIs
export const maintenanceAPI = {
  getMaintenanceByAsset: (assetId: string): Promise<MaintenanceRecord[]> =>
    apiRequest('GET', `/maintenance/asset/${assetId}`),

  addMaintenance: (assetId: string, data: MaintenanceInput): Promise<MaintenanceRecord> =>
    apiRequest('POST', `/maintenance/${assetId}`, data),

  updateMaintenance: (id: string, data: any): Promise<MaintenanceRecord> =>
    apiRequest('PUT', `/maintenance/${id}`, data),

  deleteMaintenance: (id: string): Promise<void> => apiRequest('DELETE', `/maintenance/${id}`),
}

// Dashboard APIs
export const dashboardAPI = {
  getStats: (): Promise<DashboardStats> => apiRequest('GET', '/dashboard/stats'),
}

// Health Check
export const healthAPI = {
  check: (): Promise<{ status: string }> => apiRequest('GET', '/health'),
}
