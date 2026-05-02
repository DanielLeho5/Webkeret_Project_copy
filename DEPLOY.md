# Deploy Guide: Netlify + Render

## Step-by-step deployment

### Phase 1: Prepare GitHub

1. Push code to GitHub
   ```bash
   git add .
   git commit -m "Ready for deploy"
   git push origin main
   ```

2. Ensure these files exist:
   - `client/netlify.toml` ✅
   - `server/.env.example` ✅
   - `README.md` ✅

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

1. Go to https://render.com
2. Sign up with GitHub (easier)
3. New → Web Service
4. Connect Repository:
   - Search your GitHub repo
   - Connect
5. Configure:
   - **Name:** `food-health-api` (or any)
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free (for testing)
   - **Region:** Frankfurt (or nearest)
6. Environment Variables (add these):
   - Key: `MONGO_CONN`
     Value: `mongodb+srv://dev:mypassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
   - Key: `JWT_SECRET`
     Value: `your-super-secret-key-min-32-chars-recommended`
   - Key: `PORT`
     Value: `3000`
7. Create Web Service
8. Wait for deploy (2-5 min)
9. Once deployed, copy your URL: `https://food-health-api.onrender.com`
   - Test: `curl https://food-health-api.onrender.com/health`
   - Should return: `{"status":"OK","timestamp":"2026-05-02T..."}`

---

### Phase 4: Frontend Deployment (Netlify)

1. Go to https://netlify.com
2. Sign up with GitHub (easier)
3. New site from Git:
   - Select your GitHub repo
4. Build settings:
   - **Base directory:** `client`
   - **Build command:** `ng build`
   - **Publish directory:** `dist/food-health-app/browser`
   - **Node version:** 20.x (set in netlify.toml or UI)
5. Environment variables (add these):
   - Key: `API_URL`
     Value: `https://food-health-api.onrender.com`
6. Deploy site
7. Once deployed, copy your URL: `https://your-app.netlify.app`

---

### Phase 5: Verify Deployment

1. Open browser: `https://your-app.netlify.app`
2. Register new account
3. Login
4. Check if dashboard loads
5. Try to add measurement data
6. Logout → Login again → data persists

---

## Troubleshooting

### "Cannot GET /api/auth/login" (404)
→ Check `API_URL` environment variable on Netlify  
→ Check CORS on Render (should be set to allow Netlify URL)

### "mongodb connection error"
→ Check `MONGO_CONN` on Render  
→ Check Network Access on MongoDB Atlas (0.0.0.0/0)  
→ Test connection: `mongosh "your-connection-string"`

### "Netlify build fails"
→ Check `ng build` locally works: `cd client && ng build`  
→ Check `node_modules` is in .gitignore  
→ Check Node version (18+)

### "SSR not working"
→ Ensure `netlify.toml` is in client root  
→ Ensure build output: `dist/food-health-app/browser` exists locally

---

## Cost estimate

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Netlify | Yes | Unlimited free (with ads) |
| Render | Yes | 750 free tier hours/mo |
| MongoDB | 512 MB free | Enough for testing |
| **Total** | **~$0** | Full stack free for testing |

---

## Next steps after deploy

1. Add custom domain (both Netlify & Render support)
2. Set up SSL (automatic on both)
3. Add email notifications / monitoring
4. Set up CI/CD on GitHub (auto-deploy on push)
5. Add more E2E tests before production

---

**Happy deploying! 🚀**
