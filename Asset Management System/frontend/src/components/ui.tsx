// Frontend UI Components

import React, { useState } from 'react'

// ============ BUTTON COMPONENT ============

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-60'
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-300 shadow-sm hover:shadow-md',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400 shadow-md hover:shadow-lg',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 disabled:bg-gray-400 shadow-md hover:shadow-lg',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 sm:py-2 text-base sm:text-sm min-h-[44px] sm:min-h-auto',
    lg: 'px-6 py-3 text-lg min-h-[48px]',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className || ''}`}
      disabled={disabled || loading}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {icon}
        {loading ? <span className="animate-spin">⟳</span> : children}
      </div>
    </button>
  )
}

// ============ INPUT COMPONENT ============

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
  icon?: React.ReactNode
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  icon,
  className,
  type = 'text',
  ...props
}) => {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          className={`w-full px-4 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm transition-all duration-200 ${
            error ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
          } ${className || ''}`}
          {...props}
        />
        {icon && <div className="absolute right-3 sm:right-2.5 top-1/2 -translate-y-1/2">{icon}</div>}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

// ============ CARD COMPONENT ============

interface CardProps {
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  footer,
  className,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${className || ''}`}
    >
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div>{children}</div>
      {footer && <div className="mt-4 pt-4 border-t">{footer}</div>}
    </div>
  )
}

// ============ ALERT COMPONENT ============

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
  dismissible?: boolean
}

export const Alert: React.FC<AlertProps> = ({
  type,
  message,
  onClose,
  dismissible = true,
}) => {
  const [visible, setVisible] = useState(true)

  const typeStyles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  }

  const handleClose = () => {
    setVisible(false)
    onClose?.()
  }

  if (!visible) return null

  return (
    <div className={`border rounded-md p-4 ${typeStyles[type]} flex justify-between items-center`}>
      <p>{message}</p>
      {dismissible && (
        <button
          onClick={handleClose}
          className="text-lg font-semibold"
        >
          ✕
        </button>
      )}
    </div>
  )
}

// ============ SPINNER COMPONENT ============

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  message = 'Loading...',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
      />
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  )
}

// ============ BADGE COMPONENT ============

interface BadgeProps {
  text: string
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'gray'
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'primary',
}) => {
  const variantStyles = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
  }

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${variantStyles[variant]}`}>
      {text}
    </span>
  )
}

// ============ MODAL COMPONENT ============

interface ModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  footer,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold truncate pr-2">{title}</h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-2xl font-light text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t flex-shrink-0">{footer}</div>
        )}
      </div>
    </div>
  )
}

// ============ TABLE COMPONENT ============

interface TableProps {
  headers: string[]
  data: any[]
  onRowClick?: (row: any) => void
}

export const Table: React.FC<TableProps> = ({
  headers,
  data,
  onRowClick,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(row)}
              className="border-b hover:bg-gray-50 cursor-pointer"
            >
              {headers.map((header) => (
                <td key={`${idx}-${header}`} className="px-4 py-3 text-sm">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============ SELECT COMPONENT ============

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Array<{ value: string; label: string }>
  error?: string
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-2.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm min-h-[44px] sm:min-h-auto transition-all duration-200 cursor-pointer ${
          error ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
        } ${className || ''}`}
        {...props}
      >
        <option value="">-- Select --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

// ============ PAGINATION COMPONENT ============

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = []
  const maxVisible = 3
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages, start + maxVisible - 1)
  start = Math.max(1, end - maxVisible + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-4 sm:mt-6 flex-wrap">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-xs sm:text-sm px-2 sm:px-3"
      >
        <span className="hidden sm:inline">← Previous</span>
        <span className="sm:hidden">‹</span>
      </Button>

      {start > 1 && (
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(1)}
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            1
          </Button>
          {start > 2 && <span className="px-1">…</span>}
        </>
      )}

      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onPageChange(page)}
          className="text-xs sm:text-sm px-2 sm:px-3"
        >
          {page}
        </Button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1">…</span>}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-xs sm:text-sm px-2 sm:px-3"
      >
        <span className="hidden sm:inline">Next →</span>
        <span className="sm:hidden">›</span>
      </Button>
    </div>
  )
}
