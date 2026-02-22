//!Module-ok importálása
const express = require('express'); //?npm install express
const session = require('express-session'); //?npm install express-session
const adatbazis = require('./sql/database.js'); //? admin ellenőrzéshez kell
const path = require('path');

//!Beállítások
const app = express();
const router = express.Router();

const ip = '127.0.0.1';
const port = 3000;

app.use(express.json()); //?Middleware JSON
app.set('trust proxy', 1); //?Middleware Proxy

//!Session beállítása:
app.use(
    session({
        secret: 'titkos_kulcs', //?Ezt generálni kell a későbbiekben
        resave: false,
        saveUninitialized: true
    })
);

//! Middleware-k (oldal védelemhez):
function bejelentkezesKotelezoOldalhoz(request, response, next) {
    // HTML oldal védelem: be kell lépni
    if (!request.session) {
        // session hiány: konfigurációs hiba
        return response.status(500).send('Session middleware hiba.'); // 500, itt nem JSON
    }
    if (!request.session.userId) {
        // nincs belépve
        return response.redirect('/'); // bejelentkezés oldal
    }
    next(); // a felhasználó be van jelentkezve, mehet tovább
}

async function adminKotelezoOldalhoz(request, response, next) {
    // HTML oldal védelem: admin kell
    if (!request.session) {
        // session hiány: konfigurációs hiba
        return response.status(500).send('Session middleware hiba.'); // 500, itt nem JSON
    }
    if (!request.session.userId) {
        // nincs belépve
        return response.redirect('/'); // bejelentkezés oldal
    }
    // Admin ellenőrzés a sessionben tárolt userId alapján
    const admin = await adatbazis.adminE(request.session.userId); // true vagy false az adatbázisból
    if (!admin) {
        return response.redirect('/fooldal'); // belépve, de nem admin
    }
    next(); // a felhasználó admin, szóval mehet tovább
}

//!Routing
//?Bejelentkezés:
router.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Bejelentkezés/index.html'));
});

//?Regisztráció:
router.get('/regisztracio', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Regisztráció/index.html'));
});

//?Főoldal:
router.get('/fooldal', bejelentkezesKotelezoOldalhoz, (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Főoldal/index.html'));
});

//?Admin felület:
router.get('/admin', adminKotelezoOldalhoz, (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Admin/index.html'));
});

//?Kínálat:
router.get('/kinalat', bejelentkezesKotelezoOldalhoz, (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Kínálat/index.html'));
});

//?Kosár:
router.get('/kosar', bejelentkezesKotelezoOldalhoz, (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Kosár/index.html'));
});

//?Rólunk:
router.get('/rolunk', bejelentkezesKotelezoOldalhoz, (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Rólunk/index.html'));
});

//?Kapcsolat:
router.get('/kapcsolat', bejelentkezesKotelezoOldalhoz, (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Kapcsolat/index.html'));
});

//?Általános szerződési feltételek:
router.get('/altalanos-szerzodesi-feltetelek', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Általános Szerződési Feltételek/index.html'));
});

//?Adatvédelmi tájékoztató:
router.get('/adatvedelmi-tajekoztato', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Adatvédelmi tájékoztató/index.html'));
});

//?KFC:
router.get('/kfc', bejelentkezesKotelezoOldalhoz, (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Éttermek&Termékek/KFC/index.html'));
});

//?McDonald's:
router.get('/mcdonalds', bejelentkezesKotelezoOldalhoz, (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Éttermek&Termékek/McDonalds/index.html'));
});

//?Buddha Original:
router.get('/buddhaoriginal', bejelentkezesKotelezoOldalhoz, (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Éttermek&Termékek/BuddhaOriginal/index.html'));
});

//?Profil:
router.get('/profil', bejelentkezesKotelezoOldalhoz, (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Profil/index.html'));
});

//!API endpoints
//? Direkt html elérések védelme
app.use(async (request, response, next) => {
    const kertUtvonal = request.path; // a böngésző által kért URL útvonal, pl. "/Főoldal/index.html"
    if (!kertUtvonal.toLowerCase().endsWith('.html')) {
        return next(); // nem html (css/js/kép), nem védjük itt
    }
    if (kertUtvonal === '/Bejelentkezés/index.html' || kertUtvonal === '/Regisztráció/index.html' || kertUtvonal === '/Általános Szerződési Feltételek/index.html' || kertUtvonal === '/Adatvédelmi tájékoztató/index.html') {
        return next(); // nyilvános html-ek
    }
    if (kertUtvonal.startsWith('/Admin/')) {
        return adminKotelezoOldalhoz(request, response, next); // admin html-ek
    }
    return bejelentkezesKotelezoOldalhoz(request, response, next); // minden más html csak belépve
});
app.use('/', router);
const endpoints = require('./api/api.js');
app.use('/api', endpoints);

//!Szerver futtatása
app.use(express.static(path.join(__dirname, '../frontend'))); //?frontend mappa tartalmának betöltése az oldal működéséhez
app.listen(port, ip, () => {
    console.log(`Szerver elérhetősége: http://${ip}:${port}`);
});

//?Szerver futtatása terminalból: npm run dev
//?Szerver leállítása (MacBook és Windows): Control + C
//?Terminal ablak tartalmának törlése (MacBook): Command + K
