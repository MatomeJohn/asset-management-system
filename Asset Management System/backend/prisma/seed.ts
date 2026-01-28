// Seed script for development database

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create your user
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  let user = await prisma.user.findUnique({
    where: { email: 'matome@gmail.com' }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Matome',
        email: 'matome@gmail.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    })
    console.log('✓ Created user:', user.email)
  } else {
    console.log('✓ User already exists:', user.email)
  }

  // Skip asset creation - user will add their own
  console.log('✓ Skipping demo assets - user will add their own assets')

  // Create test assets - Office equipment for employee assignment
  const assets = []
  
  // Define office equipment data
  const officeEquipment = [
    // Laptops
    { category: 'Laptop', devices: ['Dell XPS 13', 'MacBook Pro 14"', 'HP Pavilion', 'Lenovo ThinkPad', 'Dell Inspiron', 'Apple MacBook Air', 'ASUS VivoBook'] },
    // Desktop Monitors
    { category: 'Monitor/Screen', devices: ['Dell UltraSharp 27"', 'LG 24" FHD', 'Dell P2423D', 'ASUS ProArt 32"', 'BenQ PD2500Q', 'LG UltraWide 34"'] },
    // Peripherals
    { category: 'Mouse', devices: ['Logitech MX Master 3', 'Apple Magic Mouse', 'Microsoft Sculpt', 'Razer DeathAdder', 'Corsair M65'] },
    { category: 'Charger', devices: ['USB-C 65W', 'USB-C 100W', 'MagSafe', 'Dell 90W', 'Lenovo 65W Adapter'] },
    { category: 'Bag', devices: ['Laptop Backpack 15.6"', 'Laptop Backpack 17"', 'Messenger Bag', 'Travel Bag 20L', 'Briefcase'] },
    { category: 'Keyboard', devices: ['Mechanical RGB', 'Apple Magic Keyboard', 'Logitech K850', 'Microsoft Ergonomic', 'Corsair K65'] },
    { category: 'Headphones', devices: ['Sony WH-1000XM5', 'Apple AirPods Pro', 'Bose QuietComfort 45', 'Sennheiser Momentum 4', 'Jabra Elite 85t'] },
    { category: 'Printer', devices: ['HP LaserJet M404n', 'Brother HL-L8360CDW', 'Canon imagePRESS', 'Xerox C235'] },
  ]
  
  const locations = ['Building A - 1st Floor', 'Building A - 2nd Floor', 'Building B - Admin', 'Building C - IT Lab', 'Building D - Conference', 'Warehouse', 'Server Room']
  const employees = ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'Robert Wilson', 'Jessica Martinez', 'David Lee', 'Amanda Taylor', 'Christopher Anderson', 'Nicole Garcia']
  const statuses = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'MAINTENANCE', 'INACTIVE']

  let assetIndex = 1
  
  // Generate assets for each equipment type
  for (const equipment of officeEquipment) {
    for (let j = 0; j < equipment.devices.length; j++) {
      for (let k = 0; k < (equipment.category === 'Monitor/Screen' ? 25 : equipment.category === 'Laptop' ? 30 : 15); k++) {
        const deviceName = equipment.devices[j % equipment.devices.length]
        const serialNumber = `${equipment.category.substring(0, 3).toUpperCase()}-${String(assetIndex).padStart(6, '0')}`
        const assignedEmployee = Math.random() > 0.2 ? employees[Math.floor(Math.random() * employees.length)] : null
        const purchasePrice = 
          equipment.category === 'Laptop' ? Math.floor(Math.random() * 1500) + 800 :
          equipment.category === 'Monitor/Screen' ? Math.floor(Math.random() * 800) + 200 :
          equipment.category === 'Keyboard' ? Math.floor(Math.random() * 200) + 50 :
          equipment.category === 'Mouse' ? Math.floor(Math.random() * 150) + 30 :
          equipment.category === 'Charger' ? Math.floor(Math.random() * 150) + 30 :
          equipment.category === 'Bag' ? Math.floor(Math.random() * 200) + 40 :
          equipment.category === 'Headphones' ? Math.floor(Math.random() * 400) + 100 :
          equipment.category === 'Printer' ? Math.floor(Math.random() * 3000) + 1500 :
          Math.floor(Math.random() * 500) + 100

        const asset = await prisma.asset.create({
          data: {
            name: `${deviceName}`,
            assetTag: `AST-${String(assetIndex).padStart(5, '0')}`,
            deviceName: deviceName,
            serialNumber: serialNumber,
            category: equipment.category,
            location: locations[assetIndex % locations.length],
            userAssigned: assignedEmployee,
            purchaseDate: new Date(2020 + Math.floor(assetIndex / 40), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            purchasePrice: purchasePrice,
            status: statuses[assetIndex % statuses.length],
            description: `${equipment.category} - ${deviceName}`,
          },
        })
        assets.push(asset)
        assetIndex++
      }
    }
  }

  console.log(`✓ Created ${assets.length} assets`)

  // Create maintenance records
  let maintenanceCount = 0
  for (let i = 0; i < assets.length; i++) {
    if (Math.random() > 0.9) {
      await prisma.maintenanceRecord.create({
        data: {
          assetId: assets[i].id,
          type: 'ROUTINE',
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          description: 'Routine maintenance',
          cost: Math.floor(Math.random() * 500) + 50,
          performedBy: 'Admin User',
        },
      })
      maintenanceCount++
    }
  }

  console.log(`✓ Created ${maintenanceCount} maintenance records`)
  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
