const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'foodgo',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//!SQL Queries
//*Regisztráció
async function ujFelhasznalo(nev, email, telefonszam, jelszo) {
    const sql = 'INSERT INTO felhasznalo(nev, email, telefonszam, jelszo) VALUES (?,?,?,?)';
    const [result] = await pool.execute(sql, [nev, email, telefonszam, jelszo]);
    //! MINDIG paraméterezett lekérdezést (?) használunk, az SQL injetion ellen
    return result.insertId; //Új rekord azonosítója lesz
}

//*Bejelentkezés
async function felhasznaloEmailAlapjan(email) {
    // bejelentkezéshez user keresés email alapján
    const sql = 'SELECT id, email, jelszo, admine FROM felhasznalo WHERE email = ? LIMIT 1'; // csak szükséges mezők
    const [rows] = await pool.execute(sql, [email]); // paraméterezett query
    return rows[0] ?? null; // első találat vagy null
}

//*Admin-e a felhasználó
async function adminE(id) {
    // admin flag lekérdezése id alapján
    const sql = 'SELECT admine FROM felhasznalo WHERE id = ? LIMIT 1'; // csak admine kell
    const [rows] = await pool.execute(sql, [id]); // paraméterezett query
    return Boolean(rows[0] && rows[0].admine); // true ha be van lépve és admin, különben false -> rows[0] && egy biztonsági ellenőrzés, hogy van-e találat, mert ha nincs, akkor rows[0] undefined lenne és hibát okozna a rows[0].admine hozzáférés.
}

//* Admin felület - Felhasználók listája
async function felhasznalokListaja() {
    // admin felülethez user lista (jelszó nélkül)
    const sql = 'SELECT id, nev, email, telefonszam, admine FROM felhasznalo ORDER BY id'; // jelszó nincs
    const [rows] = await pool.execute(sql); // összes user
    return rows; // lista
}

//* Admin felület - Felhasználó módosítása
async function felhasznaloModositasa(id, nev, email, telefonszam) {
    // admin: user adat módosítás
    const sql = 'UPDATE felhasznalo SET nev = ?, email = ?, telefonszam = ? WHERE id = ?'; // update id alapján
    const [result] = await pool.execute(sql, [nev, email, telefonszam, id]); // paraméterezett update
    return result.affectedRows; // 0 ha nincs ilyen, 1 ha siker
}

//* Admin felület - Admin jog beállítása
async function adminJogBeallitasa(id, admine) {
    // admin: admin jog állítás
    const sql = 'UPDATE felhasznalo SET admine = ? WHERE id = ?'; // admine update
    const [result] = await pool.execute(sql, [Boolean(admine), id]); // Boolean kényszerítés
    return result.affectedRows; // 0 vagy 1
}

//* Admin felület - Felhasználó törlése
async function felhasznaloTorlese(id) {
    // admin: user törlés
    const sql = 'DELETE FROM felhasznalo WHERE id = ?'; // delete id alapján
    const [result] = await pool.execute(sql, [id]); // paraméterezett delete
    return result.affectedRows; // 0 vagy 1
}

//* Profil - Felhasználó adatok lekérése
async function sajatAdatok(id) {
    // profil: saját adatok lekérése id alapján
    const sql = 'SELECT id, nev, email, telefonszam FROM felhasznalo WHERE id = ? LIMIT 1'; // jelszó nélkül
    const [rows] = await pool.execute(sql, [id]); // paraméterezett query
    return rows[0] ?? null; // első találat vagy null
}

//* Profil - Jelszó ellenőrzés (cseréhez)
async function JelszoEllenorzes(id) {
    const sql = 'SELECT jelszo FROM felhasznalo WHERE id = ? LIMIT 1'; // csak jelszó kell
    const [rows] = await pool.execute(sql, [id]); // paraméterezett query
    return rows[0]?.jelszo ?? null; // jelszó vagy null
}

//* Profil - Új jelszó beállítása
async function jelszoModositas(id, ujJelszo) {
    const sql = 'UPDATE felhasznalo SET jelszo = ? WHERE id = ?';
    const [result] = await pool.execute(sql, [ujJelszo, id]);
    return result.affectedRows; // 0 vagy 1
}

//* Termékek lekérése étterem szerint
async function termekekLekerdezese(etteremAzonosito) {
    const sql = 'SELECT * FROM termekek WHERE etterem_azonosito = ?';
    const [rows] = await pool.execute(sql, [etteremAzonosito]);
    return rows;
}

//* Összes étterem lekérése
async function ettermekLekerdezese() {
    const sql = 'SELECT * FROM ettermek ORDER BY id';
    const [rows] = await pool.execute(sql);
    return rows;
}

//* Egy étterem lekérése azonosító alapján
async function etteremAzonositoAlapjan(azonosito) {
    const sql = 'SELECT * FROM ettermek WHERE azonosito = ? LIMIT 1';
    const [rows] = await pool.execute(sql, [azonosito]);
    return rows[0] ?? null;
}

