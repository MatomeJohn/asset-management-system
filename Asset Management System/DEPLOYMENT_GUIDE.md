# Asset Management System - Deployment Guide

This guide provides step-by-step instructions to deploy your Asset Management System to production.

## Deployment Options

Choose one of the following deployment strategies based on your needs:

### ⭐ Option 1: **Vercel + Render (COMPLETELY FREE - RECOMMENDED)**
- **Frontend**: Vercel (free tier, unlimited)
- **Backend**: Render (free tier available)
- **Database**: Render PostgreSQL (free tier available)
- **Cost**: $0/month
- **Best for**: Free deployment with good performance

### Option 2: **Vercel + Railway (Very Cheap)**
- **Frontend**: Vercel (free tier)
- **Backend**: Railway (free $5 credit/month, then ~$5/month)
- **Database**: Railway PostgreSQL
- **Cost**: ~$5/month after credit expires
- **Best for**: Better performance than free tier

### Option 3: **AWS (Full Control)**
- **Frontend**: S3 + CloudFront
- **Backend**: EC2 or Elastic Beanstalk
- **Database**: RDS PostgreSQL
- **Cost**: Varies, free tier available for 12 months

### Option 4: **DigitalOcean (Budget-Friendly)**
- **Frontend**: Spaces or App Platform
- **Backend**: App Platform or Droplet
- **Database**: Managed PostgreSQL
- **Cost**: Starting ~$5/month
- **Best for**: Simple unified platform

---

## OPTION 1: Vercel + Render (COMPLETELY FREE - START HERE)

This is the **best option for free deployment** with excellent performance and reliability.

### Prerequisites
- GitHub account (already have your repo pushed ✅)
- Vercel account (free signup)
- Render account (free signup)
- 15 minutes of your time

### Step 1: Prepare Your GitHub Repository

Your code is already pushed, so let's verify it's ready:

#### 1.1 Ensure `.env` files are NOT committed

Check your `.gitignore`:

```bash
# Should contain:
backend/.env
backend/.env.local
frontend/.env
frontend/.env.local
.DS_Store
node_modules/
dist/
```

If you've committed `.env` files, you need to remove them:

```bash
git rm --cached backend/.env
git rm --cached frontend/.env
echo "backend/.env" >> .gitignore
echo "frontend/.env" >> .gitignore
git commit -m "Remove env files from git"
git push
```

#### 1.2 Verify Backend Build Script

Your `backend/package.json` should have these scripts (already correct):

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "postbuild": "npm run prisma:migrate",
    "prisma:migrate": "prisma migrate deploy",
    "prisma:generate": "prisma generate"
  }
}
```

---

### Step 2: Deploy Backend to Render (FREE)

1. **Go to [Render.com](https://render.com)** and sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Select your GitHub repository
   - Select branch: `main`
   - If multiple services in one repo, select the `backend` directory:
     - **Root Directory**: `backend`

3. **Configure Build Settings**
   - **Name**: `ams-backend` (or your choice)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build && npm run prisma:generate`
   - **Start Command**: `npm start`
   - **Free tier**: ✅ Selected

4. **Set Environment Variables**
   - Click "Advanced" 
   - Add environment variables:
   
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=<generate-random-32-char-secret-below>
   DATABASE_URL=<get-from-step-3>
   FRONTEND_URL=<get-after-vercel-deployment>
   ```

   **Generate JWT_SECRET** (copy one of these):
   ```bash
   # Linux/Mac:
   openssl rand -base64 32
   
   # Or use any online generator: https://www.uuidgenerator.net
   # Example: "mB3kL9pQ2xZ7wN4jF6rT5sH8dM1vY0uC"
   ```

5. **Click "Create Web Service"**
   - Render will deploy automatically
   - Wait for deployment to complete (2-5 minutes)
   - Copy the backend URL: `https://ams-backend-xxx.onrender.com`

---

### Step 3: Create PostgreSQL Database on Render (FREE)

1. **In Render dashboard**, click "New +" → "PostgreSQL"

