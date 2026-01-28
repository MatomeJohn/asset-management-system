// Backend Services

import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// ============ AUTHENTICATION SERVICE ============

export const AuthService = {
  async register(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'EMPLOYEE',
      },
    })

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token }
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials')
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token }
  },

  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
      return decoded
    } catch {
      throw new Error('Invalid token')
    }
  },

  async verifyPassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword)
  },
}

// ============ ASSET SERVICE ============

export const AssetService = {
  async getAssets(page: number = 1, limit: number = 10, filters?: any) {
    const skip = (page - 1) * limit
    
    const where: any = {}
    if (filters?.status) where.status = filters.status
    if (filters?.category) where.category = filters.category
    if (filters?.location) where.location = { contains: filters.location }

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({ where, skip, take: limit }),
      prisma.asset.count({ where }),
    ])

    return {
      data: assets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  },

  async getAssetById(id: string) {
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: { maintenanceRecords: true },
    })
    
    if (!asset) throw new Error('Asset not found')
    return asset
  },

  async createAsset(data: any) {
    // Check if assetTag already exists and generate a unique one if needed
    let assetTag = data.assetTag
    let tagExists = await prisma.asset.findUnique({ where: { assetTag } })
    
    if (tagExists) {
      // Generate a unique tag
      let counter = 1
      let newTag = `${data.assetTag}-${counter}`
      while (await prisma.asset.findUnique({ where: { assetTag: newTag } })) {
        counter++
        newTag = `${data.assetTag}-${counter}`
      }
      assetTag = newTag
    }

    const asset = await prisma.asset.create({
      data: {
        name: data.name,
        assetTag: assetTag,
        deviceName: data.deviceName || null,
        serialNumber: data.serialNumber || null,
        category: data.category,
        location: data.location,
        userAssigned: data.userAssigned || null,
        purchaseDate: new Date(data.purchaseDate),
        purchasePrice: parseFloat(data.purchasePrice),
        status: data.status || 'ACTIVE',
        description: data.description,
        ram: data.ram || null,
        storage: data.storage || null,
        processor: data.processor || null,
      },
    })
    return asset
  },

  async updateAsset(id: string, data: any) {
    const asset = await prisma.asset.update({
      where: { id },
      data: {
        name: data.name,
        assetTag: data.assetTag,
        deviceName: data.deviceName !== undefined ? data.deviceName : undefined,
        serialNumber: data.serialNumber !== undefined ? data.serialNumber : undefined,
        category: data.category,
        location: data.location,
        userAssigned: data.userAssigned !== undefined ? data.userAssigned : undefined,
        purchasePrice: data.purchasePrice ? parseFloat(data.purchasePrice) : undefined,
        status: data.status,
        description: data.description,
        ram: data.ram !== undefined ? data.ram : undefined,
        storage: data.storage !== undefined ? data.storage : undefined,
        processor: data.processor !== undefined ? data.processor : undefined,
      },
    })
    return asset
  },

  async deleteAsset(id: string) {
    await prisma.asset.delete({ where: { id } })
  },

  async searchAssets(query: string) {
    return prisma.asset.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { assetTag: { contains: query } },
          { description: { contains: query } },
        ],
      },
    })
  },
}

// ============ MAINTENANCE SERVICE ============

