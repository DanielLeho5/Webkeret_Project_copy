# Angular Komponens-terv

**FoodHealthApp komponens-architektúra**

---

## Közös komponensek (Shared)

| Komponens | Leírás |
|-----------|--------|
| **Navbar** | Felső navigáció, role-alapú menü, kijelentkezés |
| **LoadingSpinnerComponent** | Betöltési animáció |
| **ConfirmDialogComponent** | Megerősítési dialógus eltávolítás/módosításhoz |
| **PaginationComponent** | Oldal navigáció táblázatokhoz |
| **PageNotFound** | 404 Hibaoldal |

---

## Auth modul (Nem bejelentkezett)

### LoginFormComponent
  - Email input
  - Jelszó input
  - Bejelentkezés gomb
  - "Regisztrálj" link

### RegistrationFormComponent
  - Név input
  - E-mail input
  - Jelszó input
  - Regisztráció gomb

---

## Felhasználó modul

### Dashboard / Mérések oldal
- **UserDashboardPageComponent**
  
  - **DailyListFormComponent**
    - Napi lista kategóriáinak megfelelő inputok
  
  - **DailyFoodListFormComponent**
    - Étel hozzáadása: név, mennyiség, mértékegység
    - Hozzáadás gomb
    - Ételek listája szerkesztéssel/törléssel
  
  - **SingleEntryFormComponent** (extra adatok)
    - Dropdown: kategória kiválasztása
    - Input: érték
    - Hozzáadás gomb
  
  - Mentés gomb

### Előzmények oldal
- **HistoryPageComponent**
  
  - **HistoryFilterComponent**
    - Dátum szűrés (From - To)
    - Kategória szűrő
  
  - **HistoryTableComponent**
    - Táblázat: Dátum | Kategória | Érték | Akciók
    - Szerkesztés / Törlés gombok
    - Lapozás (tolás)
    - Fájl csatolás lehetőség

### Beállítások oldal
- **SettingsPage**
  
  - Tab 1: Profil
    - **ProfileSettingsComponent**
      - Teljes név módosítás
      - Születési idő módosítás
      - E-mail (csak olvasható)
      - Jelszó módosítás
      - Mentés gomb
  
  - Tab 2: Napi lista
    - **DailyListSettingsComponent**
      - Kiválasztott kategóriák sorrendje
      - Drag & drop sorrendezéshez
      - +/- gombok kategóriák hozzáadásához/eltávolításához
  
  - Tab 3: Adatexportálás
    - **ExportDataComponent**
      - Exportálás formátuma (CSV, JSON)
      - Dátumtartomány
      - Download gomb
  
  - Tab 4: Fiók
    - **AccountActionsComponent**
      - Kijelentkezés gomb

---

## Admin modul

### Felhasználók kezelése oldal
- **AdminUsersPageComponent**
  
  - **UserSearchComponent**
    - Email/név keresés
  
  - **UserTableComponent**
    - Táblázat: Név | Email | Role | Akciók
    - Szerkesztés
    - Törlés (megerősítéssel)
  
  - **UserModalComponent** (szerkesztéshez)
    - Felhasználó adatai
    - Role módosítás dropdown
    - Mentés/Mégse gombok

### Beállítások oldal
- **AdminSettingsPageComponent**
  
  - Tab 1: Profil
  - Tab 2: Fiók
    - Kijelentkezés

---