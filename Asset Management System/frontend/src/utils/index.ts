// Frontend Utility Functions

// ============ DATE & TIME UTILITIES ============

export const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatTime = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export const daysUntil = (date: string | Date): number => {
  const now = new Date()
  const d = new Date(date)
  const diff = d.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export const daysAgo = (date: string | Date): number => {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export const isOverdue = (dueDate: string | Date): boolean => {
  return new Date(dueDate) < new Date()
}

// ============ STRING UTILITIES ============

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const truncate = (str: string, len: number): string => {
  if (str.length <= len) return str
  return str.slice(0, len - 3) + '...'
}

export const toTitleCase = (str: string): string => {
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ')
}

export const camelToKebab = (str: string): string => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

export const kebabToCamel = (str: string): string => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

// ============ NUMBER & CURRENCY UTILITIES ============

export const formatCurrency = (
  amount: number,
  currency: string = 'ZAR'
): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency,
  }).format(amount)
}

export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals)
}

export const roundNumber = (num: number, decimals: number = 2): number => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export const abbreviateNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export const calculatePercentage = (part: number, total: number): number => {
  return total === 0 ? 0 : (part / total) * 100
}

// ============ VALIDATION UTILITIES ============

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  )
}

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/
  return phoneRegex.test(phone)
}

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const isEmptyString = (str: string): boolean => {
  return str.trim().length === 0
}

export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

export const validateAssetData = (data: any): string[] => {
  const errors: string[] = []
  if (!data.name || isEmptyString(data.name)) errors.push('Asset name is required')
  if (!data.assetTag || isEmptyString(data.assetTag)) errors.push('Asset tag is required')
  if (!data.category || isEmptyString(data.category)) errors.push('Category is required')
  if (!data.location || isEmptyString(data.location)) errors.push('Location is required')
  if (data.purchasePrice && data.purchasePrice < 0) errors.push('Purchase price cannot be negative')
  return errors
}

export const validateUserData = (data: any): string[] => {
  const errors: string[] = []
  if (!data.name || isEmptyString(data.name)) errors.push('Name is required')
  if (!data.email || !isValidEmail(data.email)) errors.push('Valid email is required')
  if (!data.role) errors.push('Role is required')
  return errors
}

// ============ STORAGE UTILITIES ============

export const getFromLocalStorage = <T,>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

export const saveToLocalStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to remove from localStorage:', error)
  }
}

export const clearLocalStorage = (): void => {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}

// ============ ARRAY UTILITIES ============

export const sortByDate = <T extends { date?: string }>(
  arr: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] => {
  return [...arr].sort((a, b) => {
    const dateA = new Date(a.date || '').getTime()
    const dateB = new Date(b.date || '').getTime()
    return order === 'asc' ? dateA - dateB : dateB - dateA
  })
}

export const sortByProperty = <T>(
  arr: T[],
  property: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...arr].sort((a, b) => {
    const aVal = a[property]
    const bVal = b[property]
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

export const filterByProperty = <T>(
  arr: T[],
  property: keyof T,
  value: any
): T[] => {
  return arr.filter((item) => item[property] === value)
}

export const filterByMultiple = <T>(
  arr: T[],
  filters: Record<keyof T, any>
): T[] => {
  return arr.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      return item[key as keyof T] === value
    })
  })
}

export const uniqueBy = <T>(arr: T[], property: keyof T): T[] => {
  const seen = new Set()
  return arr.filter((item) => {
    const value = item[property]
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}

export const groupBy = <T>(
  arr: T[],
  property: keyof T
): Record<string, T[]> => {
  return arr.reduce((acc, item) => {
    const key = String(item[property])
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {} as Record<string, T[]>)
}

export const paginate = <T>(
  arr: T[],
  page: number,
  pageSize: number
): T[] => {
  const start = (page - 1) * pageSize
  return arr.slice(start, start + pageSize)
}

// ============ OBJECT UTILITIES ============

export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

export const mergeObjects = <T extends Record<string, any>>(
  ...objects: T[]
): T => {
  return Object.assign({}, ...objects)
}

export const getNestedProperty = (obj: any, path: string): any => {
  return path.split('.').reduce((current, prop) => current?.[prop], obj)
}

export const setNestedProperty = (
  obj: any,
  path: string,
  value: any
): void => {
  const keys = path.split('.')
  const lastKey = keys.pop()
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {}
    return current[key]
  }, obj)
  if (lastKey) target[lastKey] = value
}

// ============ COMPARISON UTILITIES ============

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export const isWithinDateRange = (
  date: Date,
  startDate: Date,
  endDate: Date
): boolean => {
  return date >= startDate && date <= endDate
}

export const compareObjects = <T>(obj1: T, obj2: T): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

// ============ SORTING & FILTERING UTILITIES ============

export const searchInArray = <T>(
  arr: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] => {
  const term = searchTerm.toLowerCase()
  return arr.filter((item) =>
    searchFields.some((field) =>
      String(item[field]).toLowerCase().includes(term)
    )
  )
}

export const filterAssetsByStatus = (
  assets: any[],
  status: string
): any[] => {
  return assets.filter((asset) => asset.status === status)
}

export const filterAssetsByDateRange = (
  assets: any[],
  startDate: Date,
  endDate: Date
): any[] => {
  return assets.filter((asset) =>
    isWithinDateRange(new Date(asset.purchaseDate), startDate, endDate)
  )
}

export const calculateAssetDepreciation = (
  purchasePrice: number,
  years: number,
  depreciationRate: number = 0.1
): number => {
  return purchasePrice * Math.pow(1 - depreciationRate, years)
}

// ============ GENERAL UTILITIES ============

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) throw error
    await new Promise((resolve) => setTimeout(resolve, delay))
    return retry(fn, retries - 1, delay * 2)
  }
}

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11)
}

export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
