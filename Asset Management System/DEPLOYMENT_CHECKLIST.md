# Asset Management System - Pre-Deployment Checklist

## ✅ Pre-Deployment Verification

### Code Quality
- [ ] All TypeScript errors resolved (`npm run lint` in both folders)
- [ ] No console errors in development build
- [ ] No sensitive data in code
- [ ] `.env` files added to `.gitignore`

### Backend Preparation
- [ ] `backend/.env.example` created with all required variables
- [ ] Database migrations are complete (`prisma migrate status`)
- [ ] `package.json` build script tested locally
- [ ] `npm run build` completes without errors
- [ ] `npm start` works locally
- [ ] API endpoints tested with Postman/curl

### Frontend Preparation
- [ ] `frontend/.env.example` created
- [ ] `npm run build` completes without errors
- [ ] `dist` folder generated correctly
- [ ] `VITE_API_URL` points to correct backend
- [ ] No hardcoded API URLs in code
- [ ] Responsive design tested on mobile

### Database
- [ ] PostgreSQL installed and running locally
- [ ] Migrations applied successfully
- [ ] Test user data seeded
- [ ] Backup strategy planned

### Security
- [ ] JWT_SECRET is cryptographically secure (32+ chars, random)
- [ ] Database password is strong
- [ ] No API keys in frontend
- [ ] CORS properly configured
- [ ] Rate limiting enabled

### Documentation
- [ ] README updated with deployment instructions
- [ ] Environment variables documented
- [ ] Deployment platform credentials secured
- [ ] Support contacts documented

---

## 🚀 Deployment Steps (Vercel + Railway Recommended)

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 2. Deploy Backend (Railway)
```
1. Go to railway.app
2. Create new project → Provision PostgreSQL
3. Connect GitHub repository
4. Set environment variables
5. Deploy
6. Copy backend URL
```

### 3. Deploy Frontend (Vercel)
```
1. Go to vercel.com
2. Import project from GitHub
3. Set root to './frontend'
4. Set VITE_API_URL env var
5. Deploy
6. Get frontend URL
```

### 4. Update Backend CORS
```
1. Get Vercel frontend URL
2. Update Railway backend variables:
   - FRONTEND_URL = https://your-vercel-app.vercel.app
3. Redeploy backend
```

### 5. Test Production
```bash
# Test backend health
curl https://your-railway-app.up.railway.app/api/health

# Test login
curl -X POST https://your-railway-app.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Visit frontend URL in browser
https://your-vercel-app.vercel.app
```

---

## 📊 Environment Variables Summary

### Backend Variables Needed
```
DATABASE_URL=postgresql://user:pass@host:5432/db
NODE_ENV=production
PORT=5000
JWT_SECRET=<random-32-char-string>
FRONTEND_URL=https://your-frontend-domain.com
CORS_ORIGINS=https://your-frontend-domain.com
```

### Frontend Variables Needed
```
VITE_API_URL=https://your-backend-domain.com
```

---

## 🔍 Verification Checklist

After Deployment:
- [ ] Frontend loads without errors
- [ ] Can login successfully
- [ ] Dashboard displays data
- [ ] Can perform CRUD operations
- [ ] API calls complete in <1 second
- [ ] Mobile view is responsive
- [ ] No console errors in browser
- [ ] HTTPS is enabled
- [ ] Logs show no errors

---

## 📞 Deployment Support

### Common Issues & Fixes

**"Cannot connect to database"**
- Verify DATABASE_URL is correct
- Check database is running and accessible
- Verify IP whitelist if using managed database

**"CORS error in browser"**
- Check FRONTEND_URL in backend environment
- Ensure frontend domain matches exactly
- Restart backend after changing

**"Build fails"**
- Check Node.js version is 18+
- Run `npm install` locally to verify
- Check all dependencies are listed in package.json

**"API returns 503 Service Unavailable"**
- Check backend deployment status
- Verify backend environment variables
- Check logs for errors

---

## 🎯 Post-Deployment

### Day 1
- Monitor logs for errors
- Test all critical workflows
- Verify performance
- Check database size

### Weekly
- Review error logs
- Monitor performance metrics
- Check for dependency updates
- Backup database

### Monthly
- Update dependencies
- Review security
- Optimize slow endpoints
- Plan scaling if needed

---

## 📚 Next Steps

1. Set up monitoring/alerting
2. Configure auto-backups
3. Set up CI/CD pipeline
4. Add custom domain
5. Set up email notifications
6. Configure analytics

---

**Status**: Ready for deployment
**Last Updated**: February 2, 2026
**Deployment Platform**: Vercel + Railway (Recommended)
