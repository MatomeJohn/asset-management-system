# Asset Management System (AMS)

A complete full-stack application for managing organizational assets with real-time tracking, maintenance scheduling, and comprehensive reporting capabilities.

## 🎯 Features

### Core Functionality
- **Asset Management**: Create, read, update, and delete assets with detailed information
- **Maintenance Tracking**: Schedule and track maintenance records for assets
- **User Management**: Role-based access control (Admin, Manager, Viewer)
- **Dashboard Analytics**: Real-time statistics and insights
- **Search & Filtering**: Advanced search and filtering capabilities
- **Authentication**: JWT-based authentication system

### User Roles
- **Admin**: Full system access, user management, all operations
- **Manager**: Asset and maintenance management capabilities
- **Viewer**: Read-only access to assets and reports

## 📋 Project Structure

```
Asset Management System/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── types/           # TypeScript interfaces and types
│   │   ├── services/        # API service layer
│   │   ├── store/           # Zustand state management
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── App.tsx          # Main app component
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── vite.config.ts       # Vite configuration
│   ├── tailwind.config.ts   # Tailwind CSS configuration
│   ├── tsconfig.json        # TypeScript configuration
│   └── package.json         # Dependencies
│
├── backend/                 # Express TypeScript backend
│   ├── src/
│   │   ├── services/        # Business logic services
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Express middleware
│   │   └── server.ts        # Express server setup
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── tsconfig.json        # TypeScript configuration
│   └── package.json         # Dependencies
│
└── README.md               # Project documentation
```

## 🛠 Tech Stack

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Fast build tool
- **Zustand**: State management
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS
- **Axios**: HTTP client

### Backend
- **Express.js**: Web framework
- **TypeScript**: Type safety
- **Prisma**: ORM
- **PostgreSQL**: Database
- **JWT**: Authentication
- **bcrypt**: Password hashing
- **CORS**: Cross-origin requests

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Configure database connection**
```
DATABASE_URL=postgresql://user:password@localhost:5432/ams
JWT_SECRET=your-secret-key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

5. **Run database migrations**
```bash
npm run prisma:migrate
```

6. **Start the server**
```bash
npm run dev
```

Server runs on: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# .env already configured for localhost development
```

4. **Start the development server**
```bash
npm run dev
```

App runs on: `http://localhost:3000`

## 🚀 Usage

### Starting the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Default Login Credentials
The system initializes with demo accounts. Check `/docs/SETUP.md` for initial admin credentials.

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
```
POST   /auth/register          - Register new user
POST   /auth/login             - Login user
POST   /auth/verify            - Verify token
```

### Asset Endpoints
```
GET    /assets                 - Get all assets (paginated)
GET    /assets/:id             - Get asset by ID
POST   /assets                 - Create new asset
PUT    /assets/:id             - Update asset
DELETE /assets/:id             - Delete asset
GET    /assets/search/:query   - Search assets
```

### Maintenance Endpoints
```
GET    /maintenance/asset/:assetId    - Get maintenance records
POST   /maintenance/:assetId          - Add maintenance record
PUT    /maintenance/:id               - Update maintenance record
DELETE /maintenance/:id               - Delete maintenance record
GET    /maintenance/stats/:assetId    - Get maintenance statistics
```

### User Endpoints
```
GET    /users                  - Get all users
GET    /users/:id              - Get user by ID
POST   /users                  - Create user
PUT    /users/:id              - Update user
PUT    /users/:id/role         - Update user role
DELETE /users/:id              - Delete user
```

### Dashboard Endpoints
```
GET    /dashboard/stats        - Get system statistics
GET    /dashboard/assets/category  - Assets by category
GET    /dashboard/assets/status    - Assets by status
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-Based Access Control**: Fine-grained permission management
- **Input Sanitization**: Protection against injection attacks
- **CORS**: Configured cross-origin security
- **Rate Limiting**: API rate limiting to prevent abuse
- **Request Validation**: Comprehensive input validation

## 📊 Database Schema

### Users Table
```sql
- id (UUID primary key)
- name (String)
- email (String unique)
- password (String hashed)
- role (Enum: ADMIN, MANAGER, VIEWER)
- createdAt, updatedAt
```

### Assets Table
```sql
- id (UUID primary key)
- name (String)
- assetTag (String unique)
- category (String)
- location (String)
- purchaseDate (DateTime)
- purchasePrice (Float)
- status (Enum: ACTIVE, INACTIVE, MAINTENANCE, RETIRED)
- description (String optional)
- createdAt, updatedAt
```

### MaintenanceRecords Table
```sql
- id (UUID primary key)
- assetId (UUID foreign key)
- type (String)
- date (DateTime)
- description (String optional)
- cost (Float)
- performedBy (String optional)
- createdAt, updatedAt
```

## 🎨 UI Components

### Available Components
- **Button**: Primary, secondary, danger, success variants
- **Input**: Text input with validation
- **Card**: Container component
- **Alert**: Success, error, warning, info alerts
- **Spinner**: Loading indicator
- **Badge**: Status badges
- **Modal**: Dialog component
- **Table**: Data table with pagination
- **Select**: Dropdown select
- **Pagination**: Page navigation

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run lint
npm test
```

### Frontend Testing
```bash
cd frontend
npm run lint
npm test
```

## 📈 Performance

- **Frontend**: Optimized builds with code splitting
- **Backend**: Indexed database queries, caching middleware
- **API**: Rate limiting, pagination, efficient filtering

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database user has proper permissions

### CORS Errors
- Check FRONTEND_URL in backend .env
- Verify CORS middleware configuration
- Check browser console for specific errors

### Authentication Issues
- Verify JWT_SECRET is set in .env
- Check token expiration in browser storage
- Clear localStorage and retry login

## 📝 Development

### Code Style
- TypeScript strict mode enabled
- ESLint configuration included
- Prettier formatting recommended

### Adding New Features
1. Create types in `frontend/src/types`
2. Create API service in `frontend/src/services`
3. Create store if needed in `frontend/src/store`
4. Create UI components in `frontend/src/components`
5. Create pages/routes in `frontend/src/pages`

## 📚 Documentation Files

- `/docs/SETUP.md` - Detailed setup guide
- `/docs/API.md` - Complete API documentation
- `/docs/DATABASE.md` - Database schema details
- `/docs/ARCHITECTURE.md` - System architecture
- `/docs/DEPLOYMENT.md` - Production deployment guide
- `/docs/TROUBLESHOOTING.md` - Common issues and solutions

## 📄 License

This project is part of the Asset Management System suite.

## 👥 Team

Developed by the Asset Management Team

## 🤝 Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## 📞 Support

For issues and questions, refer to the documentation or contact the development team.

---

**Last Updated**: January 2024
**Version**: 1.0.0
