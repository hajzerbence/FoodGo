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

async function selectall() {
    const query = 'SELECT * FROM felhasznalo;';
    const [rows] = await pool.execute(query);
    return rows;
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
    termekekLekerdezese
};
