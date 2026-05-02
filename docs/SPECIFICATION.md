# FoodHealthApp – Specifikáció

**Étkezés-Egészség-Monitoring webes alkalmazás**  
**2026. tavasz**

---

## 1. Áttekintés

A FoodHealth app egy webes alkalmazás, amellyel a felhasználók tudják követni, hogyan függ össze egészségük  a táplálkozásukkal. Az alkalmazás lehetővé teszi napi adatok felvitelét és elemzését.

### Technológiai stack
- **Frontend**: Angular (TypeScript)
- **Backend**: Express.js (Node.js)
- **Adatbázis**: MongoDB
- **Autentikáció**: JWT (JSON Web Token)

---

## 2. Felhasználói szerepkörök

| Szerepkör | Leírás |
|-----------|--------|
| **Felhasználó** | Regisztrálhat, egészségi adatokat rögzíthet, azokat elemzheti |
| **Admin** | Felhasználókat kezel |

---

## 3. Funkcionális követelmények

### 3.1. Autentikáció és fiókkezelés
- Regisztráció: email, jelszó
- Email megerősítés
- Bejelentkezés: email + jelszó -> JWT token
- Admin: előre regisztrált fiók

### 3.2. Felhasználói funkcionalitás
- **Adatok feljegyzése**:
  - Mérendő kategóriák (tömeg, vérnyomás, vércukor, stb.) felvenni
  - Napi lista: kiválasztott kategóriák gyors felvitelére
  - Adatok módosítása, törlése
  
- **Exportálás**:
  - Adatok és dokumentumok exportálása

### 3.3. Admin funkcionalitás
- Felhasználók kezelése (módosítás, törlés)

---

## 4. Nem-funkcionális követelmények

| Követelmény | Megvalósítás |
|------------|--------------|
| Jelszókezelés | bcrypt hash-elés |
| Autentikáció | JWT tokenek (lejárati idővel) |
| Hozzáférés-vezérlés | Role-based (RBAC) middleware |
| CORS | Kliens-szerver kommunikációhoz |
| Hibakezelés | HTTP státuszkódok, értelmes üzenetek |
| UI | Reszponzív (Angular Material komponensek) |
| Input validáció | Szerver és kliens oldali |

---

## 5. Adatmodell

Az adatmodell teljes specifikációja lásd: [DATAMODEL.md](DATAMODEL.md)

**Főbb entitások:**
- User (felhasználót)
- MeasurementCategory (mérendő kategóriák)
- Measurement (mérési adatok)
- DailyList (napi lista)

---

## 6. Felhasználói felületek

Az Angular komponens-terv teljes specifikációja lásd: [COMPONENTS.md](COMPONENTS.md)

### 6.1. Bejelentkezés nélküli
- Login oldal
- Registration oldal (szerepkör kiválasztással)

### 6.2. Felhasználói modul
- **Mérések** – Napi lista gyors felvitele, extra adatok
- **Előzmények** – Táblázatos összesítés, grafikonok, szűrés
- **Beállítások** – Profil, napi lista szerkesztése, exportálás

### 6.3. Admin modul
- **Felhasználók kezelése** – CRUD
- **Beállítások** – Profil, kijelentkezés

---

## 7. API endpoint-ok (Backend)

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/verify-email
```

### Felhasználó
```
GET    /api/users/me
PUT    /api/users/me
```

### Admin
```
DELETE /api/admin/users/:id
```

### Felhasználó adatok
```
POST   /api/measurements
GET    /api/measurements
PUT    /api/measurements/:id
DELETE /api/measurements/:id
```

### Kategóriák
```
POST   /api/categories
GET    /api/categories
```

### Napi lista
```
GET    /api/daily-list
PUT    /api/daily-list
```

## 8. Mappaszerkezet és dokumentáció

```
projektmunka-DanielLeho5/
├── /server                      # Express.js backend
├── /client                      # Angular frontend
├── /docs                        # Dokumentáció
│   ├── SPECIFICATION.md         # Ez a fájl – Áttekintés, követelmények
│   ├── DATAMODEL.md             # MongoDB adatmodellem
│   ├── COMPONENTS.md            # Angular komponens-terv
│   └── AI_PROMPT_LOG.md         # AI lekérdezések naplója
├── .github/                     # GitHub Actions / CI-CD
└── README.md                    # Telepítési útmutató
```

---

## 9. Biztonsági megkövetelések

| Terület | Megvalósítás |
|--------|-------------|
| Jelszókezelés | bcrypt hash-elés (salt rounds: 10) |
| Autentikáció | JWT (HS256), max 24 óra lejárat |
| Hozzáférés-vezérlés | Role-based (RBAC) Express middleware |
| CORS | Kliens origin csak engedélyezettekből |
| Input validáció | Szerver és kliens oldali |
| Adatvédelem | Felhasználó adatok csak felhasználónak + dietetikusnak látható |
| HTTPS | Production esetén kötelező |
