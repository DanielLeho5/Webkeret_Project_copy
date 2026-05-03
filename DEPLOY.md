# Deploy Guide: Render (Frontend + Backend)

Full stack deployment on Render. Works with GitHub Classroom repos (no OAuth needed).

**Key Fix for Status 127 error:** Use `npx ng build` not `ng build` in Build Command

## Step-by-step deployment

### Phase 1: Prepare GitHub

1. Push code to GitHub
   ```bash
   git add .
   git commit -m "Ready for deploy"
   git push origin main
   ```

2. Verify files exist:
   - ✅ `server/.env.example`
   - ✅ `README.md`
   - ✅ `client/src/app/auth.service.ts` (reads API_URL)
   - ✅ `client/src/app/app.config.ts` (APP_INITIALIZER sets window.API_URL)

---

### Phase 2: Database (MongoDB Atlas)

1. Go to https://cloud.mongodb.com
2. Sign up (Google or email)
3. Create Organization → Create Project
4. Create Cluster:
   - Select **M0 FREE** tier
   - Cloud Provider: AWS
   - Region: (closest to you)
   - Wait 1-2 min for creation
5. Security → Database Access:
   - Add Database User
   - Username: `dev` (or any)
   - Password: (generate strong password)
   - Database User Privileges: Read and write to any database
6. Security → Network Access:
   - Add IP Address: **0.0.0.0/0** (allows Render access)
7. Clusters → Connect:
   - Choose "Connect your application"
   - Driver: Node.js
   - Version: 4.1 or later
   - Copy connection string:
     ```
     mongodb+srv://dev:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Replace `<password>` with actual password
   - Result: `mongodb+srv://dev:mypassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

---

### Phase 3: Backend Deployment (Render)

1. Dashboard → New → **Web Service**
3. Choose **Public Git Repository** tab
4. Paste URL:
   ```
   https://github.com/webfejlesztesi-keretrendszerek-2026/projektmunka-DanielLeho5.git
   ```
5. Click Create → Configure:
   - **Name:** `food-health-api`
   - **Runtime:** Node
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Region:** Frankfurt
   - **Instance:** Free
6. **Environment Variables** (add each):
   - `MONGO_CONN`: `mongodb+srv://dev:YourPassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET`: `your-min-32-char-secret-key-abcdefghijklmnopqrstuvwxyz`
   - `PORT`: `3000`
7. Click Create Web Service
8. Wait 3-5 min for green status
9. Verify: `curl https://food-health-api.onrender.com/health`
   - Should return: `{"status":"OK","timestamp":"..."}`
10. **Copy your URL:** `https://food-health-api.onrender.com` (use this next)
   - Should return: `{"status":"OK","timestamp":"2026-05-02T..."}`

---

### Phase 4: Frontend Deployment (Render) - Option A: Static Site (Recommended)

**Easiest option - no server needed:**

1. Dashboard → New → **Static Site**
2. Choose **Public Git Repository** tab
3. Paste URL:
   ```
   https://github.com/webfejlesztesi-keretrendszerek-2026/projektmunka-DanielLeho5.git
   ```
4. Click Create → Configure:
   - **Name:** `food-health-app`
   - **Build Command:**
     ```bash
     cd client && npm install && npx ng build
     ```
   - **Publish Directory:** `client/dist/food-health-app/browser`
   - **Root Directory:** (empty)
5. Click Create Static Site
6. Wait 2-3 min for deployment
7. Copy your URL: `https://food-health-app-xxxxx.onrender.com`
8. Go back to **backend service** → **Environment** and add:
   - `CORS_ORIGIN`: `https://food-health-app-xxxxx.onrender.com` (use your actual frontend URL)

---

### Phase 4: Frontend Deployment (Render) - Option B: Web Service with Node Server

**If you prefer Web Service instead:**

