// Frontend Zustand Store

import { create } from 'zustand'
import { User, Asset, MaintenanceRecord, DashboardStats } from '../types'

// Helper function to get user from localStorage
const getUserFromStorage = (): User | null => {
  try {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  } catch (e) {
    console.error('Error reading user from storage:', e)
    return null
  }
}

// Helper function to get token from localStorage
const getTokenFromStorage = (): string | null => {
  try {
    return localStorage.getItem('token')
  } catch (e) {
    console.error('Error reading token from storage:', e)
    return null
  }
}

// Auth Store
interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: getUserFromStorage(),
  token: getTokenFromStorage(),
  isLoading: false,
  error: null,
  setUser: (user) => {
    console.log('setUser called with:', user)
    if (user) {
      // Only store the user object with id, name, email, role
      const userToStore = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
      console.log('Storing user to localStorage:', userToStore)
      localStorage.setItem('user', JSON.stringify(userToStore))
    } else {
      localStorage.removeItem('user')
    }
    set({ user })
  },
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
    set({ token })
  },
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },
}))

// Asset Store
interface AssetStore {
  assets: Asset[]
  currentAsset: Asset | null
  pagination: { page: number; limit: number; total: number }
  addAsset: (asset: Asset) => void
  updateAsset: (asset: Asset) => void
  removeAsset: (id: string) => void
  setAssets: (assets: Asset[]) => void
  setCurrentAsset: (asset: Asset | null) => void
  setPagination: (pagination: any) => void
  clearAssets: () => void
}

export const useAssetStore = create<AssetStore>((set) => ({
  assets: [],
  currentAsset: null,
  pagination: { page: 1, limit: 10, total: 0 },
  addAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),
  updateAsset: (asset) =>
    set((state) => ({
      assets: state.assets.map((a) => (a.id === asset.id ? asset : a)),
    })),
  removeAsset: (id) =>
    set((state) => ({
      assets: state.assets.filter((a) => a.id !== id),
    })),
  setAssets: (assets) => set({ assets }),
  setCurrentAsset: (asset) => set({ currentAsset: asset }),
  setPagination: (pagination) => set({ pagination }),
  clearAssets: () => set({ assets: [] }),
}))

// Maintenance Store
interface MaintenanceStore {
  records: MaintenanceRecord[]
  currentRecord: MaintenanceRecord | null
  addRecord: (record: MaintenanceRecord) => void
  updateRecord: (record: MaintenanceRecord) => void
  removeRecord: (id: string) => void
  setRecords: (records: MaintenanceRecord[]) => void
  setCurrentRecord: (record: MaintenanceRecord | null) => void
}

export const useMaintenanceStore = create<MaintenanceStore>((set) => ({
  records: [],
  currentRecord: null,
  addRecord: (record) =>
    set((state) => ({ records: [...state.records, record] })),
  updateRecord: (record) =>
    set((state) => ({
      records: state.records.map((r) => (r.id === record.id ? record : r)),
    })),
  removeRecord: (id) =>
    set((state) => ({
      records: state.records.filter((r) => r.id !== id),
    })),
  setRecords: (records) => set({ records }),
  setCurrentRecord: (record) => set({ currentRecord: record }),
}))

// Dashboard Store
interface DashboardStore {
  stats: DashboardStats | null
  setStats: (stats: DashboardStats) => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: null,
  setStats: (stats) => set({ stats }),
}))

// User Store
interface UserStore {
  users: User[]
  addUser: (user: User) => void
  updateUser: (user: User) => void
  removeUser: (id: string) => void
  setUsers: (users: User[]) => void
  clearUsers: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (user) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === user.id ? user : u)),
    })),
  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),
  setUsers: (users) => set({ users }),
  clearUsers: () => set({ users: [] }),
}))
