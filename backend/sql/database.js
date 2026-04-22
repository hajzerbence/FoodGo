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

//* Elfelejtett jelszó - token mentése email alapján
async function jelszoVisszaallitoTokenMentese(email, jelszoVisszaallitoToken, jelszoVisszaallitoTokenLejarat) {
    const sql = 'UPDATE felhasznalo SET jelszoVisszaallitoToken = ?, jelszoVisszaallitoTokenLejarat = ? WHERE email = ?';
    const [result] = await pool.execute(sql, [jelszoVisszaallitoToken, jelszoVisszaallitoTokenLejarat, email]);
    return result.affectedRows;
}

//* Elfelejtett jelszó - felhasználó keresése token alapján
async function felhasznaloJelszoVisszaallitoTokenAlapjan(jelszoVisszaallitoToken) {
    const sql = 'SELECT id, email, jelszoVisszaallitoToken, jelszoVisszaallitoTokenLejarat FROM felhasznalo WHERE jelszoVisszaallitoToken = ? AND jelszoVisszaallitoTokenLejarat > NOW() LIMIT 1';
    const [rows] = await pool.execute(sql, [jelszoVisszaallitoToken]);
    return rows[0] ?? null;
}

//* Elfelejtett jelszó - token törlése
async function jelszoVisszaallitoTokenTorlese(id) {
    const sql = 'UPDATE felhasznalo SET jelszoVisszaallitoToken = NULL, jelszoVisszaallitoTokenLejarat = NULL WHERE id = ?';
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows;
}

//* Termékek lekérése étterem szerint
async function termekekLekerdezese(etteremAzonosito) {
    const sql = 'SELECT * FROM termekek WHERE etterem_azonosito = ?';
    const [rows] = await pool.execute(sql, [etteremAzonosito]);
    return rows;
}

async function osszesTermekLekerdezese() {
    const sql = 'SELECT * FROM termekek ORDER BY id';
    const [rows] = await pool.execute(sql);
    return rows;
}

async function ujTermek(nev, leiras, ar, kepUtvonal, etteremAzonosito, kategoria) {
    const sql = 'INSERT INTO termekek (nev, leiras, ar, kep_utvonal, etterem_azonosito, kategoria) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await pool.execute(sql, [nev, leiras, ar, kepUtvonal, etteremAzonosito, kategoria]);
    return result.insertId;
}

async function termekModositasa(id, nev, leiras, ar, kepUtvonal, etteremAzonosito, kategoria) {
    const sql = `
        UPDATE termekek
        SET nev = ?, leiras = ?, ar = ?, kep_utvonal = ?, etterem_azonosito = ?, kategoria = ?
        WHERE id = ?
    `;
    const [result] = await pool.execute(sql, [nev, leiras, ar, kepUtvonal, etteremAzonosito, kategoria, id]);
    return result.affectedRows;
}

async function termekTorlese(id) {
    const sql = 'DELETE FROM termekek WHERE id = ?';
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows;
}

//* Összes étterem lekérése
async function ettermekLekerdezese() {
    const sql = `
        SELECT
            ettermek.id,
            ettermek.azonosito,
            ettermek.nev,
            ettermek.leiras,
            ettermek.kategoria_id,
            kategoriak.nev AS kategoria,
            ettermek.logo_utvonal,
            ettermek.boritokep_utvonal
        FROM ettermek
        INNER JOIN kategoriak ON ettermek.kategoria_id = kategoriak.id
        ORDER BY ettermek.id
    `;
    const [rows] = await pool.execute(sql);
    return rows;
}

async function ujEtterem(azonosito, nev, leiras, kategoriaId, logoUtvonal, boritokepUtvonal) {
    const sql = 'INSERT INTO ettermek (azonosito, nev, leiras, kategoria_id, logo_utvonal, boritokep_utvonal) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await pool.execute(sql, [azonosito, nev, leiras, kategoriaId, logoUtvonal, boritokepUtvonal]);
    return result.insertId;
}

async function etteremhezTartozoTermekekTorlese(etteremAzonosito) {
    const sql = 'DELETE FROM termekek WHERE etterem_azonosito = ?';
    const [result] = await pool.execute(sql, [etteremAzonosito]);
    return result.affectedRows;
}

async function etteremTorlese(id) {
    const sql = 'DELETE FROM ettermek WHERE id = ?';
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows;
}

async function etteremModositasa(id, azonosito, nev, leiras, kategoriaId, logoUtvonal, boritokepUtvonal) {
    const sql = `
        UPDATE ettermek
        SET azonosito = ?, nev = ?, leiras = ?, kategoria_id = ?, logo_utvonal = ?, boritokep_utvonal = ?
        WHERE id = ?
    `;
    const [result] = await pool.execute(sql, [azonosito, nev, leiras, kategoriaId, logoUtvonal, boritokepUtvonal, id]);
    return result.affectedRows;
}

async function etteremAzonositoAlapjan(azonosito) {
    const sql = `
        SELECT
            ettermek.id,
            ettermek.azonosito,
            ettermek.nev,
            ettermek.leiras,
            ettermek.kategoria_id,
            kategoriak.nev AS kategoria,
            ettermek.logo_utvonal,
            ettermek.boritokep_utvonal
        FROM ettermek
        INNER JOIN kategoriak ON ettermek.kategoria_id = kategoriak.id
        WHERE ettermek.azonosito = ?
        LIMIT 1
    `;
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

async function kategoriakLekerdezese() {
    const sql = 'SELECT * FROM kategoriak ORDER BY nev';
    const [rows] = await pool.execute(sql);
    return rows;
}

async function ujKategoria(nev) {
    const sql = 'INSERT INTO kategoriak (nev) VALUES (?)';
    const [result] = await pool.execute(sql, [nev]);
    return result.insertId;
}

async function kategoriaModositasa(id, nev) {
    const sql = 'UPDATE kategoriak SET nev = ? WHERE id = ?';
    const [result] = await pool.execute(sql, [nev, id]);
    return result.affectedRows;
}

async function ettermekSzamaKategoriaban(kategoriaId) {
    const sql = 'SELECT COUNT(*) AS darab FROM ettermek WHERE kategoria_id = ?';
    const [rows] = await pool.execute(sql, [kategoriaId]);
    return rows[0].darab;
}

async function kategoriaTorlese(id) {
    const sql = 'DELETE FROM kategoriak WHERE id = ?';
    const [result] = await pool.execute(sql, [id]);
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
    jelszoVisszaallitoTokenMentese,
    felhasznaloJelszoVisszaallitoTokenAlapjan,
    jelszoVisszaallitoTokenTorlese,
    termekekLekerdezese,
    osszesTermekLekerdezese,
    ujTermek,
    termekModositasa,
    termekTorlese,
    ettermekLekerdezese,
    ujEtterem,
    etteremhezTartozoTermekekTorlese,
    etteremTorlese,
    etteremModositasa,
    etteremAzonositoAlapjan,
    ujRendeles,
    ujRendelesTetel,
    sajatRendelesekLekerdezese,
    osszesRendelesAdminnak,
    rendelesStatuszModositas,
    rendelesTetelekLekerdezese,
    rendelesTulajdonosLekerdezese,
    kategoriakLekerdezese,
    ujKategoria,
    kategoriaModositasa,
    ettermekSzamaKategoriaban,
    kategoriaTorlese
};
