// Backend Express Server

import express, { Express } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes'
import {
  corsMiddleware,
  loggingMiddleware,
  rateLimitMiddleware,
  parseJSONMiddleware,
  sanitizeInputMiddleware,
  paginationMiddleware,
  errorHandler,
} from './middleware'

// Load environment variables
dotenv.config()

const app: Express = express()
const port = process.env.PORT || 5000

// ============ MIDDLEWARE SETUP ============

// CORS
app.use(corsMiddleware)
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
  ],
  credentials: true,
}))

// Logging
app.use(loggingMiddleware)

// Request parsing
app.use(express.json())
app.use(parseJSONMiddleware)

// Input sanitization
app.use(sanitizeInputMiddleware)

// Rate limiting
app.use(rateLimitMiddleware(15 * 60 * 1000, 500))

// Pagination
app.use(paginationMiddleware)

// ============ ROUTES ============

app.use('/api', routes)

// Health check
app.get('/', (_req, res) => {
  res.json({
    message: 'Asset Management System API',
    version: '1.0.0',
    status: 'running',
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  })
})

// Error handling middleware
app.use(errorHandler)

// ============ SERVER STARTUP ============

app.listen(port, () => {
  console.log(`✓ Server is running on port ${port}`)
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`✓ Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  process.exit(0)
})

export default app
