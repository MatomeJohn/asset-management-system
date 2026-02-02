# Deployment Environment Variables

## For Render Backend Deployment

Use these variable names and values when setting up your Render web service.

### Required Variables

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-generated-secret-here
DATABASE_URL=postgresql://user:password@host:5432/db
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### How to Generate JWT_SECRET

**Safe Random String** (pick one method):

**Method 1: Online**
- Visit: https://www.uuidgenerator.net
- Copy the generated UUID

**Method 2: PowerShell (Windows)**
```powershell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString())) | Write-Host
```

**Method 3: Terminal (Linux/Mac)**
```bash
openssl rand -base64 32
```

**Method 4: Node.js (Any Platform)**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Example values** (generate your own, don't use these!):
- `mB3kL9pQ2xZ7wN4jF6rT5sH8dM1vY0uC`
- `a7f2e9b1c3d5f7g9h1j3k5m7n9p1q3r5`
- `x9Y2z5K8L1M4N7O0P3Q6R9S2T5U8V1W4`

---

## For Vercel Frontend Deployment

Use these variable names when setting up your Vercel project.

### Required Variables

```
VITE_API_URL=https://your-backend-domain.onrender.com
```

**Example**: `https://ams-backend-abc123.onrender.com`

---

## For Local Development

Create these files in your local machine:

### `backend/.env.local`

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ams_dev"
NODE_ENV=development
PORT=5000
JWT_SECRET="dev-secret-key-for-local-testing"
FRONTEND_URL="http://localhost:3000"
CORS_ORIGINS="http://localhost:3000,http://localhost:3001,http://localhost:5173"
```

### `frontend/.env.local`

```env
VITE_API_URL="http://localhost:5000"
```

---

## Environment Variable Reference

### Backend (.env)

| Variable | Example Value | Description |
|----------|---------------|-------------|
| `NODE_ENV` | `production` | Set to production for live |
| `PORT` | `10000` | Port for Render (use 10000) |
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection string |
| `JWT_SECRET` | `abc123...xyz` | Secret key for JWT tokens (32+ chars) |
| `FRONTEND_URL` | `https://app.vercel.app` | Your frontend domain |
| `CORS_ORIGINS` | `https://app.vercel.app` | Comma-separated allowed origins |

### Frontend (.env)

| Variable | Example Value | Description |
|----------|---------------|-------------|
| `VITE_API_URL` | `https://backend.onrender.com` | Your backend URL |

---

## How to Get DATABASE_URL from Render

1. Go to Render Dashboard
2. Click on your PostgreSQL database
3. Copy from the "Connections" section:
   - Look for "Internal Database URL" (if from same region)
   - Or "External Database URL"
4. Format: `postgresql://user:password@host:port/dbname`

---

## How to Configure Variables in Render

1. Go to Render Dashboard
2. Select your Web Service (backend)
3. Click "Environment"
4. Click "Add Environment Variable"
5. Enter **Key** and **Value**
6. Click "Save"
7. Service redeploys automatically

---

## How to Configure Variables in Vercel

1. Go to Vercel Dashboard
2. Select your Project (frontend)
3. Click "Settings"
4. Click "Environment Variables"
5. Enter **Name** and **Value**
6. Select which environments (Production/Preview/Development)
7. Click "Save"
8. Redeploy to apply changes

---

## Security Notes

✅ **DO**:
- Generate unique JWT_SECRET (don't reuse)
- Keep database password secure
- Never commit `.env` files
- Regenerate secrets if compromised
- Use HTTPS (automatic on Render/Vercel)

❌ **DON'T**:
- Share JWT_SECRET with anyone
- Use simple passwords
- Commit .env to Git
- Use same secret in dev and production
- Display sensitive values in logs

---

## Testing Variables Locally

```bash
# Test backend with local .env.local
cd backend
npm install
npm run dev

# Should start on http://localhost:5000

# Test frontend with local .env.local
cd frontend
npm install
npm run dev

# Should start on http://localhost:3000 or http://localhost:5173
```

---

## If Variables Don't Apply

If you change a variable:

**For Render**:
- Save the variable
- Service automatically redeploys
- Wait 1-2 minutes
- Check logs for success

**For Vercel**:
- Variable applies to future deployments
- To apply immediately:
  - Trigger redeploy manually (gear icon → Redeploy)
  - OR push a new commit to Git

---

Created: February 2, 2026
