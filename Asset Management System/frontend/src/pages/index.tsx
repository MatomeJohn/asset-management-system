// Frontend Page Components

import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdEdit, MdAssignmentInd, MdWavingHand, MdInventory2, MdCheckCircle, MdBuildCircle, MdAttachMoney, MdDelete, MdSecurity, MdManageAccounts, MdRemoveRedEye, MdUnarchive, MdAddCircle, MdPeople, MdAnalytics, MdLaptop, MdVisibility, MdVisibilityOff, MdDone, MdDownload, MdPrint } from 'react-icons/md'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import {
  Button,
  Input,
  Card,
  Alert,
  Spinner,
  Badge,
  Modal,
  Table,
  Select,
  Pagination,
} from "../components/ui"
import { useAuth, useAssets, useMaintenance } from '../hooks'
import { useAuthStore, useAssetStore } from '../store'
import { formatDate, formatCurrency, searchInArray, capitalize } from '../utils'

// ============ LOGIN PAGE ============

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/95 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">📦</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Asset Management</h1>
          <p className="text-gray-600 text-sm">Sign in to your account</p>
        </div>
        
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
          </div>
          <Button type="submit" fullWidth loading={loading} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm mb-4">Don't have an account?</p>
          <Button 
            variant="secondary" 
            fullWidth 
            onClick={() => navigate('/register')}
          >
            Create Account
          </Button>
        </div>
      </Card>
    </div>
  )
}

// ============ REGISTER PAGE ============

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      setLoading(true)
      await register(name, email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/95 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">✨</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Create Account</h1>
          <p className="text-gray-600 text-sm">Join our asset management platform</p>
        </div>
        
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
          </div>
          <Button type="submit" fullWidth loading={loading} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
        
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm mb-3">Already have an account?</p>
          <Button 
            variant="secondary" 
            fullWidth 
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </div>
      </Card>
    </div>
  )
}