2. **Configure Database**
   - **Name**: `ams-db`
   - **Database**: `ams`
   - **User**: `ams_user`
   - **Region**: Same as backend (e.g., `Oregon`)
   - **Free tier**: ✅ Selected

3. **Create Database**
   - Wait for creation (1-2 minutes)
   - Copy the connection string from the database details page
   - It looks like: `postgresql://user:password@host:5432/db`

4. **Add to Backend Service**
   - Go back to your backend web service
   - Click "Environment"
   - Add/update `DATABASE_URL` with the PostgreSQL connection string
   - Save and the service will redeploy automatically

5. **Run Migrations**
   - In Render, go to your backend service → "Logs"
   - Migrations should run automatically during build
   - You should see: `✓ Migrations completed`

---

### Step 4: Deploy Frontend to Vercel (FREE)

1. **Go to [Vercel.com](https://vercel.com)** and sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Vercel auto-detects it

3. **Configure Project**
   - **Project Name**: `ams-frontend`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**
   - Add environment variable:
     ```
     VITE_API_URL=https://ams-backend-xxx.onrender.com
     ```
     (Replace with your actual Render backend URL)

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Get your frontend URL: `https://ams-frontend-xxx.vercel.app`

---

### Step 5: Connect Frontend to Backend

1. **Update Backend CORS**
   - Go to Render → Backend service → "Environment"
   - Update `FRONTEND_URL`: `https://ams-frontend-xxx.vercel.app`
   - Save (service will redeploy)

2. **Verify CORS in Code**
   - Your backend already has: `backend/src/server.ts` configured
   - It uses `process.env.FRONTEND_URL` correctly

---

### Step 6: Test Your Deployment

1. **Visit Frontend**
   - Go to `https://ams-frontend-xxx.vercel.app`
   - Should load without errors

2. **Test API Connection**
   ```bash
   # Test backend is responding
   curl https://ams-backend-xxx.onrender.com/api/health
   
   # Should return: {"status": "ok"}
   ```

3. **Test Login**
   - In the frontend, try to login
   - Check browser console (F12) for errors
   - Check Render backend logs for API errors

4. **Check Logs**
   - **Frontend**: Vercel → Project → Deployments → Logs
   - **Backend**: Render → Backend service → Logs
   - **Database**: Render → Database → Logs

---

### Step 7: Troubleshooting Common Issues

**"Cannot connect to database" error**
- Check `DATABASE_URL` is correct in Render backend environment
- Ensure database is running (check Render database status)
- Make sure migrations completed successfully

**"CORS error" in browser**
- Verify `FRONTEND_URL` is set correctly in Render backend
- Check it matches your Vercel domain exactly
- Restart backend service after changing

**"Build failed" on Render**
- Check build logs for specific error
- Verify Node.js version (Render uses node 18+ by default)
- Try running locally: `npm run build` in backend folder

**"Blank frontend screen"**
- Check browser console (F12) for errors
- Verify `VITE_API_URL` is set correctly
- Check if API calls succeed in Network tab

**"Cannot find modules" error**
- Render might not have run `npm install`
- Check build command includes `npm install`
- Manually trigger redeploy

---

## OPTION 1B: Vercel + Railway (Very Cheap Alternative)

In `backend/` folder, create `.env.production`:

```env
# Database
DATABASE_URL="postgresql://user:password@your-railway-host:5432/ams_db"

# Server
PORT=5000
NODE_ENV=production

# Frontend URL
FRONTEND_URL="https://your-frontend-domain.vercel.app"

# JWT Secret (generate a strong random string)
JWT_SECRET="your-super-secret-jwt-key-min-32-chars-long"

# CORS Origins
CORS_ORIGINS="https://your-frontend-domain.vercel.app"
```

#### 1.2 Update Backend CORS Configuration

Edit `backend/src/server.ts` and update the CORS configuration:

```typescript
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
  ],
  credentials: true,
}))
```

#### 1.3 Create Build Script for Backend

Update `backend/package.json`:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "postbuild": "npm run prisma:migrate",
    "prisma:migrate": "prisma migrate deploy",
    "prisma:generate": "prisma generate",
    "prisma:seed": "ts-node prisma/seed.ts"
  }
}
```

#### 1.4 Create `backend/.env.local` for Development

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ams_db"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
JWT_SECRET="dev-secret-key-for-local-testing"
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

---

### Step 2: Deploy Backend to Railway

1. **Sign up at [Railway.app](https://railway.app?referralCode=)**

2. **Create a New Project**
   - Click "Create New Project"
   - Select "Provision PostgreSQL"
   - Add a new service → "Deploy from GitHub"

3. **Connect GitHub Repository**
   - Authorize Railway to access your GitHub
   - Select your repository
   - Select the root or `/backend` folder as the deployment path

4. **Configure Environment Variables**
   - In Railway dashboard, go to your service → "Variables"
   - Add variables from your `.env.production`:
     ```
     NODE_ENV=production
     PORT=5000
     JWT_SECRET=your-secure-random-string
     FRONTEND_URL=https://your-vercel-domain.vercel.app
     ```

5. **Database Configuration**
   - Railway auto-creates PostgreSQL
   - The `DATABASE_URL` is automatically set
   - Run migrations: In Railway UI, go to Deployments → select latest → "Deploy" (this runs builds)

6. **Get Backend URL**
   - Railway generates a public URL (e.g., `https://ams-backend.up.railway.app`)
   - Copy this for the frontend configuration

