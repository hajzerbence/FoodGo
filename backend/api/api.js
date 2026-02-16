const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname); //?egyedi név: dátum - file eredeti neve
    }
});

const upload = multer({ storage });

//!Middleware-k (API védelemhez):
function bejelentkezesKotelezo(request, response, next) {
    // API védelem: bejelentkezve kell lenni
    if (!request.session) {
        // ha nincs session objektum, az konfigurációs hiba
        return response.status(500).json({ message: 'Session middleware hiba.' }); // 500 hiba
    }
    if (!request.session.userId) {
        // nincs belépve
        return response.status(401).json({ message: 'Nincs bejelentkezve.' }); // 401
    }
    next(); // a felhasználó be van jelentkezve, mehet tovább
}

async function adminKotelezo(request, response, next) {
    // API védelem: adminnak kell lenni
    if (!request.session) {
        // session hiány, hiba
        return response.status(500).json({ message: 'Session middleware hiba.' }); // 500 hiba
    }
    if (!request.session.userId) {
        // nincs belépve
        return response.status(401).json({ message: 'Nincs bejelentkezve.' }); // 401
    }
    const admin = await database.adminE(request.session.userId); // admin flag adatbázisból
    if (!admin) {
        // be van jelentkezve, de nem admin
        return response.status(403).json({ message: 'Nincs jogosultság.' }); // 403
    }

    next(); // a felhasználó admin, szóval mehet tovább
}

//!Endpoints:
//? POST /ujFelhasznalo
router.post('/ujFelhasznalo', async (request, response) => {
    try {
        const ujFelhasznalo = request.body;
        const adat = await database.ujFelhasznalo(ujFelhasznalo.nev, ujFelhasznalo.email, ujFelhasznalo.telefonszam, ujFelhasznalo.jelszo);
        response.status(201).json({
            message: 'Felhasználó sikeresen regisztrálva.',
            result: adat
        });
    } catch (error) {
        console.log(`POST hiba /ujFelhasznalo ${error.message}`);
        response.status(500).json({
            message: 'Új felhasználó regisztrálása sikertelen.'
        });
    }
});

//? POST Bejelentkezés
router.post('/bejelentkezes', async (request, response) => {
    try {
        const { email, jelszo } = request.body; // bodyból email és jelszó
        if (!email || !jelszo) {
            return response.status(400).json({
                success: false,
                message: 'Hiányzó adatok.'
            });
        } // 400
        const felhasznalo = await database.felhasznaloEmailAlapjan(email); // user
        if (!felhasznalo || felhasznalo.jelszo !== jelszo) {
            // rossz adat
            return response.status(401).json({
                success: false,
                message: 'Hibás email vagy jelszó.'
            }); // 401 hiba
        }
        request.session.userId = felhasznalo.id; // session csak id
        return response.status(200).json({
            success: true,
            userId: felhasznalo.id,
            message: 'Sikeres bejelentkezés.'
        }); // siker
    } catch (error) {
        console.log(`POST hiba /bejelentkezes ${error.message}`); // log
        return response.status(500).json({
            success: false,
            message: 'Bejelentkezés sikertelen.'
        }); // 500 hiba
    }
});

//? GET Aktuálisan bejelentkezett felhasználó
router.get('/bejelentkezettFelhasznalo', bejelentkezesKotelezo, async (request, response) => {
    // ki van belépve
    const admin = await database.adminE(request.session.userId); // admine (true/false)
    response.status(200).json({
        userId: request.session.userId,
        admine: admin
    });
});

//? GET /api/admin (Admin adatok, egyelőre felhasználók)
router.get('/admin', adminKotelezo, async (request, response) => {
    try {
        const felhasznalok = await database.felhasznalokListaja(); // jelszó nélkül listáz
        return response.status(200).json({
            success: true,
            felhasznalok
        });
    } catch (error) {
        console.log(`GET hiba /admin ${error.message}`);
        return response.status(500).json({
            success: false,
            message: 'Admin adatok betöltése sikertelen.'
        });
    }
});