// ============ DASHBOARD PAGE ============

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalAssets: 0,
    activeAssets: 0,
    maintenanceDue: 0,
    totalValue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:5000/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!response.ok) throw new Error('Failed to fetch stats')
        
        const data = await response.json()
        
        setStats({
          totalAssets: data.totalAssets || 0,
          activeAssets: data.activeAssets || 0,
          maintenanceDue: data.maintenanceDue || 0,
          totalValue: data.totalValue || 0,
        })
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const StatCard: React.FC<{
    title: string
    value: string | number
    icon: React.ReactNode
    gradient: string
    subtext?: string
  }> = ({ title, value, icon, gradient, subtext }) => (
    <div className={`${gradient} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-xs font-medium truncate">{title}</p>
          <p className="text-2xl font-bold mt-1 break-words">{value}</p>
          {subtext && <p className="text-white/70 text-xs mt-1 truncate">{subtext}</p>}
        </div>
        <div className="text-3xl opacity-20 flex-shrink-0">{icon}</div>
      </div>
      <div className="h-0.5 bg-white/30 rounded-full mt-3"></div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          Welcome back, {user?.name}!
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
            <MdLaptop className="text-3xl text-white" />
          </div>
        </h1>
        <p className="text-gray-600 mt-2">Here's your asset management overview</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <Spinner message="Loading dashboard..." />
      ) : error ? (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Assets"
              value={stats.totalAssets}
              icon={<MdInventory2 />}
              gradient="bg-gradient-to-br from-blue-500 to-blue-600"
              subtext="All tracked items"
            />
            <StatCard
              title="Active Assets"
              value={stats.activeAssets}
              icon={<MdCheckCircle />}
              gradient="bg-gradient-to-br from-green-500 to-green-600"
              subtext="Currently in use"
            />
            <StatCard
              title="Maintenance Due"
              value={stats.maintenanceDue}
              icon={<MdBuildCircle />}
              gradient="bg-gradient-to-br from-amber-500 to-amber-600"
              subtext="Needs attention"
            />
            <StatCard
              title="Total Value"
              value={formatCurrency(stats.totalValue)}
              icon={<MdAttachMoney />}
              gradient="bg-gradient-to-br from-purple-500 to-purple-600"
              subtext="Asset value"
            />
          </div>

          {/* Summary Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Asset Distribution</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm font-medium">Active</span>
                    <span className="text-green-600 font-semibold">{Math.round((stats.activeAssets / stats.totalAssets) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(stats.activeAssets / stats.totalAssets) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm font-medium">Maintenance</span>
                    <span className="text-amber-600 font-semibold">{Math.round((stats.maintenanceDue / stats.totalAssets) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(stats.maintenanceDue / stats.totalAssets) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm font-medium">Inactive</span>
                    <span className="text-red-600 font-semibold">{Math.round(((stats.totalAssets - stats.activeAssets - stats.maintenanceDue) / stats.totalAssets) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((stats.totalAssets - stats.activeAssets - stats.maintenanceDue) / stats.totalAssets) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Insights */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Key Insights</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-blue-600">{stats.activeAssets}</span> assets are currently active and operational
                  </p>
                </div>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-amber-600">{stats.maintenanceDue}</span> assets require maintenance attention
                  </p>
                </div>
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                  <p className="text-sm text-gray-700">
                    Total asset value is <span className="font-semibold text-purple-600">{formatCurrency(stats.totalValue)}</span>
                  </p>
                </div>
              </div>
            </Card>

            {/* Action Items */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/assets')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <MdInventory2 className="text-xl" /> View All Assets
                </button>
                <button 
                  onClick={() => navigate('/assets')}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <MdAddCircle className="text-xl" /> Add New Asset
                </button>
                <button 
                  onClick={() => navigate('/maintenance')}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <MdBuildCircle className="text-xl" /> Schedule Maintenance
                </button>
                <button 
                  onClick={() => navigate('/reports')}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <MdAnalytics className="text-xl" /> View Reports
                </button>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

// ============ ASSETS PAGE ============

export const AssetsPage: React.FC = () => {
  const navigate = useNavigate()
  const { assets, loading, error, fetchAssets } = useAssets()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [deviceNameFilter, setDeviceNameFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [filteredAssets, setFilteredAssets] = useState<any[]>([])
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    category: '',
    deviceName: '',
    serialNumber: '',
    assetTag: '',
    location: '',
    userAssigned: '',
    purchasePrice: '',
    status: 'ACTIVE',
    ram: '',
    storage: '',
    processor: '',
  })
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showAssignDropdown, setShowAssignDropdown] = useState(false)
  const [selectedAssetForAssign, setSelectedAssetForAssign] = useState<any>(null)
  const [assignEmployeeName, setAssignEmployeeName] = useState('')
  const [assignUserSearch, setAssignUserSearch] = useState('')
  const [assignAvailableUsers, setAssignAvailableUsers] = useState<any[]>([])
  const [assignSelectedUserId, setAssignSelectedUserId] = useState('')
  const [assignLoading, setAssignLoading] = useState(false)
  const [assignError, setAssignError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [assetToDelete, setAssetToDelete] = useState<any>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedViewAsset, setSelectedViewAsset] = useState<any>(null)

  useEffect(() => {
    fetchAssets(currentPage)
  }, [currentPage, fetchAssets])

  useEffect(() => {
    let filtered = assets
    if (searchTerm) {
      filtered = searchInArray(filtered, searchTerm, ['name', 'assetTag', 'category', 'deviceName', 'serialNumber', 'location', 'userAssigned'] as const)
    }
    if (statusFilter) {
      filtered = filtered.filter((a) => a.status === statusFilter)
    }
    if (categoryFilter) {
      filtered = filtered.filter((a) => a.category === categoryFilter)
    }
    if (deviceNameFilter) {
      filtered = filtered.filter((a) => (a.deviceName || a.name).includes(deviceNameFilter))
    }
    setFilteredAssets(filtered)
  }, [assets, searchTerm, statusFilter, categoryFilter, deviceNameFilter])

  const handleSaveAsset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.category || !formData.deviceName || !formData.assetTag || !formData.location || !formData.purchasePrice) {
      setSaveError('Please fill in all required fields')
      return
    }

    try {
      setSaveLoading(true)
      setSaveError(null)
      
      const url = editingAssetId 
        ? `http://localhost:5000/api/assets/${editingAssetId}`
        : 'http://localhost:5000/api/assets'
      
      const method = editingAssetId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.deviceName,
          deviceName: formData.deviceName,
          serialNumber: formData.serialNumber ? formData.serialNumber : null,
          category: formData.category,
          assetTag: formData.assetTag,
          location: formData.location,
          userAssigned: formData.userAssigned ? formData.userAssigned : null,
          purchasePrice: parseFloat(formData.purchasePrice),
          purchaseDate: new Date(),
          status: formData.status,
          description: `${formData.category} - ${formData.deviceName}`,
          ram: formData.ram || null,
          storage: formData.storage || null,
          processor: formData.processor || null,
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save asset')
      }

      const result = await fetchAssets(currentPage)
      console.log('Assets fetched after save:', result)
      setShowModal(false)
      setEditingAssetId(null)
      setFormData({
        category: '',
        deviceName: '',
        serialNumber: '',
        assetTag: '',
        location: '',
        userAssigned: '',
        purchasePrice: '',
        status: 'ACTIVE',
        ram: '',
        storage: '',
        processor: '',
      })
    } catch (err: any) {
      console.error('Error saving asset:', err)
      setSaveError(err.message)
    } finally {
      setSaveLoading(false)
    }
  }

  const handleEditAsset = (asset: any) => {
    setEditingAssetId(asset.id)
    setFormData({
      category: asset.category || '',
      deviceName: asset.deviceName || asset.name || '',
      serialNumber: asset.serialNumber || '',
      assetTag: asset.assetTag || '',
      location: asset.location || '',
      userAssigned: asset.userAssigned || '',
      purchasePrice: asset.purchasePrice ? asset.purchasePrice.toString() : '',
      status: asset.status || 'ACTIVE',
      ram: asset.ram || '',
      storage: asset.storage || '',
      processor: asset.processor || '',
    })
    setShowModal(true)
    setSaveError(null)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingAssetId(null)
    setSaveError(null)
    setFormData({
      category: '',
      deviceName: '',
      serialNumber: '',
      assetTag: '',
      location: '',
      userAssigned: '',
      purchasePrice: '',
      status: 'ACTIVE',
      ram: '',
      storage: '',
      processor: '',
    })
  }

  const handleOpenAssignModal = async (asset: any) => {
    setSelectedAssetForAssign(asset)
    setAssignEmployeeName(asset.userAssigned || '')
    setAssignError(null)
    setAssignUserSearch('')
    setAssignSelectedUserId('')
    
    // Fetch available users
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAssignAvailableUsers(data.data || data || [])
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
    }
    
    setShowAssignModal(true)
  }

  const handleCloseAssignModal = () => {
    setShowAssignModal(false)
    setShowAssignDropdown(false)
    setSelectedAssetForAssign(null)
    setAssignEmployeeName('')
    setAssignUserSearch('')
    setAssignSelectedUserId('')
    setAssignError(null)
  }

  const handleAssignAsset = async () => {
    if (!assignSelectedUserId && !assignEmployeeName.trim()) {
      setAssignError('Please select or enter an employee name')
      return
    }

    const employeeName = assignSelectedUserId 
      ? (assignAvailableUsers.find(u => u.id === assignSelectedUserId)?.name || '')
      : assignEmployeeName

    if (!employeeName.trim()) {
      setAssignError('Please select or enter an employee name')
      return
    }

    if (!selectedAssetForAssign) return

    try {
      setAssignLoading(true)
      setAssignError(null)

      const response = await fetch(`http://localhost:5000/api/assets/${selectedAssetForAssign.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...selectedAssetForAssign,
          userAssigned: employeeName.trim(),
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to assign asset')
      }

      await fetchAssets(currentPage)
      handleCloseAssignModal()
    } catch (err: any) {
      setAssignError(err.message)
    } finally {
      setAssignLoading(false)
    }
  }

  const handleDeleteAsset = (asset: any) => {
    setAssetToDelete(asset)
    setShowDeleteConfirm(true)
  }

  const handleViewAsset = (asset: any) => {
    setSelectedViewAsset(asset)
    setShowViewModal(true)
  }

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false)
    setAssetToDelete(null)
    setDeleteLoading(false)
  }

  const handleConfirmDelete = async () => {
    if (!assetToDelete) return

    try {
      setDeleteLoading(true)

      const response = await fetch(`http://localhost:5000/api/assets/${assetToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete asset')
      }

      await fetchAssets(currentPage)
      handleCloseDeleteConfirm()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <MdInventory2 className="text-5xl text-blue-600" /> Asset Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and track all your assets</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          <MdAddCircle className="text-xl" /> Add New Asset
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 items-end bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex-wrap">
        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Assets</label>
          <Input
            placeholder="Search by name, tag, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </div>
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <Select
            options={[
              { value: '', label: 'All Categories' },
              { value: 'Laptop', label: 'Laptop' },
              { value: 'Monitor/Screen', label: 'Monitor/Screen' },
              { value: 'Keyboard', label: 'Keyboard' },
              { value: 'Mouse', label: 'Mouse' },
              { value: 'Charger', label: 'Charger' },
              { value: 'Bag', label: 'Bag' },
              { value: 'Headphones', label: 'Headphones' },
              { value: 'Printer', label: 'Printer' },
            ]}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">Device Name</label>
          <Select
            options={[
              { value: '', label: 'All Devices' },
              ...Array.from(new Set(assets.map((a) => a.deviceName || a.name)))
                .filter(Boolean)
                .map((device) => ({ value: device, label: device })),
            ]}
            value={deviceNameFilter}
            onChange={(e) => setDeviceNameFilter(e.target.value)}
          />
        </div>
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <Select
            options={[
              { value: '', label: 'All Status' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'MAINTENANCE', label: 'Maintenance' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => {}} />}

      {loading ? (
        <Spinner message="Loading assets..." />
      ) : filteredAssets.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📦</span>
            <p className="text-gray-600 text-lg font-medium">No assets found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        </Card>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">All Assets ({filteredAssets.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <Table
                headers={['Category', 'Device Name', 'Serial Number', 'Status', 'Location', 'User Assigned', 'Value', 'Actions']}
                data={filteredAssets.map((asset) => ({
                  Category: <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{asset.category}</span>,
                  'Device Name': <span className="font-medium text-gray-800">{asset.deviceName || asset.name}</span>,
                  'Serial Number': <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded text-gray-700">{asset.serialNumber ? asset.serialNumber : <span className="text-gray-400 italic">Not provided</span>}</span>,
                  Status: <Badge text={capitalize(asset.status)} />,
                  Location: <span className="text-sm text-gray-600">{asset.location}</span>,
                  'User Assigned': <span className="text-sm text-gray-700">{asset.userAssigned ? `👤 ${asset.userAssigned}` : <span className="text-gray-400 italic">Unassigned</span>}</span>,
                  Value: <span className="font-semibold text-green-600">{formatCurrency(asset.purchasePrice)}</span>,
                  Actions: (
                    <div className="flex gap-2">
                      <button 
                        className="flex flex-col items-center justify-center text-purple-600 hover:text-purple-700 transition-colors"
                        onClick={() => handleViewAsset(asset)}
                        title="View Asset"
                      >
                        <MdRemoveRedEye className="text-2xl" />
                        <span className="text-[10px] leading-tight text-gray-700">View</span>
                      </button>
                      <button 
                        className="flex flex-col items-center justify-center text-green-600 hover:text-green-700 transition-colors"
                        onClick={() => handleOpenAssignModal(asset)}
                        title="Assign Asset"
                      >
                        <MdAssignmentInd className="text-2xl" />
                        <span className="text-[10px] leading-tight text-gray-700">Assign</span>
                      </button>
                      <button 
                        className="flex flex-col items-center justify-center text-blue-600 hover:text-blue-700 transition-colors"
                        onClick={() => handleEditAsset(asset)}
                        title="Edit Asset"
                      >
                        <MdEdit className="text-2xl" />
                        <span className="text-[10px] leading-tight text-gray-700">Edit</span>
                      </button>
                      <button 
                        className="flex flex-col items-center justify-center text-red-600 hover:text-red-700 transition-colors"
                        onClick={() => handleDeleteAsset(asset)}
                        title="Delete Asset"
                      >
                        <MdDelete className="text-2xl" />
                        <span className="text-[10px] leading-tight text-gray-700">Delete</span>
                      </button>
                    </div>
                  ),
                }))}
              />
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Add/Edit Asset Modal */}
      <Modal
        isOpen={showModal}
        title={editingAssetId ? "Edit Asset" : "Add New Asset"}
        onClose={handleCloseModal}
        footer={
          <>
            <Button 
              variant="secondary" 
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button 
              className={`text-white ${editingAssetId ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'}`}
              onClick={handleSaveAsset}
              loading={saveLoading}
            >
              {editingAssetId ? 'Update Asset' : 'Save Asset'}
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSaveAsset}>
          {saveError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {saveError}
            </div>
          )}
          <Select
            label="Category *"
            options={[
              { value: '', label: 'Select Category' },
              { value: 'Laptop', label: 'Laptop' },
              { value: 'Desktop', label: 'Desktop' },
              { value: 'Monitor/Screen', label: 'Monitor/Screen' },
              { value: 'Keyboard', label: 'Keyboard' },
              { value: 'Mouse', label: 'Mouse' },
              { value: 'Charger', label: 'Charger' },
              { value: 'Bag', label: 'Bag' },
              { value: 'Headphones', label: 'Headphones' },
              { value: 'Printer', label: 'Printer' },
            ]}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <Input 
            label="Device Name *" 
            placeholder="e.g., Dell XPS 13, MacBook Pro" 
            fullWidth 
            value={formData.deviceName}
            onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
          />
          {(formData.category === 'Laptop' || formData.category === 'Desktop') && (
            <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-800">Specifications</p>
              <Input 
                label="RAM (GB)" 
                placeholder="e.g., 16GB" 
                fullWidth 
                value={formData.ram}
                onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
              />
              <Input 
                label="Storage" 
                placeholder="e.g., 512GB SSD" 
                fullWidth 
                value={formData.storage}
                onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
              />
              <Input 
                label="Processor" 
                placeholder="e.g., Intel Core i7-12th Gen" 
                fullWidth 
                value={formData.processor}
                onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
              />
            </div>
          )}
          {formData.category !== 'Bag' && (
            <Input 
              label="Serial Number" 
              placeholder="e.g., DLL-123456" 
              fullWidth 
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            />
          )}
          <Input 
            label="Asset Tag *" 
            placeholder="AUTO-001" 
            fullWidth 
            value={formData.assetTag}
            onChange={(e) => setFormData({ ...formData, assetTag: e.target.value })}
          />
          <Input 
            label="Location *" 
            placeholder="Building A, Room 101" 
            fullWidth 
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <Input 
            label="User Assigned" 
            placeholder="Employee name (optional)" 
            fullWidth 
            value={formData.userAssigned}
            onChange={(e) => setFormData({ ...formData, userAssigned: e.target.value })}
          />
          <Input
            label="Purchase Price *"
            type="number"
            placeholder="0.00"
            fullWidth
            value={formData.purchasePrice}
            onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
          />
          <Select
            label="Status"
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'MAINTENANCE', label: 'Maintenance' },
            ]}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          />
        </form>
      </Modal>

      {/* Assign Asset Modal */}
      <Modal
        isOpen={showAssignModal}
        title={`Assign Asset: ${selectedAssetForAssign?.deviceName || selectedAssetForAssign?.name || ''}`}
        onClose={handleCloseAssignModal}
        footer={
          <>
            <Button 
              variant="secondary" 
              onClick={handleCloseAssignModal}
            >
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              onClick={handleAssignAsset}
              loading={assignLoading}
            >
              Assign to Employee
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {assignError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {assignError}
            </div>
          )}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Asset:</span> {selectedAssetForAssign?.deviceName || selectedAssetForAssign?.name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Category:</span> {selectedAssetForAssign?.category}
            </p>
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Select Registered Employee *</label>
            
            <div className="relative">
              <button
                type="button"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left bg-white hover:bg-gray-50"
                onClick={() => setShowAssignDropdown(!showAssignDropdown)}
              >
                {assignSelectedUserId 
                  ? assignEmployeeName
                  : '-- Choose an employee --'
                }
              </button>

              {showAssignDropdown && (
                <div className="absolute z-10 w-full mt-1 border border-gray-300 rounded-lg bg-white shadow-lg">
                  <Input
                    placeholder="Search by name or email..."
                    fullWidth
                    value={assignUserSearch}
                    onChange={(e) => setAssignUserSearch(e.target.value)}
                    className="rounded-b-none border-b"
                  />
                  
                  <div className="max-h-60 overflow-y-auto">
                    {assignAvailableUsers
                      .filter(user => 
                        user.name.toLowerCase().includes(assignUserSearch.toLowerCase()) ||
                        user.email.toLowerCase().includes(assignUserSearch.toLowerCase())
                      )
                      .map(user => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => {
                            setAssignSelectedUserId(user.id)
                            setAssignEmployeeName(user.name)
                            setShowAssignDropdown(false)
                            setAssignUserSearch('')
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                        >
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email} - {user.role}</p>
                        </button>
                      ))}
                    
                    {assignAvailableUsers.filter(user => 
                      user.name.toLowerCase().includes(assignUserSearch.toLowerCase()) ||
                      user.email.toLowerCase().includes(assignUserSearch.toLowerCase())
                    ).length === 0 && (
                      <div className="px-4 py-3 text-center text-gray-500 text-sm">
                        No employees found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="text-center text-sm text-gray-500 my-2">or</div>
            </div>

            <Input
              label="Manually Enter Employee Name"
              placeholder="Type name if not in list"
              fullWidth
              value={assignEmployeeName}
              onChange={(e) => {
                setAssignEmployeeName(e.target.value)
                setAssignSelectedUserId('')
              }}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        title="Confirm Delete"
        onClose={handleCloseDeleteConfirm}
        footer={
          <>
            <Button 
              variant="secondary" 
              onClick={handleCloseDeleteConfirm}
              disabled={deleteLoading}
            >
              No, Cancel
            </Button>
            <Button 
              variant="danger"
              onClick={handleConfirmDelete}
              loading={deleteLoading}
            >
              Yes, Delete
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700 font-medium">Are you sure you want to delete this asset?</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 mb-2">
              <span className="font-semibold">Asset:</span> {assetToDelete?.deviceName || assetToDelete?.name}
            </p>
            <p className="text-sm text-red-800">
              <span className="font-semibold">Serial:</span> {assetToDelete?.serialNumber || 'Not provided'}
            </p>
          </div>
          <p className="text-sm text-red-600 font-semibold">⚠️ This action cannot be undone.</p>
        </div>
      </Modal>

      {/* View Asset Modal */}
      <Modal
        isOpen={showViewModal}
        title={`Asset Details: ${selectedViewAsset?.deviceName || selectedViewAsset?.name || ''}`}
        onClose={() => setShowViewModal(false)}
        footer={
          <Button 
            onClick={() => setShowViewModal(false)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          >
            Close
          </Button>
        }
      >
        {selectedViewAsset && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-0.5">Category</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedViewAsset.category}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-0.5">Device Name</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedViewAsset.deviceName || selectedViewAsset.name}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-0.5">Serial Number</p>
                  <p className="text-sm font-mono text-gray-800">{selectedViewAsset.serialNumber || <span className="text-gray-400">Not provided</span>}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-0.5">Asset Tag</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedViewAsset.assetTag}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-0.5">Status</p>
                  <Badge text={capitalize(selectedViewAsset.status)} />
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-0.5">Location</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedViewAsset.location}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-0.5">User Assigned</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedViewAsset.userAssigned || <span className="text-gray-400">Unassigned</span>}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-0.5">Purchase Price</p>
                  <p className="text-sm font-semibold text-green-600">{formatCurrency(selectedViewAsset.purchasePrice)}</p>
                </div>
              </div>
            </div>
            
            {(selectedViewAsset.category === 'Laptop' || selectedViewAsset.category === 'Desktop') && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-blue-800 mb-3 uppercase tracking-wide">Specifications</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="bg-white p-3 rounded-lg border border-blue-200">
                    <p className="text-xs font-semibold text-gray-600 mb-1">RAM</p>
                    <p className="text-sm font-semibold text-blue-700">{selectedViewAsset.ram || <span className="text-gray-400">Not specified</span>}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-200">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Storage</p>
                    <p className="text-sm font-semibold text-blue-700">{selectedViewAsset.storage || <span className="text-gray-400">Not specified</span>}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-200">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Processor</p>
                    <p className="text-sm font-semibold text-blue-700">{selectedViewAsset.processor || <span className="text-gray-400">Not specified</span>}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-100 p-3 rounded-lg text-xs text-gray-600 space-y-1">
              <p><span className="font-semibold">Created:</span> {new Date(selectedViewAsset.createdAt).toLocaleDateString()}</p>
              <p><span className="font-semibold">Last Updated:</span> {new Date(selectedViewAsset.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export const UsersPage: React.FC = () => {
  const { user: currentUser, setUser, token } = useAuthStore()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [deletingUser, setDeletingUser] = useState<any>(null)
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE', status: 'ACTIVE' })
  const [editedUser, setEditedUser] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE', status: 'ACTIVE' })
  const [saving, setSaving] = useState(false)
  const [showAssetsModal, setShowAssetsModal] = useState(false)
  const [selectedUserAssets, setSelectedUserAssets] = useState<any[]>([])
  const [selectedUserForAssets, setSelectedUserForAssets] = useState<any>(null)
  const [assetsLoading, setAssetsLoading] = useState(false)
  const [unassignLoading, setUnassignLoading] = useState<string | null>(null)
  const [showUnassignConfirm, setShowUnassignConfirm] = useState(false)
  const [assetToUnassign, setAssetToUnassign] = useState<any>(null)
  const [showReassignModal, setShowReassignModal] = useState(false)
  const [assetToReassign, setAssetToReassign] = useState<any>(null)
  const [reassignUserSearch, setReassignUserSearch] = useState('')
  const [reassignAvailableUsers, setReassignAvailableUsers] = useState<any[]>([])
  const [reassignSelectedUserId, setReassignSelectedUserId] = useState('')
  const [reassignLoading, setReassignLoading] = useState(false)
  const [showReassignDropdown, setShowReassignDropdown] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  // Verify user data is loaded
  useEffect(() => {
    if (token && !currentUser) {
      const verifyUser = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
          }
        } catch (err) {
          console.error('Failed to verify user:', err)
        }
      }
      
      verifyUser()
    }
  }, [token, currentUser, setUser])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!response.ok) throw new Error('Failed to fetch users')
      
      const data = await response.json()
      setUsers(data.data || data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSaveUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Please fill in all fields')
      return
    }

    try {
      setSaving(true)
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newUser)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create user')
      }

      alert('User created successfully')
      setNewUser({ name: '', email: '', password: '', role: 'EMPLOYEE', status: 'ACTIVE' })
      setShowModal(false)
      await fetchUsers()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }
  const handleEditUser = (user: any) => {
    setEditingUser(user)
    setEditedUser({ name: user.name, email: user.email, password: '', role: user.role, status: user.status || 'ACTIVE' })
    setShowEditModal(true)
  }

  const handleSaveEditedUser = async () => {
    if (!editedUser.name || !editedUser.email) {
      alert('Please fill in all fields')
      return
    }

    // If password is being changed and user is not ADMIN, show error
    if (editedUser.password && currentUser?.role !== 'ADMIN') {
      alert('Only administrators can change passwords')
      return
    }

    try {
      setSaving(true)
      const updateData: any = {
        name: editedUser.name,
        email: editedUser.email,
        role: editedUser.role,
        status: editedUser.status
      }

      // Only include password if it's provided
      if (editedUser.password) {
        updateData.password = editedUser.password
      }

      const response = await fetch(`http://localhost:5000/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to update user')
      }

      alert('User updated successfully')
      setShowEditModal(false)
      await fetchUsers()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteUser = (user: any) => {
    setDeletingUser(user)
    setShowDeleteConfirm(true)
  }

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false)
    setDeletingUser(null)
  }

  const handleConfirmDeleteUser = async () => {
    if (!deletingUser) return

    try {
      setSaving(true)
      const response = await fetch(`http://localhost:5000/api/users/${deletingUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete user')
      }

      alert('User deleted successfully')
      handleCloseDeleteConfirm()
      await fetchUsers()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const deleteUser = async (user: any) => {
    try {
      setSaving(true)
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete user')
      }

      alert('User deleted successfully')
      await fetchUsers()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleViewUserAssets = async (user: any) => {
    setSelectedUserForAssets(user)
    setShowAssetsModal(true)
    setAssetsLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/assets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch assets')

      const data = await response.json()
      const allAssets = data.data || data || []
      
      // Filter assets assigned to this user (using userAssigned field)
      const userAssets = allAssets.filter((asset: any) => asset.userAssigned === user.name)
      setSelectedUserAssets(userAssets)
    } catch (err: any) {
      console.error('Error fetching assets:', err)
      setSelectedUserAssets([])
    } finally {
      setAssetsLoading(false)
    }
  }

  const handleOpenUnassignModal = (asset: any) => {
    setAssetToUnassign(asset)
    setShowUnassignConfirm(true)
  }

  const handleConfirmUnassign = async () => {
    if (!assetToUnassign) return

    try {
      setUnassignLoading(assetToUnassign.id)

      const response = await fetch(`http://localhost:5000/api/assets/${assetToUnassign.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...assetToUnassign,
          userAssigned: null,
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to unassign asset')
      }

      // Remove the asset from the list
      setSelectedUserAssets(selectedUserAssets.filter(a => a.id !== assetToUnassign.id))
      setShowUnassignConfirm(false)
      setAssetToUnassign(null)
      alert('Asset unassigned successfully')
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setUnassignLoading(null)
    }
  }

  const handleOpenReassignModal = async (asset: any) => {
    setAssetToReassign(asset)
    setShowReassignModal(true)
    setReassignUserSearch('')
    setReassignSelectedUserId('')
    setShowReassignDropdown(true)

    // Fetch available users (excluding current user)
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Filter out the current user to avoid reassigning to the same user
        const availableUsers = (data.data || data || []).filter(
          (user: any) => user.name !== selectedUserForAssets?.name
        )
        setReassignAvailableUsers(availableUsers)
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
    }
  }

  const handleCloseReassignModal = () => {
    setShowReassignModal(false)
    setShowReassignDropdown(false)
    setAssetToReassign(null)
    setReassignUserSearch('')
    setReassignSelectedUserId('')
  }

  const handleConfirmReassign = async () => {
    if (!reassignSelectedUserId || !assetToReassign) return

    const selectedUser = reassignAvailableUsers.find(u => u.id === reassignSelectedUserId)
    if (!selectedUser) return

    try {
      setReassignLoading(true)

      const response = await fetch(`http://localhost:5000/api/assets/${assetToReassign.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...assetToReassign,
          userAssigned: selectedUser.name,
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to reassign asset')
      }

      // Remove the asset from the current user's list
      setSelectedUserAssets(selectedUserAssets.filter(a => a.id !== assetToReassign.id))
      handleCloseReassignModal()
      alert(`Asset reassigned to ${selectedUser.name} successfully`)
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setReassignLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <MdPeople className="text-5xl text-green-600" /> User Management
          </h1>
          <p className="text-gray-600 mt-2">Manage team members and their roles</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          <MdAddCircle className="text-xl" /> Add User
        </Button>
      </div>

      {loading ? (
        <Spinner message="Loading users..." />
      ) : error ? (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      ) : users.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">👥</span>
            <p className="text-gray-600 text-lg font-medium">No users found</p>
            <p className="text-gray-500 text-sm mt-2">Add your first team member to get started</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Search Users"
                placeholder="Search by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                fullWidth
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
                <Select
                  options={[
                    { value: 'ALL', label: 'All Roles' },
                    { value: 'ADMIN', label: capitalize('admin') },
                    { value: 'MANAGER', label: capitalize('manager') },
                    { value: 'EMPLOYEE', label: capitalize('employee') },
                  ]}
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <Select
                  options={[
                    { value: 'ALL', label: 'All Status' },
                    { value: 'ACTIVE', label: capitalize('active') },
                    { value: 'RETIRED', label: capitalize('retired') },
                    { value: 'RESIGNED', label: capitalize('resigned') },
                  ]}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Team Members (
                {users
                  .filter((user) => {
                    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                      user.email.toLowerCase().includes(userSearch.toLowerCase())
                    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
                    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter
                    return matchesSearch && matchesRole && matchesStatus
                  }).length
                })
              </h2>
            </div>
            <div className="overflow-x-auto">
              <Table
                headers={['Name', 'Email', 'Role', 'Status', 'Actions']}
                data={users
                  .filter((user) => {
                    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                      user.email.toLowerCase().includes(userSearch.toLowerCase())
                    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
                    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter
                    return matchesSearch && matchesRole && matchesStatus
                  })
                  .map((user) => ({
                    Name: <span className="font-medium text-gray-800">{user.name}</span>,
                    Email: <span className="text-gray-600">{user.email}</span>,
                    Role: (
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                        user.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role === 'ADMIN' ? <MdSecurity className="text-lg" /> : user.role === 'MANAGER' ? <MdManageAccounts className="text-lg" /> : <MdRemoveRedEye className="text-lg" />} 
                        {capitalize(user.role)}
                      </span>
                    ),
                    Status: (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        user.status === 'RETIRED' ? 'bg-gray-100 text-gray-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {capitalize(user.status || 'ACTIVE')}
                      </span>
                    ),
                    Actions: (
                      <div className="flex items-center justify-center gap-4">
                        <button 
                          className="flex flex-col items-center justify-center text-cyan-600 hover:text-cyan-700 transition-colors"
                          onClick={() => handleViewUserAssets(user)}
                          title="View Assigned Assets"
                        >
                          <MdInventory2 className="text-2xl" />
                          <span className="text-[10px] leading-tight text-gray-700">Assets</span>
                        </button>
                        <button 
                          className="flex flex-col items-center justify-center text-blue-600 hover:text-blue-700 transition-colors"
                          onClick={() => handleEditUser(user)}
                          title="Edit User"
                        >
                          <MdEdit className="text-2xl" />
                          <span className="text-[10px] leading-tight text-gray-700">Edit</span>
                        </button>
                        <button 
                          className="flex flex-col items-center justify-center text-red-600 hover:text-red-700 transition-colors"
                          onClick={() => handleDeleteUser(user)}
                          title="Delete User"
                        >
                          <MdDelete className="text-2xl" />
                          <span className="text-[10px] leading-tight text-gray-700">Delete</span>
                        </button>
                      </div>
                    ),
                  }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={showModal}
        title="Add New User"
        onClose={() => setShowModal(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveUser}
              disabled={saving}
              className="bg-gradient-to-r from-green-500 to-green-600"
            >
              {saving ? 'Saving...' : 'Save User'}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input 
            label="Full Name" 
            placeholder="John Doe" 
            fullWidth 
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@company.com"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter a password"
            fullWidth
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <Select
            label="Role"
            options={[
              { value: 'ADMIN', label: 'Administrator' },
              { value: 'MANAGER', label: 'Manager' },
              { value: 'EMPLOYEE', label: 'Employee' },
            ]}
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          />
          <Select
            label="Status"
            options={[
              { value: 'ACTIVE', label: capitalize('active') },
              { value: 'RETIRED', label: capitalize('retired') },
              { value: 'RESIGNED', label: capitalize('resigned') },
            ]}
            value={newUser.status}
            onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
          />
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        title="Edit User"
        onClose={() => setShowEditModal(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEditedUser}
              disabled={saving}
              className="bg-gradient-to-r from-blue-500 to-blue-600"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input 
            label="Full Name" 
            placeholder="John Doe" 
            fullWidth 
            value={editedUser.name}
            onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@company.com"
            fullWidth
            value={editedUser.email}
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
          />
          {currentUser?.role === 'ADMIN' && (
            <Input
              label="Password (leave empty to keep current)"
              type="password"
              placeholder="Leave empty to keep current password"
              fullWidth
              value={editedUser.password}
              onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
            />
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEditedUser({ ...editedUser, role: 'ADMIN' })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  editedUser.role === 'ADMIN'
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-red-200'
                }`}
              >
                <MdSecurity className="text-lg" />
                <span className="font-medium">{capitalize('admin')}</span>
              </button>
              <button
                type="button"
                onClick={() => setEditedUser({ ...editedUser, role: 'MANAGER' })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  editedUser.role === 'MANAGER'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200'
                }`}
              >
                <MdManageAccounts className="text-lg" />
                <span className="font-medium">{capitalize('manager')}</span>
              </button>
              <button
                type="button"
                onClick={() => setEditedUser({ ...editedUser, role: 'EMPLOYEE' })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  editedUser.role === 'EMPLOYEE'
                    ? 'border-gray-600 bg-gray-50 text-gray-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <MdRemoveRedEye className="text-lg" />
                <span className="font-medium">{capitalize('employee')}</span>
              </button>
            </div>
          </div>

          <Select
            label="Status"
            options={[
              { value: 'ACTIVE', label: capitalize('active') },
              { value: 'RETIRED', label: capitalize('retired') },
              { value: 'RESIGNED', label: capitalize('resigned') },
            ]}
            value={editedUser.status}
            onChange={(e) => setEditedUser({ ...editedUser, status: e.target.value })}
          />
        </form>
      </Modal>

      {/* Delete User Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        title="Confirm Delete User"
        onClose={handleCloseDeleteConfirm}
        footer={
          <>
            <Button 
              variant="secondary" 
              onClick={handleCloseDeleteConfirm}
              disabled={saving}
            >
              No, Cancel
            </Button>
            <Button 
              variant="danger"
              onClick={handleConfirmDeleteUser}
              loading={saving}
            >
              Yes, Delete
            </Button>
          </>
        }
      >
        <div className="text-center space-y-4">
          <p className="text-gray-700">Are you sure you want to delete this user?</p>
          {deletingUser && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="font-medium text-gray-800">{deletingUser.name}</p>
              <p className="text-sm text-gray-600">{deletingUser.email}</p>
            </div>
          )}
          <p className="text-red-600 text-sm font-medium">⚠️ This action cannot be undone</p>
        </div>
      </Modal>

      {/* View User Assets Modal */}
      <Modal
        isOpen={showAssetsModal}
        title={`Assets Assigned to ${selectedUserForAssets?.name || 'User'}`}
        onClose={() => {
          setShowAssetsModal(false)
          setSelectedUserForAssets(null)
          setSelectedUserAssets([])
        }}
        footer={
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowAssetsModal(false)
              setSelectedUserForAssets(null)
              setSelectedUserAssets([])
            }}
          >
            Close
          </Button>
        }
      >
        <div className="space-y-4">
          {assetsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner message="Loading assets..." />
            </div>
          ) : selectedUserAssets.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">📭</span>
              <p className="text-gray-600 font-medium">No assets assigned to this user</p>
              <p className="text-gray-500 text-sm mt-2">This user has not been assigned any assets yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedUserAssets.map((asset: any) => (
                <div key={asset.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{asset.name}</h3>
                      <p className="text-sm text-gray-600">{asset.category}</p>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span className="text-gray-600">Tag: <span className="font-medium">{asset.assetTag}</span></span>
                        <span className="text-gray-600">Serial: <span className="font-medium">{asset.serialNumber}</span></span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div>
                        <p className="font-semibold text-green-600">{formatCurrency(asset.purchasePrice)}</p>
                        <p className={`text-xs font-medium mt-1 ${
                          asset.condition === 'GOOD' ? 'text-green-700 bg-green-100' :
                          asset.condition === 'FAIR' ? 'text-yellow-700 bg-yellow-100' :
                          'text-red-700 bg-red-100'
                        } px-2 py-1 rounded`}>
                          {asset.condition}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenReassignModal(asset)}
                          disabled={reassignLoading}
                          className="inline-flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded transition disabled:opacity-50"
                        >
                          <MdAssignmentInd className="text-sm" />
                          Assign
                        </button>
                        <button
                          onClick={() => handleOpenUnassignModal(asset)}
                          disabled={unassignLoading === asset.id}
                          className="inline-flex items-center gap-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded transition disabled:opacity-50"
                        >
                          <MdUnarchive className="text-sm" />
                          {unassignLoading === asset.id ? 'Unassigning...' : 'Unassign'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Unassign Asset Confirmation Modal */}
      <Modal
        isOpen={showUnassignConfirm}
        title="Confirm Unassign Asset"
        onClose={() => {
          setShowUnassignConfirm(false)
          setAssetToUnassign(null)
        }}
        footer={
          <>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowUnassignConfirm(false)
                setAssetToUnassign(null)
              }}
              disabled={unassignLoading !== null}
            >
              No, Cancel
            </Button>
            <Button 
              variant="danger"
              onClick={handleConfirmUnassign}
              loading={unassignLoading !== null}
            >
              Yes, Unassign
            </Button>
          </>
        }
      >
        <div className="text-center space-y-4">
          <p className="text-gray-700">Are you sure you want to unassign this asset?</p>
          {assetToUnassign && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-2">
              <p className="font-medium text-gray-800">{assetToUnassign.name}</p>
              <p className="text-sm text-gray-600">{assetToUnassign.category}</p>
              <p className="text-xs text-gray-500">Tag: {assetToUnassign.assetTag}</p>
              <p className="text-sm font-semibold text-green-600 mt-2">{formatCurrency(assetToUnassign.purchasePrice)}</p>
            </div>
          )}
          <p className="text-amber-600 text-sm font-medium">⚠️ The asset will be unassigned from {selectedUserForAssets?.name}</p>
        </div>
      </Modal>

      {/* Assign Asset to User Modal */}
      <Modal
        isOpen={showReassignModal}
        title={`Reassign ${assetToReassign?.name || 'Asset'} to Another User`}
        onClose={handleCloseReassignModal}
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseReassignModal} disabled={reassignLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmReassign}
              loading={reassignLoading}
              className="bg-gradient-to-r from-blue-500 to-blue-600"
            >
              {reassignLoading ? 'Reassigning...' : 'Reassign Asset'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Current Device:</span> {assetToReassign?.name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Category:</span> {assetToReassign?.category}
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Select User to Assign To *</label>
            
            <div className="relative">
              <button
                type="button"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left bg-white hover:bg-gray-50"
                onClick={() => setShowReassignDropdown(!showReassignDropdown)}
              >
                {reassignSelectedUserId 
                  ? reassignAvailableUsers.find(u => u.id === reassignSelectedUserId)?.name
                  : '-- Choose a user --'
                }
              </button>

              {showReassignDropdown && (
                <div className="absolute z-10 w-full mt-1 border border-gray-300 rounded-lg bg-white shadow-lg">
                  <Input
                    placeholder="Search by name or email..."
                    fullWidth
                    value={reassignUserSearch}
                    onChange={(e) => setReassignUserSearch(e.target.value)}
                    className="rounded-b-none border-b"
                  />
                  
                  <div className="max-h-60 overflow-y-auto">
                    {reassignAvailableUsers
                      .filter(user => 
                        user.name.toLowerCase().includes(reassignUserSearch.toLowerCase()) ||
                        user.email.toLowerCase().includes(reassignUserSearch.toLowerCase())
                      )
                      .map(user => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => {
                            setReassignSelectedUserId(user.id)
                            setShowReassignDropdown(false)
                            setReassignUserSearch('')
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                        >
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email} - {user.role}</p>
                        </button>
                      ))}
                    
                    {reassignAvailableUsers.filter(user => 
                      user.name.toLowerCase().includes(reassignUserSearch.toLowerCase()) ||
                      user.email.toLowerCase().includes(reassignUserSearch.toLowerCase())
                    ).length === 0 && (
                      <div className="px-4 py-3 text-center text-gray-500 text-sm">
                        No users found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export const MaintenancePage: React.FC = () => {
  const { records, loading, fetchMaintenanceRecords, addMaintenanceRecord } = useMaintenance()
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selectedAssetId, setSelectedAssetId] = useState(() => {
    // Load from localStorage on initial render
    return localStorage.getItem('maintenanceSelectedAssetId') || ''
  })
  const [assets, setAssets] = useState<any[]>([])
  const [scheduling, setScheduling] = useState(false)
  const [scheduleFormData, setScheduleFormData] = useState({
    assetId: '',
    type: '',
    date: '',
    cost: '',
    performedBy: '',
    notes: '',
  })
  const [scheduleMessage, setScheduleMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // View and complete maintenance state
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null)
  const [completing, setCompleting] = useState(false)
  const [completeMessage, setCompleteMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/assets', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!response.ok) throw new Error('Failed to fetch assets')
        
        const data = await response.json()
        setAssets(data.data || data || [])
      } catch (err: any) {
        console.error('Error fetching assets:', err)
      }
    }

    fetchAssets()
  }, [])

  useEffect(() => {
    if (selectedAssetId) {
      fetchMaintenanceRecords(selectedAssetId)
      // Save to localStorage
      localStorage.setItem('maintenanceSelectedAssetId', selectedAssetId)
    } else {
      // Clear localStorage if no asset selected
      localStorage.removeItem('maintenanceSelectedAssetId')
    }
  }, [selectedAssetId, fetchMaintenanceRecords])

  const displayRecords = selectedAssetId ? records : []

  const handleScheduleMaintenance = async () => {
    try {
      // Validation
      if (!scheduleFormData.assetId || !scheduleFormData.type || !scheduleFormData.date) {
        setScheduleMessage({ type: 'error', text: 'Asset, Type, and Date are required' })
        return
      }

      // Check if maintenance is already scheduled for this asset
      if (records.some(r => r.assetId === scheduleFormData.assetId)) {
        setScheduleMessage({ type: 'error', text: 'Maintenance is already scheduled for this device. Complete or delete the existing record first.' })
        return
      }

      setScheduling(true)
      setScheduleMessage(null)
      
      // Capture asset ID before clearing form
      const scheduledAssetId = scheduleFormData.assetId

      // Update asset status to MAINTENANCE
      const updateAssetResponse = await fetch(`http://localhost:5000/api/assets/${scheduledAssetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'MAINTENANCE' })
      })

      if (!updateAssetResponse.ok) {
        throw new Error('Failed to update asset status')
      }

      const maintenanceData = {
        type: scheduleFormData.type,
        date: scheduleFormData.date,
        cost: parseFloat(scheduleFormData.cost) || 0,
        performedBy: scheduleFormData.performedBy,
        description: scheduleFormData.notes,
      }

      await addMaintenanceRecord(scheduledAssetId, maintenanceData)

      setScheduleMessage({ type: 'success', text: 'Maintenance scheduled successfully!' })
      setScheduleFormData({ assetId: '', type: '', date: '', cost: '', performedBy: '', notes: '' })
      
      setTimeout(() => {
        setShowModal(false)
        setScheduleMessage(null)
        // Set selected asset to the one we just scheduled maintenance for
        setSelectedAssetId(scheduledAssetId)
        // Fetch the updated maintenance records
        fetchMaintenanceRecords(scheduledAssetId)
      }, 1500)
    } catch (error: any) {
      setScheduleMessage({ type: 'error', text: error.message || 'Failed to schedule maintenance' })
    } finally {
      setScheduling(false)
    }
  }

  const handleViewMaintenance = (record: any) => {
    setSelectedMaintenance(record)
    setShowViewModal(true)
  }

  const handleCompleteMaintenance = async (recordId: string) => {
    try {
      setCompleting(true)
      setCompleteMessage(null)

      // First, update the asset status back to ACTIVE
      const assetId = selectedMaintenance.assetId
      const updateAssetResponse = await fetch(`http://localhost:5000/api/assets/${assetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'ACTIVE' })
      })

      if (!updateAssetResponse.ok) {
        throw new Error('Failed to update asset status')
      }

      // Then delete the maintenance record
      const response = await fetch(`http://localhost:5000/api/maintenance/${recordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        setCompleteMessage({ type: 'success', text: 'Maintenance completed! Device is now active.' })
        // Refresh maintenance records
        if (selectedAssetId) {
          fetchMaintenanceRecords(selectedAssetId)
        }
        setTimeout(() => {
          setShowViewModal(false)
          setCompleteMessage(null)
        }, 1500)
      } else {
        const data = await response.json()
        setCompleteMessage({ type: 'error', text: data.error || 'Failed to complete maintenance' })
      }
    } catch (error: any) {
      setCompleteMessage({ type: 'error', text: error.message || 'An error occurred' })
    } finally {
      setCompleting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">🔧 Maintenance Management</h1>
          <p className="text-gray-600 mt-2">Schedule and track asset maintenance</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          📅 Schedule Maintenance
        </Button>
      </div>

      {/* Asset Filter */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">Select Asset to View Maintenance Records</label>
        <Select
          options={[
            { value: '', label: '🔍 All Assets' },
            ...assets.map(asset => ({ value: asset.id, label: `${asset.name} (${asset.assetTag})` }))
          ]}
          value={selectedAssetId}
          onChange={(e) => setSelectedAssetId(e.target.value)}
        />
      </div>

      {loading ? (
        <Spinner message="Loading maintenance records..." />
      ) : displayRecords.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🔧</span>
            <p className="text-gray-600 text-lg font-medium">
              {selectedAssetId ? 'No maintenance records for this asset' : 'Select an asset to view maintenance records'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {selectedAssetId ? 'Start by scheduling maintenance for this asset' : 'Choose an asset from the dropdown above'}
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Maintenance Records ({displayRecords.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <Table
                headers={['Asset', 'Type', 'Date', 'Cost', 'Performed By', 'Actions']}
                data={displayRecords.map((record: any) => ({
                  Asset: <span className="font-medium text-gray-800">{record.asset?.name || 'Unknown'}</span>,
                  Type: <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">{capitalize(record.type)}</span>,
                  Date: <span className="text-gray-600">{formatDate(new Date(record.date))}</span>,
                  Cost: <span className="font-semibold text-green-600">{formatCurrency(record.cost)}</span>,
                  'Performed By': <span className="text-gray-600">{record.performedBy || 'N/A'}</span>,
                  Actions: (
                    <div className="flex gap-2">
                      <button 
                        className="flex flex-col items-center justify-center text-purple-600 hover:text-purple-700 transition-colors"
                        onClick={() => handleViewMaintenance(record)}
                        title="View Details"
                      >
                        <MdRemoveRedEye className="text-2xl" />
                        <span className="text-[10px] leading-tight text-gray-700">View</span>
                      </button>
                      <button 
                        className="flex flex-col items-center justify-center text-green-600 hover:text-green-700 transition-colors"
                        onClick={() => {
                          setSelectedMaintenance(record)
                          handleCompleteMaintenance(record.id)
                        }}
                        disabled={completing}
                        title="Mark Complete"
                      >
                        <MdDone className="text-2xl" />
                        <span className="text-[10px] leading-tight text-gray-700">Complete</span>
                      </button>
                    </div>
                  ),
                }))}
              />
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Schedule Maintenance Modal */}
      <Modal
        isOpen={showModal}
        title="Schedule Maintenance"
        onClose={() => setShowModal(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={scheduling}>
              Cancel
            </Button>
            <Button 
              onClick={handleScheduleMaintenance}
              disabled={scheduling}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            >
              {scheduling ? 'Scheduling...' : 'Schedule'}
            </Button>
          </>
        }
      >
        {scheduleMessage && (
          <div className={`mb-4 p-3 rounded-lg border ${
            scheduleMessage.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {scheduleMessage.text}
          </div>
        )}
        <form className="space-y-4">
          <Select
            label="Asset"
            options={assets.map(asset => ({ value: asset.id, label: `${asset.name} (${asset.assetTag})` }))}
            value={scheduleFormData.assetId}
            onChange={(e) => setScheduleFormData({ ...scheduleFormData, assetId: e.target.value })}
          />
          <Select
            label="Maintenance Type"
            options={[
              { value: 'ROUTINE', label: 'Routine' },
              { value: 'REPAIR', label: 'Repair' },
              { value: 'INSPECTION', label: 'Inspection' },
            ]}
            value={scheduleFormData.type}
            onChange={(e) => setScheduleFormData({ ...scheduleFormData, type: e.target.value })}
          />
          <Input 
            label="Scheduled Date" 
            type="date" 
            fullWidth 
            value={scheduleFormData.date}
            onChange={(e) => setScheduleFormData({ ...scheduleFormData, date: e.target.value })}
          />
          <Input 
            label="Estimated Cost" 
            type="number" 
            placeholder="0.00" 
            fullWidth 
            value={scheduleFormData.cost}
            onChange={(e) => setScheduleFormData({ ...scheduleFormData, cost: e.target.value })}
          />
          <Input 
            label="Performed By" 
            placeholder="Technician name..." 
            fullWidth 
            value={scheduleFormData.performedBy}
            onChange={(e) => setScheduleFormData({ ...scheduleFormData, performedBy: e.target.value })}
          />
          <Input 
            label="Notes" 
            placeholder="Additional notes..." 
            fullWidth 
            value={scheduleFormData.notes}
            onChange={(e) => setScheduleFormData({ ...scheduleFormData, notes: e.target.value })}
          />
        </form>
      </Modal>

      {/* View Maintenance Modal */}
      <Modal
        isOpen={showViewModal}
        title="Maintenance Details"
        onClose={() => setShowViewModal(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowViewModal(false)} disabled={completing}>
              Close
            </Button>
            <Button 
              onClick={() => handleCompleteMaintenance(selectedMaintenance?.id)}
              disabled={completing}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              {completing ? 'Completing...' : 'Mark as Complete'}
            </Button>
          </>
        }
      >
        {completeMessage && (
          <div className={`mb-4 p-3 rounded-lg border ${
            completeMessage.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {completeMessage.text}
          </div>
        )}
        {selectedMaintenance && (
          <div className="space-y-6">
            {/* Asset Information Section */}
            <div className="border-b pb-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Asset Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Asset Name</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedMaintenance.asset?.name || 'Unknown'}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Asset Tag</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedMaintenance.asset?.assetTag || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Maintenance Details Section */}
            <div className="border-b pb-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Maintenance Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                  <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Type</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{capitalize(selectedMaintenance.type)}</span>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                  <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Scheduled Date</p>
                  <p className="text-sm font-semibold text-gray-800">{formatDate(new Date(selectedMaintenance.date))}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Estimated Cost</p>
                  <p className="text-sm font-semibold text-green-600">{formatCurrency(selectedMaintenance.cost)}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                  <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1">Performed By</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedMaintenance.performedBy || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Additional Notes Section */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Additional Notes</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 leading-relaxed">{selectedMaintenance.description || 'No notes provided'}</p>
              </div>
            </div>

            {/* Metadata Section */}
            <div className="border-t pt-4 text-xs text-gray-500 space-y-1">
              <p>Record ID: <span className="font-mono">{selectedMaintenance.id}</span></p>
              <p>Created: {selectedMaintenance.createdAt ? formatDate(new Date(selectedMaintenance.createdAt)) : 'N/A'}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ============ PROFILE PAGE ============

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loadingUser, setLoadingUser] = useState(false)
  
  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  
  // Password visibility state
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Ensure user data is loaded
  useEffect(() => {
    const loadUserData = async () => {
      if (!user && localStorage.getItem('token')) {
        setLoadingUser(true)
        try {
          const response = await fetch('http://localhost:5000/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
            setEditedUser({
              name: data.user.name || '',
              email: data.user.email || '',
            })
          }
        } catch (err) {
          console.error('Failed to load user data:', err)
        } finally {
          setLoadingUser(false)
        }
      } else if (user) {
        setEditedUser({
          name: user.name || '',
          email: user.email || '',
        })
      }
    }

    loadUserData()
  }, [user, setUser])

  const handleSaveProfile = async () => {
    if (!user?.id) return
    
    try {
      setSaving(true)
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: editedUser.name,
          email: editedUser.email
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        useAuthStore.getState().setUser(data)
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        setIsEditing(false)
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: data.error || data.message || 'Failed to update profile' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    // Validation
    if (!passwordForm.oldPassword) {
      setPasswordError('Please enter your old password')
      return
    }
    if (!passwordForm.newPassword) {
      setPasswordError('Please enter a new password')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    try {
      setChangingPassword(true)
      setPasswordError(null)

      const response = await fetch(`http://localhost:5000/api/users/${user?.id}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
        setShowPasswordChange(false)
        setTimeout(() => setMessage(null), 3000)
      } else {
        setPasswordError(data.error || data.message || 'Failed to change password')
      }
    } catch (error: any) {
      setPasswordError(error.message || 'An error occurred')
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and information</p>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 p-8 flex items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl font-bold text-indigo-600">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="text-white flex-1">
            <h2 className="text-3xl font-bold">{user?.name}</h2>
            <p className="text-indigo-100 mt-1">{user?.email}</p>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span className="bg-indigo-400 px-3 py-1 rounded-full text-sm font-semibold">
                Role: {user?.role}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                user?.status === 'ACTIVE' 
                  ? 'bg-green-400 text-white' 
                  : user?.status === 'INACTIVE'
                  ? 'bg-orange-400 text-white'
                  : 'bg-gray-400 text-white'
              }`}>
                Status: {(user?.status || 'ACTIVE').charAt(0).toUpperCase() + (user?.status || 'ACTIVE').slice(1).toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Information */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded"></div>
                Personal Information
              </h3>

              {isEditing ? (
                <>
                  <Input
                    label="Full Name"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    fullWidth
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    fullWidth
                  />
                </>
              ) : (
                <>
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-3 rounded-lg border border-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all duration-300">
                    <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-0.5">Full Name</p>
                    <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-0.5">Email Address</p>
                    <p className="text-sm font-mono text-gray-800 break-words">{user?.email}</p>
                  </div>
                </>
              )}
            </div>

            {/* Account Information */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-600 to-blue-400 rounded"></div>
                Account Information
              </h3>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-0.5">User ID</p>
                <p className="text-sm font-mono text-gray-800">{user?.id}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all duration-300">
                <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-0.5">Role</p>
                <p className="text-sm font-semibold text-gray-800">{capitalize(user?.role || 'Employee')}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100 hover:border-green-300 hover:shadow-md transition-all duration-300">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-0.5">Status</p>
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${user?.status === 'ACTIVE' ? 'bg-green-200 text-green-800' : user?.status === 'INACTIVE' ? 'bg-orange-200 text-orange-800' : 'bg-red-200 text-red-800'}`}>
                  {user?.status ? capitalize(user.status) : 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Account Dates */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-purple-600 to-purple-400 rounded"></div>
              Account Activity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all duration-300">
                <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1.5">Account Created</p>
                <p className="text-sm font-semibold text-purple-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-xs text-purple-600 mt-0.5">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleTimeString() : ''}
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-3 rounded-lg border border-pink-100 hover:border-pink-300 hover:shadow-md transition-all duration-300">
                <p className="text-xs font-semibold text-pink-700 uppercase tracking-wide mb-1.5">Last Updated</p>
                <p className="text-sm font-semibold text-pink-900">
                  {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-xs text-pink-600 mt-0.5">
                  {user?.updatedAt ? new Date(user.updatedAt).toLocaleTimeString() : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3 flex-wrap">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm px-4 py-2"
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false)
                    setEditedUser({ name: user?.name || '', email: user?.email || '' })
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6">
          <h3 className="text-2xl font-bold text-white">🔐 Security Settings</h3>
          <p className="text-orange-100 mt-1">Manage your password and security preferences</p>
        </div>

        <div className="p-6">
          {!showPasswordChange ? (
            <div className="space-y-4">
              <p className="text-gray-700">
                To keep your account secure, you should change your password regularly.
              </p>
              <Button
                onClick={() => {
                  setShowPasswordChange(true)
                  setPasswordError(null)
                  setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
                }}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                Change Password
              </Button>
            </div>
          ) : (
            <div className="space-y-6 max-w-md">
              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                  {passwordError}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    placeholder="Enter your current password"
                    value={passwordForm.oldPassword}
                    onChange={(e) => {
                      setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                      setPasswordError(null)
                    }}
                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showOldPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">You must confirm your current password before changing it</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    value={passwordForm.newPassword}
                    onChange={(e) => {
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      setPasswordError(null)
                    }}
                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters recommended</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => {
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      setPasswordError(null)
                    }}
                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                >
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </Button>
                <Button
                  onClick={() => {
                    setShowPasswordChange(false)
                    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
                    setPasswordError(null)
                  }}
                  disabled={changingPassword}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">🛡️ Security Tips</h3>
        <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
          <li>Use a strong password with uppercase, lowercase, numbers, and symbols</li>
          <li>Change your password every 90 days</li>
          <li>Never share your password with anyone</li>
          <li>Log out from other devices if you suspect unauthorized access</li>
        </ul>
      </div>
    </div>
  )
}

// ============ REPORTS PAGE ============

export const ReportsPage: React.FC = () => {
  const { assets, loading: assetsLoading, fetchAssets } = useAssets()
  const [maintenanceRecords, setMaintenanceRecords] = useState<any[]>([])
  const [loadingMaintenance, setLoadingMaintenance] = useState(false)

  const fetchAllMaintenance = useCallback(async () => {
    try {
      setLoadingMaintenance(true)
      const response = await fetch('http://localhost:5000/api/maintenance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setMaintenanceRecords(data || [])
      } else {
        console.error('Failed to fetch maintenance records:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching maintenance:', error)
    } finally {
      setLoadingMaintenance(false)
    }
  }, [])

  useEffect(() => {
    fetchAssets()
    fetchAllMaintenance()
  }, [fetchAssets, fetchAllMaintenance])

  const totalAssets = assets.length
  const activeAssets = assets.filter(a => a.status === 'ACTIVE').length
  const maintenanceAssets = assets.filter(a => a.status === 'MAINTENANCE').length
  const inactiveAssets = assets.filter(a => a.status === 'INACTIVE' || a.status === 'RETIRED').length

  const totalMaintenanceCost = maintenanceRecords.reduce((sum, record) => sum + (record.cost || 0), 0)
  const totalAssets_Value = assets.reduce((sum, asset) => sum + (asset.purchasePrice || 0), 0)
  const maintenanceByType = maintenanceRecords.reduce((acc: any, record) => {
    acc[record.type] = (acc[record.type] || 0) + 1
    return acc
  }, {})

  const exportToExcel = (assetsData: any[], maintenanceData: any[]) => {
    const workbook = XLSX.utils.book_new()

    // Summary sheet
    const summaryData = [
      ['ASSET MANAGEMENT SYSTEM - REPORTS'],
      ['Generated on', new Date().toLocaleDateString()],
      [],
      ['SUMMARY STATISTICS'],
      ['Metric', 'Value'],
      ['Total Assets', totalAssets],
      ['Active Assets', activeAssets],
      ['Assets in Maintenance', maintenanceAssets],
      ['Inactive/Retired Assets', inactiveAssets],
      ['Total Asset Value', totalAssets_Value],
      ['Total Maintenance Cost', totalMaintenanceCost],
    ]
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

    // Assets sheet
    const assetsDataForExport = assetsData.map(asset => ({
      'Asset Name': asset.name,
      'Category': asset.category,
      'Location': asset.location,
      'Status': asset.status,
      'Purchase Price': asset.purchasePrice,
      'Assigned To': asset.userAssigned || 'Unassigned',
      'Created Date': formatDate(asset.createdAt)
    }))
    const assetsSheet = XLSX.utils.json_to_sheet(assetsDataForExport)
    XLSX.utils.book_append_sheet(workbook, assetsSheet, 'Assets')

    // Maintenance sheet
    const maintenanceDataForExport = maintenanceData.map(record => ({
      'Asset': record.asset?.name || 'Unknown',
      'Type': record.type,
      'Date': formatDate(record.date),
      'Cost': record.cost,
      'Performed By': record.performedBy || 'N/A',
      'Description': record.description || 'N/A'
    }))
    const maintenanceSheet = XLSX.utils.json_to_sheet(maintenanceDataForExport)
    XLSX.utils.book_append_sheet(workbook, maintenanceSheet, 'Maintenance')

    XLSX.writeFile(workbook, `Asset-Management-Report-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const exportToPDF = (assetsData: any[], maintenanceData: any[]) => {
    try {
      const pdf = new jsPDF() as any
      const pageWidth = pdf.internal.pageSize.getWidth()
      let yPosition = 20

      // Title
      pdf.setFontSize(20)
      pdf.text('Asset Management System Report', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 15

      // Date
      pdf.setFontSize(10)
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 15

      // Summary Section
      pdf.setFontSize(14)
      pdf.text('Summary Statistics', 20, yPosition)
      yPosition += 10

      pdf.setFontSize(11)
      const summaryData = [
        ['Metric', 'Value'],
        ['Total Assets', totalAssets.toString()],
        ['Active Assets', activeAssets.toString()],
        ['Assets in Maintenance', maintenanceAssets.toString()],
        ['Inactive/Retired', inactiveAssets.toString()],
        ['Total Asset Value', `R ${totalAssets_Value.toFixed(2)}`],
        ['Total Maintenance Cost', `R ${totalMaintenanceCost.toFixed(2)}`],
      ]
      
      if (typeof pdf.autoTable === 'function') {
        pdf.autoTable({
          head: [summaryData[0]],
          body: summaryData.slice(1),
          startY: yPosition,
          margin: { left: 20, right: 20 },
        })
        yPosition = pdf.lastAutoTable.finalY + 15
      } else {
        // Fallback: create simple text table
        yPosition += 5
        summaryData.forEach((row, idx) => {
          pdf.text(row.join('  |  '), 20, yPosition)
          yPosition += 7
        })
      }

      // Assets Section
      if (assetsData.length > 0) {
        pdf.setFontSize(14)
        pdf.text('Top Assets by Value', 20, yPosition)
        yPosition += 10

        const assetsTableData = assetsData
          .sort((a, b) => (b.purchasePrice || 0) - (a.purchasePrice || 0))
          .slice(0, 10)
          .map(asset => [
            asset.name,
            asset.category,
            asset.location,
            asset.status,
            `R ${asset.purchasePrice.toFixed(2)}`
          ])

        if (typeof pdf.autoTable === 'function') {
          pdf.autoTable({
            head: [['Asset Name', 'Category', 'Location', 'Status', 'Value']],
            body: assetsTableData,
            startY: yPosition,
            margin: { left: 20, right: 20 },
          })
          yPosition = pdf.lastAutoTable.finalY + 15
        } else {
          yPosition += 5
          assetsTableData.forEach((row, idx) => {
            pdf.text(row.join('  |  '), 20, yPosition)
            yPosition += 7
          })
        }
      }

      // Maintenance Section
      if (maintenanceData.length > 0) {
        pdf.setFontSize(14)
        pdf.text('Recent Maintenance Records', 20, yPosition)
        yPosition += 10

        const maintenanceTableData = maintenanceData
          .slice(0, 10)
          .map(record => [
            record.asset?.name || 'Unknown',
            record.type,
            formatDate(record.date),
            `R ${record.cost.toFixed(2)}`,
            record.performedBy || 'N/A'
          ])

        if (typeof pdf.autoTable === 'function') {
          pdf.autoTable({
            head: [['Asset', 'Type', 'Date', 'Cost', 'Technician']],
            body: maintenanceTableData,
            startY: yPosition,
            margin: { left: 20, right: 20 },
          })
        } else {
          maintenanceTableData.forEach((row, idx) => {
            pdf.text(row.join('  |  '), 20, yPosition)
            yPosition += 7
          })
        }
      }

      pdf.save(`Asset-Management-Report-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (err: any) {
      console.error('PDF export error:', err?.message || err)
      alert(`PDF export failed: ${err?.message || 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Container with max-width for better alignment */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-8 pb-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">Reports & Analytics</h1>
            <p className="text-gray-600 text-lg">Comprehensive asset and maintenance insights</p>
          </div>
          {/* Export Buttons */}
          <div className="flex gap-3 flex-wrap justify-start md:justify-end w-full md:w-auto">
            <button
              onClick={() => exportToExcel(assets, maintenanceRecords)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 whitespace-nowrap"
            >
              <MdDownload className="text-lg" /> Excel
            </button>
            <button
              onClick={() => exportToPDF(assets, maintenanceRecords)}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 whitespace-nowrap"
            >
              <MdDownload className="text-lg" /> PDF
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 whitespace-nowrap"
            >
              <MdPrint className="text-lg" /> Print
            </button>
          </div>
        </div>

        {/* Summary Cards - Better Alignment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-600 hover:shadow-lg transition-all p-3 md:p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Total Assets</p>
                <p className="text-2xl md:text-3xl font-bold text-blue-600 mt-1">{totalAssets}</p>
                <p className="text-xs text-gray-500 mt-0.5">All devices</p>
              </div>
              <MdInventory2 className="text-3xl md:text-4xl text-blue-500 opacity-15 flex-shrink-0" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white border-l-4 border-green-600 hover:shadow-lg transition-all p-3 md:p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Active Assets</p>
                <p className="text-2xl md:text-3xl font-bold text-green-600 mt-1">{activeAssets}</p>
                <p className="text-xs text-gray-500 mt-0.5">{totalAssets > 0 ? Math.round((activeAssets / totalAssets) * 100) : 0}% operational</p>
              </div>
              <MdCheckCircle className="text-3xl md:text-4xl text-green-500 opacity-15 flex-shrink-0" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-white border-l-4 border-amber-600 hover:shadow-lg transition-all p-3 md:p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">In Maintenance</p>
                <p className="text-2xl md:text-3xl font-bold text-amber-600 mt-1">{maintenanceAssets}</p>
                <p className="text-xs text-gray-500 mt-0.5">{totalAssets > 0 ? Math.round((maintenanceAssets / totalAssets) * 100) : 0}% in progress</p>
              </div>
              <MdBuildCircle className="text-3xl md:text-4xl text-amber-500 opacity-15 flex-shrink-0" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-white border-l-4 border-gray-600 hover:shadow-lg transition-all p-3 md:p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Inactive</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-600 mt-1">{inactiveAssets}</p>
                <p className="text-xs text-gray-500 mt-0.5">{totalAssets > 0 ? Math.round((inactiveAssets / totalAssets) * 100) : 0}% retired</p>
              </div>
              <MdUnarchive className="text-3xl md:text-4xl text-gray-500 opacity-15 flex-shrink-0" />
            </div>
          </Card>
        </div>

        {/* Financial Report - Aligned */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-white shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-600 rounded-lg">
                <MdAttachMoney className="text-2xl text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Asset Value Summary</h2>
            </div>
            <div className="space-y-5">
              <div className="flex justify-between items-center pb-4 border-b-2 border-gray-100">
                <span className="text-gray-700 font-medium">Total Value</span>
                <span className="text-2xl font-bold text-green-600">{formatCurrency(totalAssets_Value)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b-2 border-gray-100">
                <span className="text-gray-700 font-medium">Average per Asset</span>
                <span className="text-lg font-semibold text-gray-900">{formatCurrency(totalAssets > 0 ? totalAssets_Value / totalAssets : 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total Assets</span>
                <span className="text-lg font-bold text-gray-900">{totalAssets} units</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-white shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-600 rounded-lg">
                <MdBuildCircle className="text-2xl text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Maintenance Cost Summary</h2>
            </div>
            <div className="space-y-5">
              <div className="flex justify-between items-center pb-4 border-b-2 border-gray-100">
                <span className="text-gray-700 font-medium">Total Cost</span>
                <span className="text-2xl font-bold text-amber-600">{formatCurrency(totalMaintenanceCost)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b-2 border-gray-100">
                <span className="text-gray-700 font-medium">Total Records</span>
                <span className="text-lg font-semibold text-gray-900">{maintenanceRecords.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Average Cost</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(maintenanceRecords.length > 0 ? totalMaintenanceCost / maintenanceRecords.length : 0)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Maintenance by Type - Better Spacing */}
        {Object.keys(maintenanceByType).length > 0 && (
          <Card className="bg-gradient-to-br from-purple-50 to-white shadow-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-purple-600 rounded-lg">
                <MdAnalytics className="text-2xl text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Maintenance Type Distribution</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(maintenanceByType).map(([type, count]) => (
                <div key={type} className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-purple-500">
                  <p className="text-purple-100 text-sm font-semibold uppercase tracking-wide mb-3">{type}</p>
                  <p className="text-4xl font-bold mb-2">{count as number}</p>
                  <div className="w-full bg-purple-400 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-500"
                      style={{ width: `${maintenanceRecords.length > 0 ? ((count as number) / maintenanceRecords.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-purple-200 mt-2">{maintenanceRecords.length > 0 ? Math.round(((count as number) / maintenanceRecords.length) * 100) : 0}% of all maintenance</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Charts Grid - Modern Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Asset Categories Report */}
        <Card className="bg-gradient-to-br from-white to-slate-50 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded"></div>
              Asset Categories
            </h2>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Distribution</span>
          </div>
          <div className="h-96 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={(() => {
                    const categories = assets.reduce((acc: any, asset) => {
                      acc[asset.category] = (acc[asset.category] || 0) + 1
                      return acc
                    }, {})
                    return Object.entries(categories).map(([name, value]) => ({
                      name,
                      value: value as number
                    }))
                  })()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899',
                    '#06b6d4', '#84cc16', '#f97316', '#6366f1'
                  ].map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Cost Trends Chart */}
        {maintenanceRecords.length > 0 && (
          <Card className="bg-gradient-to-br from-white to-slate-50 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-amber-600 to-amber-400 rounded"></div>
                Maintenance Trends
              </h2>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">12 Months</span>
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={(() => {
                    const monthlyData: any = {}
                    maintenanceRecords.forEach(record => {
                      const date = new Date(record.date)
                      const monthKey = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
                      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + record.cost
                    })
                    return Object.entries(monthlyData).map(([month, cost]) => ({
                      month,
                      cost: cost as number
                    }))
                  })()}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value as number)}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', r: 6, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 2 }}
                    name="Monthly Cost"
                    fillOpacity={1}
                    fill="url(#colorCost)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>

      {/* Bottom Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Cost Breakdown by Type */}
        {Object.keys(maintenanceByType).length > 0 && (
          <Card className="bg-gradient-to-br from-white to-slate-50 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-green-600 to-green-400 rounded"></div>
                Cost by Type
              </h2>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Breakdown</span>
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={(() => {
                    const costByType: any = {}
                    maintenanceRecords.forEach(record => {
                      costByType[record.type] = (costByType[record.type] || 0) + record.cost
                    })
                    return Object.entries(costByType).map(([type, cost]) => ({
                      type,
                      cost: cost as number
                    }))
                  })()}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="type" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value as number)}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="cost" fill="url(#colorGradient)" name="Total Cost" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Asset by Location */}
        {assets.length > 0 && (
          <Card className="bg-gradient-to-br from-white to-slate-50 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded"></div>
                Assets by Location
              </h2>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Geographic</span>
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={(() => {
                    const locationData: any = {}
                    assets.forEach(asset => {
                      locationData[asset.location] = (locationData[asset.location] || 0) + 1
                    })
                    return Object.entries(locationData).map(([location, count]) => ({
                      location,
                      count: count as number
                    }))
                  })()}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="location" stroke="#9ca3af" style={{ fontSize: '12px' }} angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="url(#colorBlue)" name="Assets" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>

      {/* Analytics Tables - Better Alignment */}
      <div className="space-y-6">
        {/* Top Assets by Value */}
        <Card className="bg-gradient-to-br from-white to-gray-50 shadow-md">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-green-600 to-green-400 rounded"></div>
            Top 10 Most Valuable Assets
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-300">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-gray-800">Asset Name</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-800">Category</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-800">Location</th>
                  <th className="text-center px-4 py-3 font-bold text-gray-800">Status</th>
                  <th className="text-right px-4 py-3 font-bold text-gray-800">Value</th>
                </tr>
              </thead>
              <tbody>
                {assets
                .sort((a, b) => (b.purchasePrice || 0) - (a.purchasePrice || 0))
                .slice(0, 10)
                .map((asset) => (
                  <tr key={asset.id} className="border-b hover:bg-green-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{asset.name}</td>
                    <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">{asset.category}</span></td>
                    <td className="px-4 py-3 text-gray-700">{asset.location}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        text={asset.status}
                        variant={
                          asset.status === 'ACTIVE'
                            ? 'success'
                            : asset.status === 'MAINTENANCE'
                            ? 'warning'
                            : 'danger'
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">{formatCurrency(asset.purchasePrice)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Top Maintenance Performers */}
      {maintenanceRecords.length > 0 && (
        <Card className="bg-gradient-to-br from-white to-gray-50 shadow-md">
          <h2 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-orange-600 to-orange-400 rounded"></div>
            Maintenance Technician Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">Most Records Handled</h3>
              <div className="space-y-3">
                {(() => {
                  const technicianRecords: any = {}
                  maintenanceRecords.forEach(record => {
                    const tech = record.performedBy || 'Unassigned'
                    technicianRecords[tech] = (technicianRecords[tech] || 0) + 1
                  })
                  return Object.entries(technicianRecords)
                    .sort((a, b) => (b[1] as number) - (a[1] as number))
                    .slice(0, 5)
                    .map(([tech, count]) => (
                      <div key={tech} className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg border-l-4 border-blue-600">
                        <span className="font-semibold text-gray-900">{tech}</span>
                        <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">{count as number}</span>
                      </div>
                    ))
                })()}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">Highest Cost Handled</h3>
              <div className="space-y-3">
                {(() => {
                  const technicianCosts: any = {}
                  maintenanceRecords.forEach(record => {
                    const tech = record.performedBy || 'Unassigned'
                    technicianCosts[tech] = (technicianCosts[tech] || 0) + (record.cost || 0)
                  })
                  return Object.entries(technicianCosts)
                    .sort((a, b) => (b[1] as number) - (a[1] as number))
                    .slice(0, 5)
                    .map(([tech, cost]) => (
                      <div key={tech} className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-100 to-amber-50 rounded-lg border-l-4 border-amber-600">
                        <span className="font-semibold text-gray-900">{tech}</span>
                        <span className="text-amber-700 font-bold">{formatCurrency(cost as number)}</span>
                      </div>
                    ))
                })()}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Assets Assigned to Employees */}
      {assets.some(a => a.userAssigned) && (
        <Card className="bg-gradient-to-br from-white to-gray-50 shadow-md">
          <h2 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-purple-400 rounded"></div>
            Asset Assignment by Employee
          </h2>
          <div className="space-y-3">
            {(() => {
              const assignmentMap: any = {}
              assets.forEach(asset => {
                if (asset.userAssigned) {
                  assignmentMap[asset.userAssigned] = (assignmentMap[asset.userAssigned] || 0) + 1
                }
              })
              const unassigned = assets.filter(a => !a.userAssigned).length
              
              return (
                <>
                  {Object.entries(assignmentMap)
                    .sort((a, b) => (b[1] as number) - (a[1] as number))
                    .map(([employee, count]) => (
                      <div key={employee} className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-lg border border-purple-200">
                        <div>
                          <p className="font-semibold text-gray-900">{employee}</p>
                          <p className="text-xs text-gray-600">Assigned Assets</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-purple-600">{count as number}</p>
                          </div>
                          <div className="w-2 h-12 bg-gradient-to-b from-purple-600 to-purple-400 rounded"></div>
                        </div>
                      </div>
                    ))}
                  {unassigned > 0 && (
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-transparent rounded-lg border border-orange-200">
                      <div>
                        <p className="font-semibold text-gray-900">Unassigned</p>
                        <p className="text-xs text-gray-600">Not Assigned</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-orange-600">{unassigned}</p>
                        </div>
                        <div className="w-2 h-12 bg-gradient-to-b from-orange-600 to-orange-400 rounded"></div>
                      </div>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        </Card>
      )}

      {/* Recently Added Assets */}
      {assets.length > 0 && (
        <Card className="bg-gradient-to-br from-white to-gray-50 shadow-md">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-600 to-cyan-400 rounded"></div>
            Recently Added Assets
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-gray-800">Asset Name</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-800">Category</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-800">Added Date</th>
                  <th className="text-right px-4 py-3 font-bold text-gray-800">Value</th>
                </tr>
              </thead>
              <tbody>
                {assets
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map((asset) => (
                    <tr key={asset.id} className="border-b hover:bg-cyan-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{asset.name}</td>
                      <td className="px-4 py-3 text-gray-700"><span className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded text-xs font-medium">{asset.category}</span></td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(asset.createdAt)}</td>
                      <td className="px-4 py-3 text-right font-bold text-green-600">{formatCurrency(asset.purchasePrice)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      </div>
      </div>
    </div>
  )
}
