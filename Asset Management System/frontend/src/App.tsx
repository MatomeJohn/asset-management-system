// Frontend Main Application

import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from './store'
import { authAPI } from './services/api'
import { MdDashboard, MdInventory2, MdPeople, MdBuildCircle, MdSettings, MdPalette, MdHelp, MdLogout, MdMenu, MdClose, MdAnalytics } from 'react-icons/md'
import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  AssetsPage,
  UsersPage,
  MaintenancePage,
  ProfilePage,
  ReportsPage,
} from './pages'

// ============ PROTECTED ROUTE WRAPPER ============

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuthStore()
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// ============ LAYOUT WRAPPER ============

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const NavLink = ({ href, icon: Icon, label, color }: { href: string; icon: any; label: string; color: string }) => (
    <a
      href={href}
      onClick={() => setMobileMenuOpen(false)}
      className={`flex items-center gap-3 text-gray-700 hover:text-${color}-700 hover:bg-gradient-to-r hover:from-${color}-50 hover:to-transparent hover:shadow-md transition-all duration-300 block py-3 px-4 rounded-xl font-medium border-l-4 border-transparent hover:border-${color}-600 w-full`}
    >
      <div className={`p-2 bg-${color}-100 rounded-lg`}>
        <Icon className={`text-lg text-${color}-600`} />
      </div>
      <span>{label}</span>
    </a>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-150">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
              <MdInventory2 className="text-white font-bold text-xl md:text-2xl" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent whitespace-nowrap">Asset Management System</h1>
            </div>
          </div>
          
          <nav className="hidden lg:flex gap-2">
            <a
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg font-medium transition-all duration-200 hover:shadow-sm"
            >
              <MdDashboard className="text-xl text-blue-600" /> Dashboard
            </a>
            <a
              href="/assets"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 rounded-lg font-medium transition-all duration-200 hover:shadow-sm"
            >
              <MdInventory2 className="text-xl text-cyan-600" /> Assets
            </a>
            <a
              href="/users"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg font-medium transition-all duration-200 hover:shadow-sm"
            >
              <MdPeople className="text-xl text-purple-600" /> Users
            </a>
            <a
              href="/maintenance"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-lg font-medium transition-all duration-200 hover:shadow-sm"
            >
              <MdBuildCircle className="text-xl text-orange-600" /> Maintenance
            </a>
            <a
              href="/reports"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg font-medium transition-all duration-200 hover:shadow-sm"
            >
              <MdAnalytics className="text-xl text-purple-600" /> Reports
            </a>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 px-3 md:px-4 py-2 rounded-lg border border-gray-200">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold shadow-md">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="hidden sm:flex px-3 md:px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg items-center gap-2"
            >
              <MdLogout className="text-lg" /> <span className="hidden md:inline">Logout</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              {mobileMenuOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-4 py-4 space-y-2">
              <a
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 py-3 px-4 rounded-xl font-medium transition-all duration-300"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MdDashboard className="text-lg text-blue-600" />
                </div>
                Dashboard
              </a>
              <a
                href="/assets"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 py-3 px-4 rounded-xl font-medium transition-all duration-300"
              >
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <MdInventory2 className="text-lg text-cyan-600" />
                </div>
                Assets
              </a>
              <a
                href="/users"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 py-3 px-4 rounded-xl font-medium transition-all duration-300"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MdPeople className="text-lg text-purple-600" />
                </div>
                Users
              </a>
              <a
                href="/maintenance"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-gray-700 hover:bg-orange-50 hover:text-orange-700 py-3 px-4 rounded-xl font-medium transition-all duration-300"
              >
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MdBuildCircle className="text-lg text-orange-600" />
                </div>
                Maintenance
              </a>
              <a
                href="/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 py-3 px-4 rounded-xl font-medium transition-all duration-300"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MdAnalytics className="text-lg text-purple-600" />
                </div>
                Reports
              </a>

              {/* Divider */}
              <div className="my-3 border-t border-gray-200"></div>

              {/* Settings Section */}
              <div className="px-2 py-2 text-xs font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1 h-3 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded"></div> Settings
              </div>
              <a
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 py-3 px-4 rounded-xl cursor-pointer transition-all duration-300 font-medium w-full"
              >
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <MdSettings className="text-lg text-indigo-600" />
                </div>
                Profile
              </a>
              <div className="flex items-center gap-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 py-3 px-4 rounded-xl cursor-pointer transition-all duration-300 font-medium">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <MdPalette className="text-lg text-teal-600" />
                </div>
                Preferences
              </div>
              <div className="flex items-center gap-3 text-gray-700 hover:bg-rose-50 hover:text-rose-700 py-3 px-4 rounded-xl cursor-pointer transition-all duration-300 font-medium">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <MdHelp className="text-lg text-rose-600" />
                </div>
                Help & Support
              </div>

              {/* Divider */}
              <div className="my-3 border-t border-gray-200"></div>

              <button
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-3 px-4 rounded-xl font-medium transition-all duration-300 mt-2"
              >
                <MdLogout className="text-lg" />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Sidebar + Main Content */}
      <div className="flex">
        <aside className="w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 min-h-screen hidden md:block shadow-lg overflow-y-auto">
          <div className="p-4 md:p-6 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-600 to-blue-400 rounded"></div> NAVIGATION
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/dashboard"
                    className="flex items-center gap-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent hover:text-blue-700 hover:shadow-md transition-all duration-300 block py-3 px-4 rounded-xl font-medium border-l-4 border-transparent hover:border-blue-600"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MdDashboard className="text-lg text-blue-600" />
                    </div>
                    <span>Dashboard</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/assets"
                    className="flex items-center gap-3 text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-transparent hover:text-cyan-700 hover:shadow-md transition-all duration-300 block py-3 px-4 rounded-xl font-medium border-l-4 border-transparent hover:border-cyan-600"
                  >
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <MdInventory2 className="text-lg text-cyan-600" />
                    </div>
                    <span>Assets</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/users"
                    className="flex items-center gap-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent hover:text-purple-700 hover:shadow-md transition-all duration-300 block py-3 px-4 rounded-xl font-medium border-l-4 border-transparent hover:border-purple-600"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MdPeople className="text-lg text-purple-600" />
                    </div>
                    <span>Users</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/maintenance"
                    className="flex items-center gap-3 text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent hover:text-orange-700 hover:shadow-md transition-all duration-300 block py-3 px-4 rounded-xl font-medium border-l-4 border-transparent hover:border-orange-600"
                  >
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <MdBuildCircle className="text-lg text-orange-600" />
                    </div>
                    <span>Maintenance</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/reports"
                    className="flex items-center gap-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent hover:text-purple-700 hover:shadow-md transition-all duration-300 block py-3 px-4 rounded-xl font-medium border-l-4 border-transparent hover:border-purple-600"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MdAnalytics className="text-lg text-purple-600" />
                    </div>
                    <span>Reports</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded"></div> SETTINGS
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/profile"
                    className="flex items-center gap-3 text-gray-700 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-transparent px-4 py-3 rounded-xl transition-all duration-300 hover:shadow-md border-l-4 border-transparent hover:border-indigo-600 font-medium"
                  >
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <MdSettings className="text-lg text-indigo-600" />
                    </div>
                    Profile
                  </a>
                </li>
                <li className="flex items-center gap-3 text-gray-700 hover:text-teal-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-transparent px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md border-l-4 border-transparent hover:border-teal-600 font-medium">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <MdPalette className="text-lg text-teal-600" />
                  </div>
                  Preferences
                </li>
                <li className="flex items-center gap-3 text-gray-700 hover:text-rose-700 hover:bg-gradient-to-r hover:from-rose-50 hover:to-transparent px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md border-l-4 border-transparent hover:border-rose-600 font-medium">
                  <div className="p-2 bg-rose-100 rounded-lg">
                    <MdHelp className="text-lg text-rose-600" />
                  </div>
                  Help & Support
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

// ============ MAIN APP COMPONENT ============

const AppContent: React.FC = () => {
  const { token, setUser } = useAuthStore()

  useEffect(() => {
    // Verify token and load user data on app initialization
    const verifyToken = async () => {
      if (token) {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
          const response = await fetch(`${API_URL}/auth/verify`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
          }
        } catch (error) {
          console.error('Failed to verify token:', error)
        }
      }
    }

    verifyToken()
  }, [token, setUser])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/assets"
        element={
          <ProtectedRoute>
            <Layout>
              <AssetsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Layout>
              <UsersPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/maintenance"
        element={
          <ProtectedRoute>
            <Layout>
              <MaintenancePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Layout>
              <ReportsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
