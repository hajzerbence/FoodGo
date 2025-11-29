const express = require('express');
const path = require('path');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../frontend')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'foodgo'
});

db.connect(function (err) {
    if (err) {
        console.log('Hiba a MySQL kapcsolódáskor:', err);
    } else {
        console.log('Sikeres MySQL kapcsolat.');
    }
});

app.get('/', function (req, res) {
    res.redirect('/Regisztráció/register.html');
});

app.post('/register', function (req, res) {
    const nev = req.body.nev;
    const email = req.body.email;
    const telefon = req.body.telefon;
    const jelszo = req.body.jelszo;
    const jelszo2 = req.body.jelszo2;

    if (!nev || !email || !telefon || !jelszo || !jelszo2) {
        return res.send('Hiányzó adat a regisztrációs űrlapon.');
    }

    if (jelszo !== jelszo2) {
        return res.send('A két jelszó nem egyezik.');
    }

    const sql = 'INSERT INTO users (nev, email, telefon, jelszo) VALUES (?, ?, ?, ?)';

    db.query(sql, [nev, email, telefon, jelszo], function (err, result) {
        if (err) {
            console.log('Hiba a beszúrásnál:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.send('Ezzel az email címmel már létezik felhasználó.');
            }
            return res.send('Hiba történt a regisztráció során.');
        }

        console.log('Új felhasználó ID:', result.insertId);
        res.send("Sikeres regisztráció! <a href='/Bejelentkezés/login.html'>Bejelentkezés</a>");
    });
});

app.post('/login', function (req, res) {
    const email = req.body.email;
    const jelszo = req.body.jelszo;

    if (!email || !jelszo) {
        return res.send('Add meg az email címet és a jelszót.');
    }

    const sql = 'SELECT * FROM users WHERE email = ? AND jelszo = ?';

    db.query(sql, [email, jelszo], function (err, results) {
        if (err) {
            console.log('Hiba a lekérdezésnél:', err);
            return res.send('Hiba történt a bejelentkezés során.');
        }

        if (results.length === 0) {
            return res.send('Hibás email vagy jelszó.');
        }

        const user = results[0];
        console.log('Sikeres bejelentkezés:', user.email);

        res.send('Sikeres bejelentkezés, ' + user.nev + '! (Itt majd átirányítunk a főoldalra.)');
    });
});

app.listen(port, function () {
    console.log('Szerver fut a http://localhost:' + port + ' címen');
});
