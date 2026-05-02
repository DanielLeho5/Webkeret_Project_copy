# Adatmodell – MongoDB sémák

**FoodHealthApp adatbázis-sémái**

---

## 1. User (Felhasználó)

```javascript
{
  _id: ObjectId,
  email: String,              // unique, pl.: example@gmail.com
  emailVerified: Boolean,     // default: false
  password: String,           // bcrypt hash
  role: String,               // 'user' | 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

**Indexek:**
- `email` (unique)
- `createdAt`

---

## 2. MeasurementCategory (Mérendő kategória)

```javascript
{
  _id: ObjectId,
  name: String,              // pl.: "Tömeg", "Vérnyomás", "Vércukor"
  unit: String,              // pl.: "kg", "mmHg", "mg/dL"
  createdBy: ObjectId,       // User ID (admin vagy felhasználó)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexek:**
- `createdBy`

---

## 3. Measurement (Mérési adat)

```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // User ID
  categoryId: ObjectId,      // MeasurementCategory ID
  value: Number,             // pl.: 75.5
  date: Date,                // mérés dátuma
  createdAt: Date,
  updatedAt: Date
}
```

**Indexek:**
- `userId` + `date` (compound)
- `userId`

---

## 4. DailyList (Napi lista)

```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // User ID
  categories: [              // MeasurementCategory IDs
    ObjectId,
    ObjectId
  ],
  order: Number,             // sorrend
  updatedAt: Date
}
```

**Indexek:**
- `userId` (unique)

---

## 5. DailyFoodList (Napi étkezési lista)

```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // User ID
  date: Date,             // lista dátuma
  foods: [{               // étkezési elemek
    _id: ObjectId,
    name: String,         // étel neve, pl.: "Alma"
    quantity: Number,     // mennyiség, pl.: 150
    unit: String,         // mértékegység, pl.: "g", "ml", "db"
    calories: Number,     // kalória (opcionális)
    protein: Number,      // fehérje (opcionális)
    carbs: Number,        // szénhidrát (opcionális)
    fat: Number           // zsír (opcionális)
  }],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexek:**
- `userId` + `date` (compound)

---

## Relációk summary

```
User
├─ 1 : N → DailyList (felhsasználó-napi lista)
├─ 1 : N → DailyFoodList (felhasználó-napi étkezési lista)
├─ 1 : N → Measurement (felhsasználó-mérések)
├─ 1 : N → MeasurementCategory (felhsasználó-mérési-kategóriák)

MeasurementCategory
└─ 1 : N → Measurement
```

---