//? POST /api/admin (Admin művelet: törlés, admin jog, módosítás)
router.post('/admin', adminKotelezo, async (request, response) => {
    try {
        const { muvelet } = request.body; // művelet neve
        if (muvelet === 'felhasznaloTorles') {
            const { id } = request.body; // törlendő user id
            const erintett = await database.felhasznaloTorlese(Number(id)); // DB törlés

            if (!erintett) {
                return response.status(404).json({
                    success: false,
                    message: 'Nincs ilyen felhasználó.'
                });
            }
            return response.status(200).json({
                success: true,
                message: 'Felhasználó törölve.'
            });
        }

        if (muvelet === 'felhasznaloAdminAllitas') {
            const { id, admine } = request.body; // user id + új admin érték
            const erintett = await database.adminJogBeallitasa(Number(id), Boolean(admine)); // DB update

            if (!erintett) {
                return response.status(404).json({
                    success: false,
                    message: 'Nincs ilyen felhasználó.'
                });
            }
            return response.status(200).json({
                success: true,
                message: 'Admin jog átállítva.'
            });
        }

        if (muvelet === 'felhasznaloModositas') {
            const { id, nev, email, telefonszam } = request.body; // módosítandó mezők
            const erintett = await database.felhasznaloModositasa(Number(id), nev, email, telefonszam); // DB update

            if (!erintett) {
                return response.status(404).json({
                    success: false,
                    message: 'Nincs ilyen felhasználó.'
                });
            }
            return response.status(200).json({
                success: true,
                message: 'Felhasználó módosítva.'
            });
        }
        return response.status(400).json({
            success: false,
            message: 'Ismeretlen művelet.'
        });
    } catch (error) {
        console.log(`POST hiba /admin ${error.message}`);
        return response.status(500).json({
            success: false,
            message: 'Admin művelet sikertelen.'
        });
    }
});

//? POST Kijelentkezés
router.post('/kijelentkezes', bejelentkezesKotelezo, (request, response) => {
    request.session.destroy((error) => {
        if (error) {
            return response.status(500).json({
                success: false,
                message: 'Kijelentkezés sikertelen.' + error.message
            });
        }
        return response.status(200).json({
            success: true,
            message: 'Sikeresen kijelentkeztél!'
        });
    });
});

//? GET /profil - Belépett felhasználó adatinak lekérése
router.get('/profil', bejelentkezesKotelezo, async (request, response) => {
    try {
        const adatok = await database.sajatAdatok(request.session.userId); // saját adatok jelszó nélkül
        response.status(200).json(adatok);
    } catch (error) {
        console.log(`GET hiba /profil ${error.message}`);
        response.status(500).json({
            message: 'Saját adatok lekérése sikertelen.'
        });
    }
});

//? POST /profil - Adatok vagy jelszó módosítása
router.post('/profil', bejelentkezesKotelezo, async (request, response) => {
    try {
        const { muvelet } = request.body;
        const userId = request.session.userId;

        // 1. Adatok módosítása
        if (muvelet === 'adatModositas') {
            const { nev, email, telefonszam } = request.body;
            await database.felhasznaloModositasa(userId, nev, email, telefonszam);
            return response.status(200).json({ success: true, message: 'Adatok sikeresen mentve.' });
        }

        // 2. Jelszó modosítása
        if (muvelet === 'jelszoModositas') {
            const { regiJelszo, ujJelszo } = request.body;

            const helyes = await database.JelszoEllenorzes(userId, regiJelszo);
            if (!helyes) {
                return response.status(401).json({ success: false, message: 'A jelenlegi jelszó hibás.' });
            }

            await database.jelszoModositas(userId, ujJelszo);
            return response.status(200).json({ success: true, message: 'Jelszó sikeresen módosítva.' });
        }

        return response.status(400).json({ message: 'Ismeretlen művelet.' });
    } catch (error) {
        console.log(`POST hiba /profil ${error.message}`);
        response.status(500).json({ success: false, message: 'Hiba a mentés során.' });
    }
});

//?GET /api/test
router.get('/test', (request, response) => {
    response.status(200).json({
        message: 'Ez a végpont működik.'
    });
});

//?GET /api/testsql
router.get('/testsql', async (request, response) => {
    try {
        const selectall = await database.selectall();
        response.status(200).json({
            message: 'Ez a végpont működik.',
            results: selectall
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});

module.exports = router;