//* Új rendelés leadása (Beleírunk a 'rendelesek' táblába)
async function ujRendeles(felhasznaloId, teljesOsszeg, szallitasiCim, megjegyzes) {
    const sql = 'INSERT INTO rendelesek(felhasznalo_id, teljes_osszeg, szallitasi_cim, megjegyzes) VALUES (?,?,?,?)';
    const [result] = await pool.execute(sql, [felhasznaloId, teljesOsszeg, szallitasiCim, megjegyzes]);
    return result.insertId;
}

//* Rendelés tételeinek elmentése (Beleírunk a 'rendeles_tetelek' táblába)
async function ujRendelesTetel(rendelesId, termekId, mennyiseg, egysegAr) {
    const sql = 'INSERT INTO rendeles_tetelek(rendeles_id, termek_id, mennyiseg, egyseg_ar) VALUES (?,?,?,?)';
    await pool.execute(sql, [rendelesId, termekId, mennyiseg, egysegAr]);
}

//* Egy felhasználó saját rendeléseinek lekérdezése
async function sajatRendelesekLekerdezese(felhasznaloId) {
    // Itt csak a fő rendelési infókat kérjük le
    const sql = 'SELECT id, datum, teljes_osszeg, statusz, szallitasi_cim FROM rendelesek WHERE felhasznalo_id = ? ORDER BY datum DESC';
    const [rows] = await pool.execute(sql, [felhasznaloId]);
    return rows;
}

// ============== ADMIN RENDELÉS KEZELÉS =================

//* Az összes rendelés lekérése az adatbázisból (Adminnak)
async function osszesRendelesAdminnak() {
    const sql = `
        SELECT
            rendelesek.id,
            rendelesek.datum,
            rendelesek.teljes_osszeg,
            rendelesek.statusz,
            rendelesek.szallitasi_cim,
            felhasznalo.nev,
            felhasznalo.email,
            felhasznalo.telefonszam
        FROM rendelesek
        INNER JOIN felhasznalo ON rendelesek.felhasznalo_id = felhasznalo.id
        ORDER BY rendelesek.datum DESC
    `;
    const [rows] = await pool.execute(sql);
    return rows;
}

//* Egy rendelés státuszának frissítése
async function rendelesStatuszModositas(rendelesId, ujStatusz) {
    const sql = 'UPDATE rendelesek SET statusz = ? WHERE id = ?';
    const [result] = await pool.execute(sql, [ujStatusz, rendelesId]);
    return result.affectedRows; // Visszaadja, hogy sikeres volt-e (1) vagy sem (0)
}

async function selectall() {
    const query = 'SELECT * FROM felhasznalo;';
    const [rows] = await pool.execute(query);
    return rows;
}

// Rendelés tételeinek lekérdezése
async function rendelesTetelekLekerdezese(rendelesId) {
    const sql = `
        SELECT rt.mennyiseg AS darab, rt.egyseg_ar, t.nev AS termek_nev
        FROM rendeles_tetelek rt
        JOIN termekek t ON rt.termek_id = t.id
        WHERE rt.rendeles_id = ?
    `;
    const [rows] = await pool.execute(sql, [rendelesId]);
    return rows;
}

async function rendelesTulajdonosLekerdezese(rendelesId) {
    const sql = 'SELECT felhasznalo_id FROM rendelesek WHERE id = ? LIMIT 1';
    const [rows] = await pool.execute(sql, [rendelesId]);
    return rows[0] ?? null;
}

async function rendelesTetelekTorlese(rendelesId) {
    const sql = 'DELETE FROM rendeles_tetelek WHERE rendeles_id = ?';
    const [result] = await pool.execute(sql, [rendelesId]);
    return result.affectedRows;
}

async function rendelesTorlese(rendelesId) {
    const sql = 'DELETE FROM rendelesek WHERE id = ?';
    const [result] = await pool.execute(sql, [rendelesId]);
    return result.affectedRows;
}

//!Export
module.exports = {
    selectall,
    ujFelhasznalo,
    felhasznaloEmailAlapjan,
    adminE,
    felhasznalokListaja,
    felhasznaloModositasa,
    adminJogBeallitasa,
    felhasznaloTorlese,
    sajatAdatok,
    JelszoEllenorzes,
    jelszoModositas,
    termekekLekerdezese,
    ettermekLekerdezese,
    etteremAzonositoAlapjan,
    ujRendeles,
    ujRendelesTetel,
    sajatRendelesekLekerdezese,
    osszesRendelesAdminnak,
    rendelesStatuszModositas,
    rendelesTetelekLekerdezese,
    rendelesTulajdonosLekerdezese,
    rendelesTetelekTorlese,
    rendelesTorlese
};
