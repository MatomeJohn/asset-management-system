// Frontend Type Definitions

export interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
  status?: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt?: string
}

export interface Asset {
  id: string
  name: string
  category: string
  serialNumber: string
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'RETIRED'
  location: string
  assignedToId?: string
  assignedTo?: User
  purchaseDate: string
  purchasePrice: number
  createdAt: string
  updatedAt: string
  deviceName?: string
  assetTag?: string
  userAssigned?: string | null
}

export interface AssetFilters {
  search?: string
  category?: string
  status?: string
  location?: string
}

export interface AssetResponse {
  assets: Asset[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface MaintenanceRecord {
  id: string
  assetId: string
  asset?: Asset
  type: string
  date: string | Date
  description?: string
  cost: number
  performedBy?: string
  createdAt: string
  updatedAt: string
}

export interface MaintenanceInput {
  type: string
  date: string
  description?: string
  cost?: number
  performedBy?: string
}

export interface ApiResponse<T> {
  status: 'success' | 'error'
  data?: T
  message: string
  timestamp?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface DashboardStats {
  totalAssets: number
  activeAssets: number
  maintenanceAssets: number
  retiredAssets: number
  assignedAssets: number
  unassignedAssets: number
  recentMaintenanceCost: number
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}