export const MaintenanceService = {
  async getAllMaintenance() {
    return prisma.maintenanceRecord.findMany({
      include: { asset: true },
      orderBy: { date: 'desc' },
    })
  },

  async getMaintenanceByAsset(assetId: string) {
    return prisma.maintenanceRecord.findMany({
      where: { assetId },
      include: { asset: true },
      orderBy: { date: 'desc' },
    })
  },

  async getMaintenanceByDateRange(startDate: Date, endDate: Date) {
    return prisma.maintenanceRecord.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    })
  },

  async addMaintenance(assetId: string, data: any) {
    const record = await prisma.maintenanceRecord.create({
      data: {
        assetId,
        type: data.type,
        date: new Date(data.date),
        description: data.description,
        cost: parseFloat(data.cost || 0),
        performedBy: data.performedBy,
      },
    })

    // Update asset status if needed
    if (data.type === 'MAJOR_REPAIR') {
      await prisma.asset.update({
        where: { id: assetId },
        data: { status: 'MAINTENANCE' },
      })
    }

    return record
  },

  async updateMaintenance(id: string, data: any) {
    return prisma.maintenanceRecord.update({
      where: { id },
      data: {
        type: data.type,
        date: data.date ? new Date(data.date) : undefined,
        description: data.description,
        cost: data.cost ? parseFloat(data.cost) : undefined,
        performedBy: data.performedBy,
      },
    })
  },

  async deleteMaintenance(id: string) {
    await prisma.maintenanceRecord.delete({ where: { id } })
  },

  async getMaintenanceStats(assetId?: string) {
    const where = assetId ? { assetId } : {}
    
    const totalCost = await prisma.maintenanceRecord.aggregate({
      _sum: { cost: true },
      where,
    })

    const count = await prisma.maintenanceRecord.count({ where })

    return {
      totalRecords: count,
      totalCost: totalCost._sum.cost || 0,
      averageCost: count > 0 ? (totalCost._sum.cost || 0) / count : 0,
    }
  },
}

// ============ USER SERVICE ============

export const UserService = {
  async getUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      prisma.user.findMany({ skip, take: limit, select: { id: true, name: true, email: true, role: true, status: true } }),
      prisma.user.count(),
    ])

    return {
      data: users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    }
  },

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, status: true },
    })
    
    if (!user) throw new Error('User not found')
    return user
  },

  async getUserByIdWithPassword(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    })
    
    if (!user) throw new Error('User not found')
    return user
  },

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true, status: true },
    })
  },

  async updateUserRole(id: string, role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE') {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    })
  },

  async createUser(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'EMPLOYEE',
      },
      select: { id: true, name: true, email: true, role: true },
    })
  },

  async deleteUser(id: string) {
    await prisma.user.delete({ where: { id } })
  },

  async updateUser(id: string, data: any) {
    const updateData: any = {
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
    }

    // Only allow password update if password is provided
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10)
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, status: true },
    })
  },

  async changePassword(id: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
      select: { id: true, name: true, email: true, role: true, status: true },
    })
  },
}

// ============ DASHBOARD SERVICE ============

export const DashboardService = {
  async getStats() {
    const [totalAssets, activeAssets, maintenanceAssets, totalValue, maintenanceRecords] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.count({ where: { status: 'ACTIVE' } }),
      prisma.asset.count({ where: { status: 'MAINTENANCE' } }),
      prisma.asset.aggregate({ _sum: { purchasePrice: true } }),
      prisma.maintenanceRecord.count(),
    ])

    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const recentMaintenance = await prisma.maintenanceRecord.count({
      where: { date: { gte: lastMonth } },
    })

    return {
      totalAssets,
      activeAssets,
      maintenanceDue: maintenanceAssets,
      inactiveAssets: totalAssets - activeAssets - maintenanceAssets,
      totalValue: totalAssets > 0 ? totalValue._sum.purchasePrice || 0 : 0,
      totalMaintenance: maintenanceRecords,
      recentMaintenance,
      maintenanceCost: await MaintenanceService.getMaintenanceStats(),
    }
  },

  async getAssetsByCategory() {
    const categories = await prisma.asset.groupBy({
      by: ['category'],
      _count: true,
    })

    return categories.map((cat) => ({
      category: cat.category,
      count: cat._count,
    }))
  },

  async getAssetsByStatus() {
    const statuses = await prisma.asset.groupBy({
      by: ['status'],
      _count: true,
    })

    return statuses.map((stat) => ({
      status: stat.status,
      count: stat._count,
    }))
  },
}
