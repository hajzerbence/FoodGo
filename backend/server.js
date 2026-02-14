//!Module-ok importálása
const express = require('express'); //?npm install express
const session = require('express-session'); //?npm install express-session
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
router.get('/fooldal', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Főoldal/index.html'));
});

//?Kínálat:
router.get('/kinalat', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Kínálat/index.html'));
});

//?Kosár:
router.get('/kosar', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Kosár/index.html'));
});

//?Rólunk:
router.get('/rolunk', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Rólunk/index.html'));
});

//?Kapcsolat:
router.get('/kapcsolat', (request, response) => {
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
router.get('/kfc', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Éttermek&Termékek/KFC/index.html'));
});

//?McDonald's:
router.get('/mcdonalds', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/Éttermek&Termékek/McDonalds/index.html'));
});

//!API endpoints
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
