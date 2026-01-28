// Backend Middleware

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// ============ AUTHENTICATION MIDDLEWARE ============

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    ;(req as any).user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// ============ ROLE-BASED ACCESS CONTROL MIDDLEWARE ============

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    next()
  }
}

// ============ VALIDATION MIDDLEWARE ============

export const validateAssetData = (req: Request, res: Response, next: NextFunction) => {
  const { name, assetTag, category, location } = req.body

  const errors: string[] = []

  if (!name || name.trim().length === 0) errors.push('Asset name is required')
  if (!assetTag || assetTag.trim().length === 0) errors.push('Asset tag is required')
  if (!category || category.trim().length === 0) errors.push('Category is required')
  if (!location || location.trim().length === 0) errors.push('Location is required')

  if (errors.length > 0) {
    return res.status(400).json({ errors })
  }

  next()
}

export const validateUserData = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body

  const errors: string[] = []

  if (!name || name.trim().length === 0) errors.push('Name is required')
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required')
  if (!password || password.length < 8) errors.push('Password must be at least 8 characters')

  if (errors.length > 0) {
    return res.status(400).json({ errors })
  }

  next()
}

export const validateMaintenanceData = (req: Request, res: Response, next: NextFunction) => {
  const { type, date, cost } = req.body

  const errors: string[] = []

  if (!type || type.trim().length === 0) errors.push('Maintenance type is required')
  if (!date) errors.push('Date is required')
  if (cost && isNaN(parseFloat(cost))) errors.push('Cost must be a number')

  if (errors.length > 0) {
    return res.status(400).json({ errors })
  }

  next()
}

// ============ RATE LIMITING MIDDLEWARE ============

const rateLimitStore: Record<string, { count: number; resetTime: number }> = {}

export const rateLimitMiddleware = (
  windowMs: number = 15 * 60 * 1000,
  maxRequests: number = 100
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'unknown'
    const now = Date.now()

    if (!rateLimitStore[ip]) {
      rateLimitStore[ip] = { count: 0, resetTime: now + windowMs }
    }

    const record = rateLimitStore[ip]

    if (now > record.resetTime) {
      record.count = 0
      record.resetTime = now + windowMs
    }

    record.count++

    if (record.count > maxRequests) {
      return res.status(429).json({ error: 'Too many requests' })
    }

    next()
  }
}

// ============ CORS MIDDLEWARE ============

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
}

// ============ LOGGING MIDDLEWARE ============

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    const log = `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
    console.log(log)
  })

  next()
}

// ============ ERROR HANDLING MIDDLEWARE ============

export const errorHandler = (
  error: Error | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error)

  const status = error.status || 500
  const message = error.message || 'Internal server error'

  res.status(status).json({
    error: message,
    status,
    timestamp: new Date().toISOString(),
  })
}

// ============ REQUEST PARSING MIDDLEWARE ============

export const parseJSONMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  if (_req.method === 'POST' || _req.method === 'PUT') {
    const contentType = _req.headers['content-type'] || ''
    
    if (!contentType.includes('application/json')) {
      return res.status(400).json({ error: 'Content-Type must be application/json' })
    }
  }

  next()
}

// ============ RESPONSE FORMATTING MIDDLEWARE ============

export const responseFormatter = (_req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json

  res.json = function (data: any) {
    const response = {
      success: res.statusCode < 400,
      data,
      timestamp: new Date().toISOString(),
    }

    return originalJson.call(this, response)
  }

  next()
}

// ============ CACHING MIDDLEWARE ============

const cacheStore: Record<string, { data: any; expiry: number }> = {}

export const cacheMiddleware = (ttl: number = 60000) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    if (_req.method !== 'GET') {
      return next()
    }

    const cacheKey = `${_req.method}:${_req.originalUrl}`
    const cached = cacheStore[cacheKey]

    if (cached && cached.expiry > Date.now()) {
      return res.json(cached.data)
    }

    const originalJson = res.json

    res.json = function (data: any) {
      cacheStore[cacheKey] = {
        data,
        expiry: Date.now() + ttl,
      }

      return originalJson.call(this, data)
    }

    next()
  }
}

// ============ REQUEST CONTEXT MIDDLEWARE ============

export const requestContextMiddleware = (req: Request, res: Response, next: NextFunction) => {
  ;(req as any).id = Math.random().toString(36).substring(7)
  ;(req as any).startTime = Date.now()

  next()
}

// ============ PAGINATION MIDDLEWARE ============

export const paginationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10))

  ;(req as any).pagination = { page, limit }

  next()
}

// ============ INPUT SANITIZATION MIDDLEWARE ============

export const sanitizeInputMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .replace(/[<>]/g, '')
        .trim()
    }
    if (typeof obj === 'object' && obj !== null) {
      return Object.keys(obj).reduce((acc, key) => {
        acc[key] = sanitize(obj[key])
        return acc
      }, {} as any)
    }
    return obj
  }

  req.body = sanitize(req.body)
  req.query = sanitize(req.query)
  req.params = sanitize(req.params)

  next()
}
