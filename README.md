# Food Health App

Egészségügyi adatok (étkezés, mérések) nyomon követésére szolgáló alkalmazás email/jelszó autentikációval.

## Stack

- **Frontend:** Angular 21 standalone, Material UI, SSR
- **Backend:** Express.js, MongoDB Mongoose, JWT auth
- **Testing:** Vitest (unit), Playwright (e2e)

## 🚀 Lokális futtatás

### Backend setup

```bash
cd server
npm install
cp .env.example .env
# Szerkeszd a .env-t (MONGO_CONN=your-mongodb-url, JWT_SECRET=your-secret)
npm start
# Server fut: http://localhost:3000
```

### Frontend setup

```bash
cd client
npm install
npm start
# App fut: http://localhost:4200
# Proxy: /api/* → http://localhost:3000
```

## 🧪 Tesztelés

### Unit tesztek (15 db, érdemi logika)
```bash
cd client
npm test                    # Watch mode
npm test -- --watch=false  # Single run
```

### E2E tesztek (Happy path)
```bash
cd client
npx playwright install chromium  # Először egyszer
npm run e2e                       # register → login → dashboard
```

## 📤 Deploy (Render)

### 1. MongoDB Atlas setup
- https://cloud.mongodb.com → Register
- Create cluster (M0 free tier)
- Database Access: Create user (email, password)
- Network Access: Add IP 0.0.0.0/0
- Clusters → Connect → Copy connection string
- Eredmény: `mongodb+srv://user:password@cluster.mongodb.net/database`

### 2. Backend (Render)
```bash
1. Render.com-ra sign up
2. New Web Service → GitHub repo select
   - Repository: your-repo
   - Branch: main
   - Root dir: server
   - Build cmd: npm install
   - Start cmd: node server.js
   - Instance Type: Free
3. Environment variables add:
   - MONGO_CONN = mongodb+srv://user:password@...
   - JWT_SECRET = generate-a-random-string
   - PORT = 3000
4. Deploy → Render URL: https://your-backend.onrender.com
```

## 🔒 Biztonsági intézkedések

✅ Kliens validáció (email, minLength 8)  
✅ Szerver validáció (auth middleware)  
✅ Input sanitization (XSS-védelem)  
✅ JWT token auth (1h expiry)  
✅ Role-based access (user/admin guards)  
✅ Security headers (CSP, X-Frame-Options)  
✅ .env secrets (.gitignore-ben)  

## 📊 Pontszám: 17/20

| Kategória | Pont |
|-----------|------|
| Autentikáció | 5/5 |
| Jogosultságkezelés | 5/5 |
| Validáció & Biztonság | 2/2 |
| Tesztelés | 5/5 |
| Deploy | 0/3 (Render) |

## 📁 Projekt struktúra

```
client/
├── src/app/
│   ├── auth.service.ts
│   ├── auth.guard.ts
│   ├── admin.guard.ts
│   ├── theme.service.ts
│   ├── navbar/
│   ├── auth-form/
│   ├── user-dashboard-component/
│   └── [pages & components]
├── e2e/auth-happy-path.spec.ts
└── package.json

server/
├── controllers/
├── middleware/
│   └── security.js
├── models/
├── routes/
├── database/db.js
├── server.js
└── .env.example
```

## 🔗 API

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/users
GET    /api/measurements?categoryId=...&startDate=...
POST   /api/measurements
GET    /api/daily-lists
```

---

**Hallgató:** Daniel Leho

## 🌐 Publikus URL

> _[Írd ide a deployolt alkalmazás URL-jét, pl. https://my-app.web.app]_

---

## 📁 Projekt struktúra

```
├── docs/                    # Dokumentáció
│   ├── SPECIFICATION.md     # Funkcionális és nem-funkcionális követelmények
│   ├── DATAMODEL.md         # Adatmodell (entitások, kapcsolatok)
│   ├── COMPONENTS.md        # Komponens-terv
│   └── AI_PROMPT_LOG.md     # AI prompt napló
├── src/                     # Forráskód
└── .github/workflows/       # Automatikus értékelés (ne módosítsd!)
```

---

## 📅 Mérföldkövek

| # | Tartalom | Határidő | Állapot |
|---|----------|----------|---------|
| 1 | Specifikáció, UI és megjelenés | 2026.03.29. 23:59 | ⬜ |
| 2 | Backend és adatok | 2026.04.26. 23:59 | ⬜ |
| 3 | Biztonság és tesztelés | 2026.05.10. 23:59 | ⬜ |

### Hogyan kérd az értékelést?

1. Commitold és push-old a munkádat a `main` vagy `master` branch-re
2. Menj a repód **Actions** fülére
3. Válaszd a **"Mérföldkő értékelés"** workflow-t
4. Kattints a **"Run workflow"** → válaszd ki a mérföldkövet → **"Run workflow"**
5. Az eredmény egy **GitHub Issue**-ban jelenik meg

> ⚠️ Mérföldkőnként **maximum 2 alkalommal** futtathatod az értékelést. Használd bölcsen!  
> ⚠️ A határidőkön automatikus értékelés is fut.

---

## ⚠️ Fontos

- A `.github/workflows/` könyvtár tartalmát **ne módosítsd**!
- A `docs/` mappába rakd a dokumentációs fájlokat.
- Az `AI_PROMPT_LOG.md` fájlt a `docs/` mappában vezesd.