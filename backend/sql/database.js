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

async function selectall() {
    const query = 'SELECT * FROM felhasznalo;';
    const [rows] = await pool.execute(query);
    return rows;
}

//!Export
module.exports = {
    selectall,
    ujFelhasznalo
};
