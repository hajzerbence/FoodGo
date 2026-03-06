# 🍔 FoodGo - Ételfutár Webalkalmazás

<p align="center">
  <img src="frontend/Média/FoodGo logo.png" alt="FoodGo Logo" width="200"/>
</p>

<p align="center">
  <strong>Wolt / Foodora jellegű webes ételrendelő rendszer</strong><br/>
  Node.js · Express · MySQL · Vanilla JS · Bootstrap
</p>

---

## 📋 Tartalomjegyzék

- [Leírás](#leírás)
- [Funkciók](#funkciók)
- [Technológiák](#technológiák)
- [Projektstruktúra](#projektstruktúra)
- [Telepítés és futtatás](#telepítés-és-futtatás)
- [Adatbázis beállítása](#adatbázis-beállítása)
- [API végpontok](#api-végpontok)
- [Oldalak és útvonalak](#oldalak-és-útvonalak)
- [Éttermek](#éttermek)
- [Készítők](#készítők)

---

## 📖 Leírás

A **FoodGo** egy teljes értékű, Wolt/Foodora stílusú webes ételrendelő alkalmazás. A rendszer lehetővé teszi a felhasználók számára, hogy különböző éttermek kínálatát böngésszék, termékeket adjanak a kosarukhoz, és megrendeléseket adjanak le. Az alkalmazás tartalmaz felhasználói fiókkezelést, munkamenet-alapú autentikációt, kosárkezelést, profilszerkesztést és egy adminisztrátori felületet.

---

## ✨ Funkciók

### 👤 Felhasználói funkciók

- **Regisztráció** - Név, e-mail, telefonszám és jelszó megadásával
- **Bejelentkezés / Kijelentkezés** - Session alapú autentikáció
- **Profilkezelés** - Személyes adatok és jelszó módosítása
- **Éttermek böngészése** - 9 különböző étterem és kínálatuk megtekintése
- **Kosárkezelés** - Termékek hozzáadása, eltávolítása, mennyiség módosítása
- **Kínálat oldal** - Összes étterem áttekintése kategóriák szerint

### 🔐 Hozzáférés-védelem

- Bejelentkezés nélkül csak a Bejelentkezés, Regisztráció, ÁSZF és Adatvédelmi tájékoztató oldalak érhetők el
- Direkt HTML URL-elérések szerver oldali middleware-rel védve
- Admin felület kizárólag admin jogú felhasználók számára érhető el

### 🛠️ Admin funkciók

- Felhasználók listázása (jelszó nélkül)
- Felhasználói adatok módosítása
- Admin jogosultság ki-/bekapcsolása
- Felhasználók törlése

---

## 🛠️ Technológiák

### Backend

| Technológia                                                      | Verzió  | Leírás                                            |
| ---------------------------------------------------------------- | ------- | ------------------------------------------------- |
| [Node.js](https://nodejs.org/)                                   | -       | Szerver oldali JavaScript futtatókörnyezet        |
| [Express](https://expressjs.com/)                                | ^5.1.0  | Webes keretrendszer, routing és middleware        |
| [express-session](https://www.npmjs.com/package/express-session) | ^1.18.2 | Munkamenet-kezelés                                |
| [mysql2](https://www.npmjs.com/package/mysql2)                   | ^3.15.2 | MySQL adatbázis kapcsolat (Promise API)           |
| [multer](https://www.npmjs.com/package/multer)                   | ^2.0.2  | Fájlfeltöltés kezelése                            |
| [cors](https://www.npmjs.com/package/cors)                       | ^2.8.6  | Cross-Origin Resource Sharing                     |
| [nodemon](https://www.npmjs.com/package/nodemon)                 | ^3.1.11 | Automatikus szerver újraindítás fejlesztés közben |

### Frontend

| Technológia                            | Leírás                         |
| -------------------------------------- | ------------------------------ |
| HTML5                                  | Oldalstruktúra                 |
| CSS3                                   | Egyedi stílusok                |
| Vanilla JavaScript                     | Dinamikus működés, API hívások |
| [Bootstrap](https://getbootstrap.com/) | Reszponzív UI komponensek      |

### Adatbázis

| Technológia    | Leírás                                                         |
| -------------- | -------------------------------------------------------------- |
| MySQL          | Relációs adatbázis                                             |
| mysql2/promise | Aszinkron, paraméterezett lekérdezések (SQL injection védelem) |

---

## 📁 Projektstruktúra

```
FoodGo-main/
├── backend/
│   ├── server.js            # Express szerver, routing, middleware-ek
│   ├── package.json         # Függőségek
│   ├── api/
│   │   └── api.js           # REST API végpontok
│   ├── sql/
│   │   ├── database.js      # Adatbázis kapcsolat és SQL lekérdezések
│   │   └── database.sql     # Adatbázis séma és kezdő adatok
│   └── http/
│       └── teszt.http       # API tesztelési fájl
└── frontend/
    ├── Bejelentkezés/       # Bejelentkezési oldal
    ├── Regisztráció/        # Regisztrációs oldal
    ├── Főoldal/             # Főoldal (bejelentkezés szükséges)
    ├── Kínálat/             # Éttermek áttekintője
    ├── Kosár/               # Kosár oldal
    ├── Profil/              # Profilkezelés
    ├── Admin/               # Adminisztrátori felület
    ├── Kapcsolat/           # Kapcsolat oldal
    ├── Rólunk/              # Rólunk oldal
    ├── Adatvédelmi tájékoztató/
    ├── Általános Szerződési Feltételek/
    ├── Éttermek&Termékek/   # Éttermi oldalak
    │   ├── KFC/
    │   ├── McDonalds/
    │   ├── BuddhaOriginal/
    │   ├── IbrahimTorokBufe/
    │   ├── wokngo/
    │   ├── StarKebab/
    │   ├── SofraEtterem/
    │   ├── KinaiNagyfalBufe/
    │   └── SimonsBurger/
    ├── Bootstrap/           # Bootstrap CSS/JS
    └── Média/               # Képek, logók, termékfotók
```

---

## 🚀 Telepítés és futtatás

### Előfeltételek

- [Node.js](https://nodejs.org/) (LTS verzió ajánlott)
- [MySQL](https://www.mysql.com/) szerver (pl. XAMPP, WAMP, vagy natív MySQL)

### 1. Projekt letöltése

```bash
git clone https://github.com/felhasznalo/FoodGo-main.git
cd FoodGo-main
```

### 2. Függőségek telepítése

```bash
cd backend
npm install
```

### 3. Adatbázis beállítása

Lásd az [Adatbázis beállítása](#adatbázis-beállítása) részt.

### 4. Szerver indítása

```bash
# Fejlesztői módban (automatikus újraindítás):
npm run dev

# Éles módban:
npm start
```

### 5. Az alkalmazás megnyitása

Nyisd meg a böngészőben: **[http://127.0.0.1:3000](http://127.0.0.1:3000)**

---

## 🗄️ Adatbázis beállítása

1. Indítsd el a MySQL szervert.
2. Nyisd meg a `backend/sql/database.sql` fájlt egy SQL klienssel (pl. phpMyAdmin, MySQL Workbench, DBeaver).
3. Futtasd le a teljes fájl tartalmát - ez létrehozza a `foodgo` adatbázist, a táblákat, és feltölti az összes étterem termékeit.

#### Adatbázis kapcsolat konfigurálása

A kapcsolati beállítások a `backend/sql/database.js` fájlban találhatók:

```javascript
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',       // ← Add meg a MySQL jelszavadat
    database: 'foodgo',
    ...
});
```

#### Adatbázis séma

**`felhasznalo` tábla**
| Mező | Típus | Leírás |
|---|---|---|
| `id` | INT, AUTO_INCREMENT, PK | Egyedi azonosító |
| `nev` | VARCHAR(120) | Teljes név |
| `email` | VARCHAR(120), UNIQUE | E-mail cím |
| `telefonszam` | VARCHAR(20) | Telefonszám |
| `jelszo` | VARCHAR(255) | Jelszó |
| `admine` | BOOLEAN | Admin jogosultság (alapértelmezett: false) |

**`termekek` tábla**
| Mező | Típus | Leírás |
|---|---|---|
| `id` | INT, AUTO_INCREMENT, PK | Egyedi azonosító |
| `nev` | VARCHAR(100) | Termék neve |
| `leiras` | TEXT | Leírás |
| `ar` | INT | Ár (Ft) |
| `kep_utvonal` | VARCHAR(255) | Képfájl útvonala |
| `etterem_azonosito` | VARCHAR(50) | Étterem kódja (pl. `kfc`, `mcdonalds`) |
| `kategoria` | VARCHAR(50) | Kategória (pl. `menu`, `burger`, `leves`) |

#### Alapértelmezett admin fiók

> ⚠️ Az adatbázis feltöltő SQL tartalmaz egy admin felhasználót. Éles környezetben cseréld le a jelszavát!

---

## 🔌 API végpontok

Az összes API végpont a `/api` prefix alatt érhető el.

### 🔓 Nyilvános végpontok

| Metódus | Végpont              | Leírás                          |
| ------- | -------------------- | ------------------------------- |
| `POST`  | `/api/ujFelhasznalo` | Új felhasználó regisztrálása    |
| `POST`  | `/api/bejelentkezes` | Bejelentkezés (session indítás) |
| `GET`   | `/api/test`          | API működési teszt              |

### 🔐 Bejelentkezés szükséges

| Metódus | Végpont                          | Leírás                                                  |
| ------- | -------------------------------- | ------------------------------------------------------- |
| `GET`   | `/api/bejelentkezettFelhasznalo` | Aktuális felhasználó lekérése                           |
| `POST`  | `/api/kijelentkezes`             | Kijelentkezés (session törlés)                          |
| `GET`   | `/api/profil`                    | Saját profiladatok lekérése                             |
| `POST`  | `/api/profil`                    | Profil módosítása (`adatModositas` / `jelszoModositas`) |
| `GET`   | `/api/termekek/:etterem`         | Termékek lekérése étterem azonosító szerint             |

### 🛡️ Admin jogosultság szükséges

| Metódus | Végpont      | Leírás                                                                                   |
| ------- | ------------ | ---------------------------------------------------------------------------------------- |
| `GET`   | `/api/admin` | Felhasználók listázása                                                                   |
| `POST`  | `/api/admin` | Admin műveletek (`felhasznaloTorles`, `felhasznaloAdminAllitas`, `felhasznaloModositas`) |

---

## 🗺️ Oldalak és útvonalak

| Útvonal                            | Oldal                   | Védelem          |
| ---------------------------------- | ----------------------- | ---------------- |
| `/`                                | Bejelentkezés           | Nyilvános        |
| `/regisztracio`                    | Regisztráció            | Nyilvános        |
| `/altalanos-szerzodesi-feltetelek` | ÁSZF                    | Nyilvános        |
| `/adatvedelmi-tajekoztato`         | Adatvédelmi tájékoztató | Nyilvános        |
| `/fooldal`                         | Főoldal                 | 🔐 Bejelentkezés |
| `/kinalat`                         | Kínálat                 | 🔐 Bejelentkezés |
| `/kosar`                           | Kosár                   | 🔐 Bejelentkezés |
| `/profil`                          | Profil                  | 🔐 Bejelentkezés |
| `/rolunk`                          | Rólunk                  | 🔐 Bejelentkezés |
| `/kapcsolat`                       | Kapcsolat               | 🔐 Bejelentkezés |
| `/kfc`                             | KFC étterem             | 🔐 Bejelentkezés |
| `/mcdonalds`                       | McDonald's étterem      | 🔐 Bejelentkezés |
| `/buddhaoriginal`                  | Buddha Original         | 🔐 Bejelentkezés |
| `/ibrahimtorokbufe`                | Ibrahim Török Büfé      | 🔐 Bejelentkezés |
| `/wokngo`                          | Wok'n Go                | 🔐 Bejelentkezés |
| `/starkebab`                       | Star Kebab              | 🔐 Bejelentkezés |
| `/sofraetterem`                    | Sofra Étterem           | 🔐 Bejelentkezés |
| `/kinainagyfalbufe`                | Kínai Nagyfal Büfé      | 🔐 Bejelentkezés |
| `/simonsburger`                    | Simon's Burger          | 🔐 Bejelentkezés |
| `/admin`                           | Admin felület           | 🛡️ Admin         |

---

## 🍽️ Éttermek

Az alkalmazás az alábbi 9 éttermet és kínálatukat tartalmazza:

| Étterem                   | Azonosító          | Kategória | Termékek száma |
| ------------------------- | ------------------ | --------- | -------------- |
| 🍗 **KFC**                | `kfc`              | Amerikai  | 6              |
| 🍔 **McDonald's**         | `mcdonalds`        | Amerikai  | 6              |
| 🍜 **Buddha Original**    | `buddhaoriginal`   | Ázsiai    | 6              |
| 🥙 **Ibrahim Török Büfé** | `ibrahimtorokbufe` | Török     | 6              |
| 🥡 **Wok'n Go**           | `wokngo`           | Ázsiai    | 6              |
| ⭐ **Star Kebab**         | `starkebab`        | Török     | 6              |
| 🫕 **Sofra Étterem**      | `sofraetterem`     | Török     | 6              |
| 🏯 **Kínai Nagyfal Büfé** | `kinainagyfalbufe` | Ázsiai    | 6              |
| 🍔 **Simon's Burger**     | `simonsburger`     | Amerikai  | 6              |

---

## 👨‍💻 Készítők

| Név               | Szerepkör                                                             |
| ----------------- | --------------------------------------------------------------------- |
| **Czeglédi Máté** | Frontend fejlesztés, UI/UX, reszponzív dizájn, checkout logika        |
| **Hajzer Bence**  | Backend fejlesztés, adatbázis tervezés, autentikáció, rendeléskezelés |

---

## 📄 Licenc

Ez a projekt az **ISC** licenc alatt áll. Részletek a [`LICENSE`](LICENSE) fájlban.

---

<p align="center">© 2025 FoodGo Project - Czeglédi Máté & Hajzer Bence</p>
