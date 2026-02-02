# FREE DEPLOYMENT - Quick Start Guide

**Your GitHub Repo**: https://github.com/MatomeJohn/asset-management-system.git

**Estimated Time**: 20 minutes  
**Cost**: $0/month  
**Platforms**: Vercel (Frontend) + Render (Backend + Database)

---

## 🚀 Step-by-Step Deployment

### STEP 1: Generate JWT Secret (2 minutes)

Generate a secure random string for `JWT_SECRET`:

**Option A - Online Generator**:
- Go to https://www.uuidgenerator.net
- Generate a UUID
- Copy it (example: `123e4567-e89b-12d3-a456-426614174000`)

**Option B - Command Line**:
```bash
# Windows PowerShell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))

# Linux/Mac
openssl rand -base64 32
```

**Save this value** - you'll need it in Step 3.

---

### STEP 2: Deploy Backend to Render (8 minutes)

#### 2.1 Sign Up
1. Go to https://render.com
2. Click "Sign up"
3. Select "GitHub" 
4. Authorize Render to access your GitHub account

#### 2.2 Create Web Service
1. In Render dashboard, click "New +" → "Web Service"
2. Find your repository: `asset-management-system`
3. Click "Connect"
4. Fill in:
   - **Name**: `ams-backend`
   - **Runtime**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build && npm run prisma:generate`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` ✅

#### 2.3 Add Environment Variables
Scroll down to "Environment" section:

| Key | Value |
|-----|-------|
| NODE_ENV | production |
| PORT | 10000 |
| JWT_SECRET | (paste your generated secret from Step 1) |
| DATABASE_URL | (leave blank for now - we'll add DB next) |
| FRONTEND_URL | (leave blank for now - we'll get Vercel URL later) |

#### 2.4 Create Service
- Click "Create Web Service"
- Render will deploy automatically
- This takes 2-3 minutes
- **Copy your backend URL** from the page (looks like: `https://ams-backend-xxx.onrender.com`)

---

### STEP 3: Create Database on Render (5 minutes)

#### 3.1 Create PostgreSQL
1. In Render dashboard, click "New +" → "PostgreSQL"
2. Fill in:
   - **Name**: `ams-db`
   - **Database**: `ams`
   - **User**: `ams_user`
   - **Region**: Select same as backend
   - **Instance Type**: `Free` ✅

#### 3.2 Wait for Database
- Creation takes 1-2 minutes
- Once created, you'll see a connection string
- **Copy the DATABASE_URL** from the Info tab

#### 3.3 Connect Database to Backend
1. Go back to Render → Backend service (`ams-backend`)
2. Click "Environment"
3. Add new variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the connection string from Step 3.2
4. Click "Save"
5. Render will automatically redeploy
6. Wait for deployment to complete
7. Check logs - migrations should run automatically

---

### STEP 4: Deploy Frontend to Vercel (5 minutes)

#### 4.1 Sign Up
1. Go to https://vercel.com
2. Click "Sign Up"
3. Select "GitHub"
4. Authorize Vercel

#### 4.2 Import Project
1. Click "Add New..." → "Project"
2. Search for: `asset-management-system`
3. Click "Import"

#### 4.3 Configure
- **Framework Preset**: Vercel should auto-detect `Vite` ✅
- **Root Directory**: `./frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - **Key**: `VITE_API_URL`
  - **Value**: Your Render backend URL (from Step 2.4)
    - Example: `https://ams-backend-abc123.onrender.com`

#### 4.4 Deploy
- Click "Deploy"
- Wait 2-3 minutes for completion
- **Copy your frontend URL** (looks like: `https://ams-frontend-xxx.vercel.app`)

---

### STEP 5: Final Connection (2 minutes)

#### 5.1 Update Backend CORS
1. Go to Render → Backend service (`ams-backend`)
2. Click "Environment"
3. Find `FRONTEND_URL` variable
4. Update it with your Vercel URL:
   - Example: `https://ams-frontend-xxx.vercel.app`
5. Click "Save"
6. Wait for redeploy

#### 5.2 Verify Logs
- Check Render backend logs for "Deployment successful"
- Should show no errors

---

## ✅ Test Your Deployment

### Test 1: Visit Frontend
- Open: https://ams-frontend-xxx.vercel.app (your Vercel URL)
- Should load the app
- Should NOT see blank screen

### Test 2: Check Backend Connection
```bash
# Open PowerShell/Terminal and run:
curl "https://ams-backend-xxx.onrender.com/api/health"

# Should respond with: {"status":"ok"}
```

### Test 3: Try Login
- In the frontend, attempt to login
- Use any email/password (it should test the connection)
- Check browser console (F12) for errors
- Check Render logs for backend errors

### Test 4: Monitor Logs
- **Frontend Errors**: Vercel → Deployments → Logs (Runtime)
- **Backend Errors**: Render → Logs
- Both should show no errors

---

## 🎉 Success Indicators

✅ Frontend loads without errors  
✅ Backend URL responds to curl  
✅ Login form makes API calls  
✅ No CORS errors in browser console  
✅ No errors in backend logs  

---

## 💾 Your Deployment Info

Save this information:

```
Frontend URL: https://ams-frontend-xxx.vercel.app
Backend URL: https://ams-backend-xxx.onrender.com
Database: Managed by Render

GitHub Repo: https://github.com/MatomeJohn/asset-management-system.git
```

---

## 🔄 Auto-Deployments

Both Vercel and Render automatically deploy when you:
```bash
git push origin main
```

Changes will be live in 2-5 minutes!

---

## ❌ Troubleshooting

### Issue: "Cannot GET /"
- **Cause**: Frontend didn't build correctly
- **Fix**: Check Vercel logs, run `npm run build` locally in frontend folder

### Issue: "CORS error" in browser
- **Cause**: Backend CORS not configured for your frontend domain
- **Fix**: Check `FRONTEND_URL` in Render backend environment, must match exactly

### Issue: "Cannot connect to database"
- **Cause**: DATABASE_URL not set or incorrect
- **Fix**: Copy fresh connection string from Render database info page

### Issue: "POST /api/auth/login 404"
- **Cause**: Backend not deployed or wrong URL in frontend
- **Fix**: Verify `VITE_API_URL` in Vercel matches Render backend URL exactly

### Issue: "Blank white screen"
- **Cause**: Frontend loaded but API is unavailable
- **Fix**: Open browser F12, check Network tab for failed requests

---

## 📞 Need Help?

1. Check the full [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
2. Review [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
3. Check Render logs: Backend service → Logs
4. Check Vercel logs: Deployments → select deployment → Logs

---

## 🎯 After Deployment

### Monitor Your App
- Check logs weekly for errors
- Monitor Render for database connection issues
- Test login occasionally

### Keep It Running
- Vercel keeps apps running indefinitely on free tier
- Render keeps free services running 24/7 (dormancy warning after 15 min inactivity, but wakes up on request)
- Free database has limits: 256MB storage

### Next Steps
- Add a custom domain
- Set up error monitoring
- Configure email notifications
- Monitor performance

---

**Happy Deploying! 🚀**

Created: February 2, 2026
