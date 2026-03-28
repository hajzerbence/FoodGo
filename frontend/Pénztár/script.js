const kijelentkezesGomb = document.getElementById('kijelentkezesGomb');
const adminFeluletGomb = document.getElementById('adminFeluletGomb');
let aktualisUserId = null;

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

//Admin felület gomb és ID LEKÉRÉS
const adminFeluletGombFrissitese = async function () {
    try {
        const data = await getMethodFetch('/api/bejelentkezettFelhasznalo');

        if (data && data.userId) {
            aktualisUserId = data.userId;
        }

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

function rendelesOsszesitoMegjelenites() {
    const tabla = document.getElementById('rendelesOsszesito');
    const vegosszegKiiras = document.getElementById('vegosszeg');

    if (!aktualisUserId) {
        return;
    }

    const taroloKulcs = 'foodgo_kosar_' + aktualisUserId;

    let kosar = [];
    const mentettAdat = localStorage.getItem(taroloKulcs);

    if (mentettAdat) {
        kosar = JSON.parse(mentettAdat);
    }

    tabla.innerHTML = '';
    let vegosszeg = 0;

    for (let i = 0; i < kosar.length; i++) {
        const sor = document.createElement('tr');

        const nevCella = document.createElement('td');
        nevCella.innerText = kosar[i].nev;

        const dbCella = document.createElement('td');
        dbCella.innerText = kosar[i].db + ' db';

        const arCella = document.createElement('td');
        const tetelAra = kosar[i].ar * kosar[i].db;
        arCella.innerText = tetelAra + ' Ft';

        sor.appendChild(nevCella);
        sor.appendChild(dbCella);
        sor.appendChild(arCella);

        tabla.appendChild(sor);

        vegosszeg = vegosszeg + tetelAra;
    }

    vegosszegKiiras.innerText = vegosszeg + ' Ft';
}

async function rendelesLeadasa() {
    if (!aktualisUserId) {
        return;
    }

    const szallitasiCim = document.getElementById('szallitasiCim').value;
    const megjegyzes = document.getElementById('megjegyzes').value;

    if (!szallitasiCim) {
        alert('Kérlek add meg a szállítási címet!');
        return;
    }

    const taroloKulcs = 'foodgo_kosar_' + aktualisUserId;

    let kosar = [];
    const mentettAdat = localStorage.getItem(taroloKulcs);

    if (mentettAdat) {
        kosar = JSON.parse(mentettAdat);
    }

    if (kosar.length === 0) {
        alert('A kosár üres!');
        return;
    }

    let teljesOsszeg = 0;
    let kosarTetelek = [];

    for (let i = 0; i < kosar.length; i++) {
        teljesOsszeg = teljesOsszeg + kosar[i].ar * kosar[i].db;

        kosarTetelek.push({
            termekId: kosar[i].id,
            mennyiseg: kosar[i].db,
            egysegAr: kosar[i].ar
        });
    }

    try {
        const valasz = await PostMethodFetch('/api/rendeles_leadasa', {
            teljesOsszeg: teljesOsszeg,
            szallitasiCim: szallitasiCim,
            megjegyzes: megjegyzes,
            kosarTetelek: kosarTetelek
        });

        if (valasz.success) {
            localStorage.removeItem(taroloKulcs);
            alert('A rendelés sikeresen leadva!');
            window.location.href = '/profil';
        } else {
            alert('Hiba: ' + valasz.message);
        }
    } catch (error) {
        alert('A rendelés leadása sikertelen.');
    }
}

function visszaKosarhoz() {
    window.location.href = '/kosar';
}

document.addEventListener('DOMContentLoaded', async function () {
    await adminFeluletGombFrissitese();
    rendelesOsszesitoMegjelenites();

    const visszaGomb = document.getElementById('visszaKosarhozGomb');
    if (visszaGomb) {
        visszaGomb.addEventListener('click', visszaKosarhoz);
    }

    const rendelesLeadGomb = document.getElementById('rendelesLeadGomb');
    if (rendelesLeadGomb) {
        rendelesLeadGomb.addEventListener('click', rendelesLeadasa);
    }

    if (kijelentkezesGomb) {
        kijelentkezesGomb.addEventListener('click', async () => {
            try {
                await PostMethodFetch('/api/kijelentkezes', {});
                window.location.href = '/';
            } catch (error) {
                window.location.href = '/';
            }
        });
    }
});
