const kijelentkezesGomb = document.getElementById('kijelentkezesGomb');
const adminFeluletGomb = document.getElementById('adminFeluletGomb');
const nevKapcsolat = document.getElementById('nevKapcsolat');
const emailKapcsolat = document.getElementById('emailKapcsolat');
const uzenetKapcsolat = document.getElementById('uzenetKapcsolat');
const kuldesGombKapcsolat = document.getElementById('kuldesGombKapcsolat');

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

// Admin felület gomb megjelenítése/eltűntetése
const adminFeluletGombFrissitese = async function () {
    try {
        const data = await getMethodFetch('/api/bejelentkezettFelhasznalo');

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

// Kapcsolat adatok betöltése profilból
const kapcsolatAdataiBetoltese = async function () {
    try {
        const adatok = await getMethodFetch('/api/profil');

        if (adatok) {
            nevKapcsolat.value = adatok.nev || '';
            emailKapcsolat.value = adatok.email || '';
        }
    } catch (error) {
        console.error('Nem sikerült betölteni a profil adatokat: ', error);
    }
};

// Kapcsolat üzenet küldése
const kapcsolatUzenetKuldes = async function () {
    const nev = nevKapcsolat.value;
    const email = emailKapcsolat.value;
    const uzenet = uzenetKapcsolat.value;

    if (!nev || !email || !uzenet) {
        alert('Tölts ki minden mezőt!');
        return;
    }

    try {
        const valasz = await PostMethodFetch('/api/kapcsolat', {
            nev: nev,
            email: email,
            uzenet: uzenet
        });

        if (valasz.success) {
            alert(valasz.message);
            uzenetKapcsolat.value = '';
        } else {
            alert('Hiba: ' + valasz.message);
        }
    } catch (error) {
        alert('Nem sikerült elküldeni az üzenetet.');
    }
};

// Eseménykezelők
document.addEventListener('DOMContentLoaded', function () {
    adminFeluletGombFrissitese();
    kapcsolatAdataiBetoltese();

    kijelentkezesGomb.addEventListener('click', async function () {
        try {
            await PostMethodFetch('/api/kijelentkezes', {});
            window.location.href = '/';
        } catch (error) {
            window.location.href = '/';
        }
    });

    kuldesGombKapcsolat.addEventListener('click', kapcsolatUzenetKuldes);
});
