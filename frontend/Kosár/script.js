const kijelentkezesGomb = document.getElementById('kijelentkezesGomb');
const adminFeluletGomb = document.getElementById('adminFeluletGomb');
let aktualisUserId = null; // ITT TÁROLJUK, KI VAN BELÉPVE

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
            aktualisUserId = data.userId; // ELMENTJÜK
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

// JAVÍTOTT KOSÁR MEGJELENÍTÉS (ID ALAPJÁN)
function kosarMegjelenites() {
    const tabla = document.getElementById('kosarTartalom');
    const vegosszegKiiras = document.getElementById('vegosszeg');

    // Ha még nem jött meg az ID, várunk vagy üreset mutatunk
    if (!aktualisUserId) {
        return;
    }

    // Egyedi kulcs használata
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

// JAVÍTOTT KOSÁR ÜRÍTÉS
function kosarUritese() {
    if (!aktualisUserId) return;

    const taroloKulcs = 'foodgo_kosar_' + aktualisUserId;

    // Csak a sajátját törli!
    localStorage.removeItem(taroloKulcs);

    kosarMegjelenites();
    alert('A kosár kiürítve!');
}

function fizetesInditasa() {
    if (!aktualisUserId) return;
    const taroloKulcs = 'foodgo_kosar_' + aktualisUserId;

    const mentettAdat = localStorage.getItem(taroloKulcs);

    if (!mentettAdat || mentettAdat === '[]') {
        alert('A kosarad üres! Előbb válassz valamit.');
        return;
    }

    alert('Rendelés leadása folyamatban... (Hamarosan)');
}

document.addEventListener('DOMContentLoaded', async function () {
    // Megvárjuk az ID-t
    await adminFeluletGombFrissitese();
    // Csak utána rajzolunk
    kosarMegjelenites();

    const uresitGomb = document.getElementById('uresitKosar');
    if (uresitGomb) {
        uresitGomb.addEventListener('click', kosarUritese);
    }

    const fizetGomb = document.getElementById('fizetesGomb');
    if (fizetGomb) {
        fizetGomb.addEventListener('click', fizetesInditasa);
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
