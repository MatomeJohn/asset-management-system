// Backend Routes

import { Router, Request, Response } from 'express'
import {
  AuthService,
  AssetService,
  UserService,
  MaintenanceService,
  DashboardService,
} from '../services'
import { authMiddleware, roleMiddleware } from '../middleware'

const router = Router()

// ============ HEALTH CHECK ============

router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() })
})

// ============ AUTH ROUTES ============

router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body
    const result = await AuthService.register(name, email, password)
    res.status(201).json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const result = await AuthService.login(email, password)
    res.json(result)
  } catch (error: any) {
    res.status(401).json({ error: error.message })
  }
})

router.post('/auth/verify', authMiddleware, async (_req: Request, res: Response) => {
  res.json({ valid: true, user: (_req as any).user })
})

router.get('/auth/verify', authMiddleware, async (_req: Request, res: Response) => {
  res.json({ valid: true, user: (_req as any).user })
})

// ============ ASSET ROUTES ============

router.get('/assets', authMiddleware, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const filters = {
      status: req.query.status,
      category: req.query.category,
      location: req.query.location,
    }
    const result = await AssetService.getAssets(page, limit, filters)
    res.json(result)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/assets/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const asset = await AssetService.getAssetById(req.params.id)
    res.json(asset)
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
})

router.post(
  '/assets',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const asset = await AssetService.createAsset(req.body)
      res.status(201).json(asset)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
)

router.put(
  '/assets/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const asset = await AssetService.updateAsset(req.params.id, req.body)
      res.json(asset)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
)

router.delete(
  '/assets/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      await AssetService.deleteAsset(req.params.id)
      res.json({ success: true })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
)

router.get('/assets/search/:query', authMiddleware, async (req: Request, res: Response) => {
  try {
    const results = await AssetService.searchAssets(req.params.query)
    res.json(results)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// ============ MAINTENANCE ROUTES ============

router.get(
  '/maintenance',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const records = await MaintenanceService.getAllMaintenance()
      res.json(records)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

router.get(
  '/maintenance/asset/:assetId',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const records = await MaintenanceService.getMaintenanceByAsset(req.params.assetId)
      res.json(records)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

router.post(
  '/maintenance/:assetId',
  authMiddleware,
  roleMiddleware(['ADMIN', 'MANAGER']),
  async (req: Request, res: Response) => {
    try {
      const record = await MaintenanceService.addMaintenance(req.params.assetId, req.body)
      res.status(201).json(record)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
)

router.put(
  '/maintenance/:id',
  authMiddleware,
  roleMiddleware(['ADMIN', 'MANAGER']),
  async (req: Request, res: Response) => {
    try {
      const record = await MaintenanceService.updateMaintenance(req.params.id, req.body)
      res.json(record)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
)

router.delete(
  '/maintenance/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  async (req: Request, res: Response) => {
    try {
      await MaintenanceService.deleteMaintenance(req.params.id)
      res.json({ success: true })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
)

router.get(
  '/maintenance/stats/:assetId?',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const stats = await MaintenanceService.getMaintenanceStats(req.params.assetId)
      res.json(stats)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

// ============ USER ROUTES ============

router.get(
  '/users',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const result = await UserService.getUsers(page, limit)
      res.json(result)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

router.get(
  '/users/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const user = await UserService.getUserById(req.params.id)
      res.json(user)
    } catch (error: any) {
      res.status(404).json({ error: error.message })
    }
  }
)

router.post(
  '/users',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const user = await UserService.createUser(req.body)
      res.status(201).json(user)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
)

router.put(
  '/users/:id/role',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  async (req: Request, res: Response) => {
    try {
      const user = await UserService.updateUserRole(req.params.id, req.body.role)
      res.json(user)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
)

router.post(
  '/users/:id/change-password',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { oldPassword, newPassword } = req.body
      const currentUser = (req as any).user
      
      // User can only change their own password unless they're admin
      if (currentUser.userId !== req.params.id && currentUser.role !== 'ADMIN') {
        return res.status(403).json({ error: 'You can only change your own password' })
      }
      
      // Validate inputs
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Old password and new password are required' })
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long' })
      }
      
      // Everyone must verify the old password before changing (even admins)
      const user = await UserService.getUserByIdWithPassword(req.params.id)
      const passwordMatch = await AuthService.verifyPassword(oldPassword, user.password)
      
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Old password is incorrect' })
      }
      
      const result = await UserService.changePassword(req.params.id, newPassword)
      res.json({ success: true, message: 'Password changed successfully', user: result })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
)

router.put(
  '/users/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      // Only ADMIN can change passwords
      if (req.body.password) {
        const user = (req as any).user
        if (user.role !== 'ADMIN') {
          return res.status(403).json({ error: 'Only administrators can change passwords' })
        }
      }

      const user = await UserService.updateUser(req.params.id, req.body)
      res.json(user)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
)

router.delete(
  '/users/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  async (req: Request, res: Response) => {
    try {
      await UserService.deleteUser(req.params.id)
      res.json({ success: true })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
)

// ============ DASHBOARD ROUTES ============

router.get(
  '/dashboard/stats',
  authMiddleware,
  async (_req: Request, res: Response) => {
    try {
      const stats = await DashboardService.getStats()
      res.json(stats)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

router.get(
  '/dashboard/assets/category',
  authMiddleware,
  async (_req: Request, res: Response) => {
    try {
      const data = await DashboardService.getAssetsByCategory()
      res.json(data)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

router.get(
  '/dashboard/assets/status',
  authMiddleware,
  async (_req: Request, res: Response) => {
    try {
      const data = await DashboardService.getAssetsByStatus()
      res.json(data)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

// Error handling middleware
router.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

export default router