---

### Step 3: Deploy Frontend to Vercel

1. **Sign up at [Vercel.com](https://vercel.com)**

2. **Import Project**
   - Click "New Project"
   - Select your GitHub repository
   - Vercel auto-detects it's a Vite project

3. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Root Directory**: `./frontend`

4. **Environment Variables**
   - Add variable:
     ```
     VITE_API_URL=https://ams-backend.up.railway.app
     ```

5. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically

6. **Update Backend CORS**
   - After Vercel deployment, get your frontend URL (e.g., `https://ams-frontend.vercel.app`)
   - Go to Railway → Backend service → Variables
   - Update `FRONTEND_URL` with the Vercel domain
   - Redeploy

---

## OPTION 2: AWS Deployment

### Prerequisites
- AWS Account
- AWS CLI installed

### Backend: Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Navigate to backend
cd backend

# Initialize EB app
eb init -p node.js-20 ams-backend --region us-east-1

# Create environment
eb create ams-backend-prod

# Set environment variables
eb setenv DATABASE_URL="postgresql://..." PORT=5000 NODE_ENV=production

# Deploy
eb deploy
```

### Frontend: S3 + CloudFront

```bash
# Build frontend
cd frontend
npm run build

# Create S3 bucket
aws s3 mb s3://ams-frontend-prod

# Upload build
aws s3 sync dist/ s3://ams-frontend-prod --delete

# Create CloudFront distribution
# (Use AWS Console for this - more complex)
```

---

## OPTION 3: DigitalOcean App Platform

### Backend Deployment

1. **Sign up at [DigitalOcean](https://www.digitalocean.com)**

2. **Create App**
   - Click "Create" → "Apps (beta)"
   - Select GitHub repository
   - Select `/backend` folder

3. **Configure**
   - **Name**: ams-backend
   - **Build**: Automatic detection
   - **HTTP Port**: 5000

4. **Environment Variables**
   ```
   NODE_ENV=production
   JWT_SECRET=your-secret
   DATABASE_URL=postgresql://user:pass@db-host:5432/ams_db
   FRONTEND_URL=https://your-frontend-domain
   ```

5. **Add Database**
   - In the same app, add a component → Database
   - Select PostgreSQL
   - DigitalOcean provides connection string

### Frontend Deployment

1. **Build**
   ```bash
   npm run build
   ```

2. **Deploy Static Site**
   - Click "Create" → "Apps"
   - Select `/frontend` folder
   - Set build command: `npm run build`
   - Set output directory: `dist`

---

## OPTION 4: Render Deployment

### Backend

1. Go to [Render.com](https://render.com)

2. **Create Web Service**
   - New → Web Service
   - Connect GitHub repository
   - Environment: Node
   - Build command: `npm install && npm run build && prisma migrate deploy`
   - Start command: `npm start`

3. **Add Environment Variables**
   - `NODE_ENV=production`
   - `JWT_SECRET=...`
   - `FRONTEND_URL=...`

4. **Add PostgreSQL Database**
   - New → PostgreSQL
   - Connect to web service

### Frontend

1. **Create Static Site**
   - New → Static Site
   - Connect repository
   - Build command: `npm run build`
   - Publish directory: `dist`

---

## Post-Deployment Setup

### 1. Database Migrations

```bash
# For Railway/AWS/DigitalOcean
# This should run automatically, but if needed:
prisma migrate deploy
```

### 2. Seed Database (Optional)

```bash
# If you have test data setup
npm run prisma:seed
```

### 3. Test API Endpoints

```bash
# Test health check
curl https://your-backend-url/api/health

# Test authentication
curl -X POST https://your-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-password"}'
```

### 4. Monitor Logs

- **Railway**: Dashboard → Logs tab
- **Vercel**: Deployments → select deployment → Logs
- **AWS**: CloudWatch
- **DigitalOcean**: Apps → Logs
- **Render**: Services → Logs

---

## Environment Variables Checklist

### Backend Required
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NODE_ENV` - Set to "production"
- [ ] `PORT` - Set to 5000
- [ ] `JWT_SECRET` - Random 32+ character string
- [ ] `FRONTEND_URL` - Your frontend domain

### Frontend Required
- [ ] `VITE_API_URL` - Your backend URL (e.g., `https://your-backend.app`)

---

## Troubleshooting

### Connection Refused to Database
- Verify `DATABASE_URL` is correct
- Check database credentials
- Ensure database is running
- Verify firewall/security groups allow connection

### CORS Errors
- Check `FRONTEND_URL` in backend environment
- Verify frontend URL matches exactly
- Restart backend after changing CORS settings

### Build Fails
- Check Node.js version (must be 18+)
- Run `npm install` locally to test
- Check build logs in deployment platform

### API Not Responding
- Check backend logs
- Verify `PORT` environment variable
- Test with simple curl request

### Database Migrations Failed
- Check database connection
- Ensure Prisma schema is valid
- Try resetting database (development only!)
- Check migration history: `prisma migrate status`

---

## Domain Setup

### Custom Domain on Vercel
1. Go to Vercel Dashboard → Project Settings
2. Domains → Add domain
3. Add DNS records from Vercel
4. Wait for DNS propagation (5-48 hours)

### Custom Domain on Railway
1. Go to Railway → Project Settings
2. Custom Domain → Add domain
3. Update your DNS provider

---

## Security Best Practices

✅ **DO**:
- Use strong JWT secrets (32+ random characters)
- Enable HTTPS (auto on Vercel/Railway/Render)
- Use environment variables for secrets
- Keep dependencies updated
- Enable database backups
- Use strong database passwords

❌ **DON'T**:
- Commit `.env` files to Git
- Use hardcoded secrets
- Disable CORS security
- Use weak passwords
- Skip database backups

---

## Monitoring & Maintenance

### Set Up Alerts
- Database connections
- API response times
- Error rates
- Disk usage

### Regular Maintenance
- Update dependencies monthly
- Review logs weekly
- Backup database daily
- Monitor costs

---

## Quick Commands Reference

```bash
# Build
npm run build

# Test locally
npm run dev

# Database
prisma migrate status
prisma migrate deploy
prisma studio

# Logs (if using Render/Railway CLI)
railway logs
render logs
```

---

## Support & Resources

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Prisma Docs](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com)
- [React Docs](https://react.dev)

---

**Need Help?** 
- Check platform-specific logs
- Review this guide's troubleshooting section
- Search platform documentation