1. First, create a simple server file. In `client/` folder, create `server.js`:
   ```javascript
   const express = require('express');
   const path = require('path');
   const app = express();
   
   const PORT = process.env.PORT || 3000;
   const DIST_PATH = path.join(__dirname, 'dist/food-health-app/browser');
   
   app.use(express.static(DIST_PATH));
   app.get('/*', (req, res) => {
     res.sendFile(path.join(DIST_PATH, 'index.html'));
   });
   
   app.listen(PORT, () => {
     console.log(`Frontend server running on port ${PORT}`);
   });
   ```

2. Add to `client/package.json` (in scripts section):
   ```json
   "start": "node server.js"
   ```

3. In Render Dashboard → New → **Web Service**
4. Choose **Public Git Repository** tab
5. Paste URL:
   ```
   https://github.com/webfejlesztesi-keretrendszerek-2026/projektmunka-DanielLeho5.git
   ```
6. Click Create → Configure:
   - **Name:** `food-health-app`
   - **Runtime:** Node
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npx ng build`
   - **Start Command:** `npm start`
   - **Region:** Frankfurt
   - **Instance:** Free
7. **Environment Variables:**
   - `API_URL`: `https://food-health-api.onrender.com` (from Phase 3)
   - `NODE_ENV`: `production`
8. Click Create Web Service
9. Wait 5-10 min for green status

---

### Phase 5: Verify Deployment
: `https://food-health-app.onrender.com` (wait 30s for cold start)
2. Register: new account with email + password
3. Login: use credentials
4. Dashboard: should show form fields
5. Add data: create a measurement
6. Refresh page: data persists
7. Logout → Login: data still there ✅
6. Logout → Login again → data persists

---

## T❌ Build exits with Status 127
**Problem:** `ng: command not found`  
**Fix:** Build Command must use `npx ng build` not `ng build`

### ❌ Build fails: "Cannot find module '@angular/cli'"
**Problem:** npm install didn't run  
**Fix:** Build Command: `cd client && npm install && npx ng build`

### ❌ "Cannot GET /api/auth/login" (404)
**Problem:** Frontend can't reach backend  
**Fix:**
- Check frontend `API_URL` env var = backend URL
- Backend URL should be: `https://food-health-api.onrender.com`
- Test: `curl https://food-health-api.onrender.com/health`

### ❌ "MongoDB connection error"
**Problem:** Database not reachable  
**Fix:**
- Check `MONGO_CONN` has no typos
- Check MongoDB Atlas Network Access = `0.0.0.0/0`
- Test locally: `mongosh "your-connection-string"`

### ❌ App loads but can't add data
**Problem:** Backend API call fails  
**Fix:**
- Check Render backend logs (Render dashboard → service → logs)
- Check `JWT_SECRET` is set on backend
- Check `MONGO_CONN` is correct

### ❌ Cold start takes 30+ seconds
**Normal for free tier** (spins down after 15 min)  
**Solution:** Upgrade to $7/mo Render tier for always-onon Render)  
→ Test backend: `curl https://food-health-api.onrender.com/health`  
→ Should return: `{"status":"OK","timestamp":"..."}`

---
Render (2x services) | Yes | 750 free tier hours/mo (750÷2=375h each) |
| MongoDB Atlas | 512 MB free | Enough for testing |
| **Total** | **~$0** | Full stack free for testing |

**Note:** Free tier spins down after 15 min inactivity. First request takes ~30s.  
To keep always-on: Render paid tier ($7/mo per service)
|---------|-----------|-------|
| Render | Yes | 750 free tier hours/mo |
| MongoDB | 512 MB free | Enough for testing |
| **Total** | **~$0** | Full stack free for testing |

---

## Next steps after deploy

1. Add custom domain (Render supports)
2. Set up SSL (automatic on both)
3. Add email notifications / monitoring
4. Set up CI/CD on GitHub (auto-deploy on push)
5. Add more E2E tests before production

---

**Happy deploying! 🚀**
