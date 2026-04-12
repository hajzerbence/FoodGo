const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');

//!Bcrypt a jelszavak titkosításához
const bcrypt = require('bcrypt'); //? npm install bcrypt a backend mappában!

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

        // Jelszó titkosítása bcrypt segítségével (10-es salt round a junior/normál biztonsági szinthez tökéletes)
        const titkositottJelszo = await bcrypt.hash(ujFelhasznalo.jelszo, 10);

        // A titkosított jelszót adjuk át az adatbázisnak a sima helyett
        const adat = await database.ujFelhasznalo(ujFelhasznalo.nev, ujFelhasznalo.email, ujFelhasznalo.telefonszam, titkositottJelszo);
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

        // 1. Megnézzük, létezik-e a felhasználó az adatbázisban
        if (!felhasznalo) {
            return response.status(401).json({
                success: false,
                message: 'Hibás email vagy jelszó.'
            });
        }

        // 2. Ha létezik, összehasonlítjuk a beírt nyers jelszót a lementett titkosított jelszóval
        const jelszoHelyes = await bcrypt.compare(jelszo, felhasznalo.jelszo);

        if (!jelszoHelyes) {
            // rossz jelszó
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
        const rendelesek = await database.osszesRendelesAdminnak(); // Az új függvényünk: lehívja az összes rendelést
        const ettermek = await database.ettermekLekerdezese();
        const termekek = await database.osszesTermekLekerdezese();

        return response.status(200).json({
            success: true,
            felhasznalok: felhasznalok,
            rendelesek: rendelesek, // Ezt is visszaküldjük a frontendnek
            ettermek: ettermek,
            termekek: termekek
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

        // ---- ÚJ: Rendelés státusz módosítása Adminban ---- //
        if (muvelet === 'rendelesStatuszValtas') {
            const { id, ujStatusz } = request.body;

            const erintett = await database.rendelesStatuszModositas(Number(id), ujStatusz);

            if (!erintett) {
                return response.status(404).json({
                    success: false,
                    message: 'Nincs ilyen rendelés.'
                });
            }

            return response.status(200).json({
                success: true,
                message: 'Rendelés státusza sikeresen módosítva.'
            });
        }

        if (muvelet === 'etteremHozzaadas') {
            const { azonosito, nev, leiras, kategoria, logoUtvonal, boritokepUtvonal } = request.body;

            if (!azonosito || !nev || !kategoria || !logoUtvonal || !boritokepUtvonal) {
                return response.status(400).json({
                    success: false,
                    message: 'Minden kötelező mezőt ki kell tölteni.'
                });
            }

            await database.ujEtterem(azonosito, nev, leiras, kategoria, logoUtvonal, boritokepUtvonal);

            return response.status(200).json({
                success: true,
                message: 'Étterem sikeresen hozzáadva.'
            });
        }

        if (muvelet === 'etteremTorles') {
            const { id, azonosito } = request.body;

            await database.etteremhezTartozoTermekekTorlese(azonosito);
            const erintett = await database.etteremTorlese(Number(id));

            if (!erintett) {
                return response.status(404).json({
                    success: false,
                    message: 'Nincs ilyen étterem.'
                });
            }

            return response.status(200).json({
                success: true,
                message: 'Étterem törölve.'
            });
        }

        if (muvelet === 'etteremModositas') {
            const { id, azonosito, nev, leiras, kategoria, logoUtvonal, boritokepUtvonal } = request.body;

            if (!id || !azonosito || !nev || !kategoria || !logoUtvonal || !boritokepUtvonal) {
                return response.status(400).json({
                    success: false,
                    message: 'Minden kötelező mezőt ki kell tölteni.'
                });
            }

            const erintett = await database.etteremModositasa(Number(id), azonosito, nev, leiras, kategoria, logoUtvonal, boritokepUtvonal);

            if (!erintett) {
                return response.status(404).json({
                    success: false,
                    message: 'Nincs ilyen étterem.'
                });
            }

            return response.status(200).json({
                success: true,
                message: 'Étterem sikeresen módosítva.'
            });
        }

        if (muvelet === 'termekHozzaadas') {
            const { nev, leiras, ar, kepUtvonal, etteremAzonosito, kategoria } = request.body;

            if (!nev || !ar || !kepUtvonal || !etteremAzonosito || !kategoria) {
                return response.status(400).json({
                    success: false,
                    message: 'Minden kötelező mezőt ki kell tölteni.'
                });
            }

            await database.ujTermek(nev, leiras, Number(ar), kepUtvonal, etteremAzonosito, kategoria);

            return response.status(200).json({
                success: true,
                message: 'Termék sikeresen hozzáadva.'
            });
        }

        if (muvelet === 'termekModositas') {
            const { id, nev, leiras, ar, kepUtvonal, etteremAzonosito, kategoria } = request.body;

            if (!id || !nev || !ar || !kepUtvonal || !etteremAzonosito || !kategoria) {
                return response.status(400).json({
                    success: false,
                    message: 'Minden kötelező mezőt ki kell tölteni.'
                });
            }

            const erintett = await database.termekModositasa(Number(id), nev, leiras, Number(ar), kepUtvonal, etteremAzonosito, kategoria);

            if (!erintett) {
                return response.status(404).json({
                    success: false,
                    message: 'Nincs ilyen termék.'
                });
            }

            return response.status(200).json({
                success: true,
                message: 'Termék sikeresen módosítva.'
            });
        }

        if (muvelet === 'termekTorles') {
            const { id } = request.body;

            const erintett = await database.termekTorlese(Number(id));

            if (!erintett) {
                return response.status(404).json({
                    success: false,
                    message: 'Nincs ilyen termék.'
                });
            }

            return response.status(200).json({
                success: true,
                message: 'Termék törölve.'
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

            // Lekérjük a régi (titkosított) jelszót az adatbázisból
            const regiJelszoHash = await database.JelszoEllenorzes(userId);

            // Összehasonlítjuk a most beírt régi jelszót a hash formájúval
            // Fontos: a database.JelszoEllenorzes-ből kivettem a regiJelszo átadását, mert az oda nem kell
            const helyes = await bcrypt.compare(regiJelszo, regiJelszoHash);

            if (!helyes) {
                return response.status(401).json({ success: false, message: 'A jelenlegi jelszó hibás.' });
            }

            // Ha jó volt a régi jelszó, titkosítjuk az újat
            const titkositottUjJelszo = await bcrypt.hash(ujJelszo, 10);

            // A biztonságos jelszót lementjük
            await database.jelszoModositas(userId, titkositottUjJelszo);
            return response.status(200).json({ success: true, message: 'Jelszó sikeresen módosítva.' });
        }

        return response.status(400).json({ message: 'Ismeretlen művelet.' });
    } catch (error) {
        console.log(`POST hiba /profil ${error.message}`);
        response.status(500).json({ success: false, message: 'Hiba a mentés során.' });
    }
});

//? GET /api/termekek/:etterem - Termékek lekérése étterem szerint
router.get('/termekek/:etterem', bejelentkezesKotelezo, async (request, response) => {
    try {
        const etterem = request.params.etterem;
        const termekek = await database.termekekLekerdezese(etterem);

        response.status(200).json({
            success: true,
            termekek: termekek
        });
    } catch (error) {
        console.log(`GET hiba /termekek ${error.message}`);
        response.status(500).json({ message: 'Termékek betöltése sikertelen.' });
    }
});

//? GET /api/ettermek - Összes étterem lekérése
router.get('/ettermek', bejelentkezesKotelezo, async (request, response) => {
    try {
        const ettermek = await database.ettermekLekerdezese();
        response.status(200).json({
            success: true,
            ettermek: ettermek
        });
    } catch (error) {
        console.log(`GET hiba /ettermek ${error.message}`);
        response.status(500).json({ message: 'Éttermek betöltése sikertelen.' });
    }
});

//? GET /api/ettermek/:azonosito - Egy étterem lekérése
router.get('/ettermek/:azonosito', bejelentkezesKotelezo, async (request, response) => {
    try {
        const azonosito = request.params.azonosito;
        const etterem = await database.etteremAzonositoAlapjan(azonosito);

        if (!etterem) {
            return response.status(404).json({ success: false, message: 'Étterem nem található.' });
        }

        response.status(200).json({
            success: true,
            etterem: etterem
        });
    } catch (error) {
        console.log(`GET hiba /ettermek/:azonosito ${error.message}`);
        response.status(500).json({ message: 'Étterem betöltése sikertelen.' });
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

//? POST /rendeles_leadasa - A kosár tartalmának és a rendelésnek a mentése
router.post('/rendeles_leadasa', bejelentkezesKotelezo, async (request, response) => {
    try {
        const felhasznaloId = request.session.userId;
        const { teljesOsszeg, szallitasiCim, megjegyzes, kosarTetelek } = request.body;

        // Ellenőrizzük, hogy van-e egyáltalán kosár
        if (!kosarTetelek || kosarTetelek.length === 0) {
            return response.status(400).json({ success: false, message: 'Üres a kosár, nincs mit leadni!' });
        }

        // 1. Lementjük a FŐ rendelést az adatbázisba
        // Ennek a visszatérési értéke az új szám (pl. 5-ös rendelés), amit fel fogunk használni.
        const ujRendelesId = await database.ujRendeles(felhasznaloId, teljesOsszeg, szallitasiCim, megjegyzes);

        // 2. Mentjük a termékeket (tételeket) egyenként a kosárból
        // Itt bejárjuk a frontendes kosárból kapott termékeket
        for (let i = 0; i < kosarTetelek.length; i++) {
            const tetel = kosarTetelek[i];

            // Lementjük mindet egyesével, felhasználva az új rendelés számát!
            await database.ujRendelesTetel(ujRendelesId, tetel.termekId, tetel.mennyiseg, tetel.egysegAr);
        }

        return response.status(201).json({ success: true, message: 'Rendelés sikeresen leadva!' });
    } catch (error) {
        console.log(`POST hiba /rendeles_leadasa ${error.message}`);
        return response.status(500).json({ success: false, message: 'Valami hiba történt a rendelés elküldésekor.' });
    }
});

//? GET /sajat_rendelesek - A profilhoz lekéri, hogy miket rendeltél
router.get('/sajat_rendelesek', bejelentkezesKotelezo, async (request, response) => {
    try {
        const felhasznaloId = request.session.userId;
        const rendelesek = await database.sajatRendelesekLekerdezese(felhasznaloId);

        return response.status(200).json({ success: true, rendelesek: rendelesek });
    } catch (error) {
        console.log(`GET hiba /sajat_rendelesek ${error.message}`);
        return response.status(500).json({ success: false, message: 'Nem sikerült betölteni a rendeléseket.' });
    }
});

// --- Rendelés Részletek (Admin + Profil) --- //
router.get('/rendeles_tetelek/:id', bejelentkezesKotelezo, async (request, response) => {
    try {
        const rendelesId = request.params.id;
        const tetelek = await database.rendelesTetelekLekerdezese(rendelesId);

        return response.status(200).json({
            success: true,
            tetelek: tetelek
        });
    } catch (error) {
        console.log(`GET hiba /rendeles_tetelek/:id ${error.message}`);
        return response.status(500).json({
            success: false,
            message: 'Nem sikerült betölteni a rendelés tételeit.'
        });
    }
});

module.exports = router;
