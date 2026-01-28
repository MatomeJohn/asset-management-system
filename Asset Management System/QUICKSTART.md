# Quick Start Guide - Asset Management System

## 🚀 5-Minute Setup

### Step 1: Backend Setup (2 minutes)
```bash
cd backend
npm install
cp .env.example .env
```

**Edit backend/.env:**
```
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/ams
JWT_SECRET=your-secret-key-123
```

Replace with your PostgreSQL credentials, then run:
```bash
npm run prisma:migrate
npm run dev
```

✅ Backend running on `http://localhost:5000`

---

### Step 2: Frontend Setup (2 minutes)
Open a **new terminal**:
```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running on `http://localhost:3000`

---

### Step 3: Access Application (1 minute)
1. Open browser: http://localhost:3000
2. Create an account or use existing credentials
3. Start managing assets!

---

## 📚 What's Included

### Frontend
- ✅ React 18 with TypeScript
- ✅ 5 pages (Login, Dashboard, Assets, Users, Maintenance)
- ✅ 10 reusable UI components
- ✅ Complete state management (Zustand)
- ✅ 70+ utility functions
- ✅ Responsive design with Tailwind CSS

### Backend
- ✅ Express.js server
- ✅ 5 services with 35+ methods
- ✅ 15+ API endpoints
- ✅ 11 middleware functions
- ✅ JWT authentication
- ✅ PostgreSQL database (Prisma ORM)

---

## 🎯 Key Features

- **Asset Management**: Track all organizational assets
- **Maintenance Scheduling**: Schedule and record maintenance
- **User Management**: Role-based access (Admin, Manager, Viewer)
- **Dashboard**: Real-time statistics and insights
- **Search & Filter**: Find assets quickly
- **Security**: JWT authentication, password hashing, RBAC

---

## 📊 Project Structure

```
Asset Management System/
├── backend/          (Express.js + Prisma)
│   ├── src/
│   │   ├── services/   (Business logic)
│   │   ├── routes/     (API endpoints)
│   │   ├── middleware/ (Express middleware)
│   │   └── server.ts   (Server setup)
│   └── prisma/         (Database schema)
│
├── frontend/         (React + TypeScript)
│   ├── src/
│   │   ├── types/      (TypeScript types)
│   │   ├── services/   (API service layer)
│   │   ├── store/      (Zustand state)
│   │   ├── hooks/      (Custom hooks)
│   │   ├── utils/      (Utility functions)
│   │   ├── components/ (UI components)
│   │   ├── pages/      (Page components)
│   │   └── App.tsx     (Main app)
│   └── config files    (Vite, Tailwind, etc.)
│
├── README.md           (Project documentation)
└── COMPLETION_SUMMARY.md (Detailed summary)
```

---

## 🔧 Common Tasks

### View Database
```bash
cd backend
npm run prisma:studio
```
Opens Prisma Studio at http://localhost:5555

### Rebuild Frontend
```bash
cd frontend
npm run build
```
Creates optimized production build in `dist/`

### Rebuild Backend
```bash
cd backend
npm run build
```
Compiles TypeScript to `dist/`

### Run Production Server
```bash
cd backend
npm run build
npm start
```

---

## 💾 Database Setup

### PostgreSQL Installation
**Windows:**
```bash
# Using chocolatey
choco install postgresql
# Or download from https://www.postgresql.org/download/windows/
```

**macOS:**
```bash
brew install postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
```

### Create Database
```bash
psql -U postgres
CREATE DATABASE ams;
\q
```

### Update .env
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/ams
```

Then run: `npm run prisma:migrate`

---

## 🔐 Security Features

- ✅ JWT token authentication
- ✅ Bcrypt password hashing
- ✅ Role-based access control
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Rate limiting
- ✅ SQL injection prevention
- ✅ XSS protection

---

## 🧪 Testing Workflow

1. **Backend running?**
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{ "status": "ok" }`

2. **Frontend running?**
   Open: http://localhost:3000
   Should show login page

3. **Database connected?**
   ```bash
   npm run prisma:studio
   ```
   Opens database UI

---

## 📱 API Quick Reference

### Authentication
```bash
# Register
POST http://localhost:5000/api/auth/register
Body: { "name": "John", "email": "john@example.com", "password": "Password123" }

# Login
POST http://localhost:5000/api/auth/login
Body: { "email": "john@example.com", "password": "Password123" }
```

### Assets
```bash
# List all assets
GET http://localhost:5000/api/assets

# Create asset
POST http://localhost:5000/api/assets
Body: { "name": "Laptop", "assetTag": "LT-001", "category": "COMPUTER", ... }

# Search assets
GET http://localhost:5000/api/assets/search/laptop
```

### Dashboard
```bash
# Get stats
GET http://localhost:5000/api/dashboard/stats
```

---

## 🎨 Customization

### Change Colors
Edit `frontend/tailwind.config.ts`:
```ts
theme: {
  extend: {
    colors: {
      primary: '#your-color',
    }
  }
}
```

### Add New Page
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.tsx`
3. Add navigation link in layout

### Add New API Endpoint
1. Create service method in `backend/src/services/`
2. Add route in `backend/src/routes/`
3. Add client service in `frontend/src/services/`

---

## ❌ Troubleshooting

### Port Already in Use
```bash
# Find process on port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

### Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Run: `npm run prisma:migrate`

### CORS Error
- Verify FRONTEND_URL in backend .env
- Restart backend server
- Clear browser cache

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📈 Performance Tips

- **Frontend**: Use React DevTools to profile
- **Backend**: Enable query logging in Prisma
- **Database**: Use indexes on frequently queried fields
- **API**: Implement pagination and filtering

---

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
npm run build
npm start
```

### Database (Neon/Railway)
- Create PostgreSQL database
- Update DATABASE_URL
- Run migrations on production

---

## 📚 Documentation

- **Full README**: See `README.md`
- **Project Summary**: See `COMPLETION_SUMMARY.md`
- **Code Comments**: Check individual files

---

## 💡 Next Steps

1. ✅ Complete quick start above
2. ✅ Create test assets
3. ✅ Schedule maintenance
4. ✅ Explore dashboard
5. ✅ Add more users
6. ✅ Customize UI
7. ✅ Deploy to production

---

## 🤝 Need Help?

1. Check error messages in browser console
2. Check server logs in terminal
3. Review code comments
4. Check database with Prisma Studio
5. Verify environment variables

---

**Ready?** Run these commands:
```bash
# Terminal 1
cd backend && npm install && npm run dev

# Terminal 2
cd frontend && npm install && npm run dev

# Open browser
http://localhost:3000
```

**Happy coding! 🎉**
