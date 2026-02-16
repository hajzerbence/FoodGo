// Kijelentkezés gomb megragadása
const kijelentkezesGomb = document.getElementById('kijelentkezesGomb');
const adminFeluletGomb = document.getElementById('adminFeluletGomb');

//!PostMethodFetch
const PostMethodFetch = async function (url, value) {
    try {
        const data = await fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(value)
        });
        if (!data.ok) {
            throw new Error(`POST hiba: ${data.status} ${data.statusText}`);
        }
        return await data.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

//! getMethodFetch
const getMethodFetch = async function (url) {
    try {
        const data = await fetch(url, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' }
        });

        if (!data.ok) {
            throw new Error(`GET hiba: ${data.status} ${data.statusText}`);
        }

        return await data.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

// Adatok betöltése
async function profilBetoltes() {
    try {
        const adatok = await getMethodFetch('/api/profil');

        document.getElementById('nev').value = adatok.nev;
        document.getElementById('email').value = adatok.email;
        document.getElementById('telefonszam').value = adatok.telefonszam;
    } catch (error) {
        console.error('Hiba:', error);
        alert('Nem sikerült betölteni az adatokat.');
    }
}

// Adatok mentése
async function adatokMentese() {
    const nev = document.getElementById('nev').value;
    const email = document.getElementById('email').value;
    const telefonszam = document.getElementById('telefonszam').value;

    try {
        const valasz = await PostMethodFetch('/api/profil', {
            muvelet: 'adatModositas',
            nev,
            email,
            telefonszam
        });

        if (valasz.success) {
            alert(valasz.message);
        } else {
            alert('Hiba: ' + valasz.message);
        }
    } catch (error) {
        alert('Mentés sikertelen');
    }
}

// Jelszó mentése
async function jelszoMentese() {
    const regiJelszo = document.getElementById('regiJelszo').value;
    const ujJelszo = document.getElementById('ujJelszo').value;
    const ujJelszoMegerosites = document.getElementById('ujJelszoMegerosites').value;

    if (ujJelszo !== ujJelszoMegerosites) {
        return alert('A jelszavak nem egyeznek!');
    }

    try {
        const valasz = await PostMethodFetch('/api/profil', {
            muvelet: 'jelszoModositas',
            regiJelszo,
            ujJelszo
        });

        if (valasz.success) {
            alert(valasz.message);
            document.getElementById('regiJelszo').value = '';
            document.getElementById('ujJelszo').value = '';
            document.getElementById('ujJelszoMegerosites').value = '';
        } else {
            alert('Hiba: ' + valasz.message);
        }
    } catch (error) {
        alert('Jelszó modosítás sikertelen');
    }
}

//Admin felület gomb megjelenítése/eltűntetése
const adminFeluletGombFrissitese = async function () {
    try {
        const data = await getMethodFetch('/api/bejelentkezettFelhasznalo');
        console.log('Fetch eredménye: ', data);
        if (data && data.admine === true) {
            adminFeluletGomb.style.display = 'block';
        } else {
            adminFeluletGomb.style.display = 'none';
        }
    } catch (error) {
        console.error('Hiba történt: ', error);
        adminFeluletGomb.style.display = 'none';
    }
};

// Függvények meghívása a megfelelő gombok kattintására
document.addEventListener('DOMContentLoaded', function () {
    adminFeluletGombFrissitese();

    kijelentkezesGomb.addEventListener('click', async () => {
        try {
            await PostMethodFetch('/api/kijelentkezes', {}); // session törlés
            window.location.href = '/'; // vissza a bejelentkezésre
        } catch (error) {
            // ha valamiért hiba van, akkor is dobjuk vissza loginra
            window.location.href = '/';
        }
    });

    profilBetoltes();

    document.getElementById('adatMentesBtn').addEventListener('click', adatokMentese);
    document.getElementById('jelszoMentesBtn').addEventListener('click', jelszoMentese);
});
