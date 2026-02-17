// Kijelentkezés gomb megragadása (ezek a szokásosak, maradtak)
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

function kosarMegjelenites() {
    // Megkeressük a táblázatot és a végösszeg helyét
    const tabla = document.getElementById('kosarTartalom');
    const vegosszegKiiras = document.getElementById('vegosszeg');

    // Alapból üres a kosár lista
    let kosar = [];

    // Megnézzük, van-e mentett adat a böngészőben
    const mentettAdat = localStorage.getItem('foodgo_kosar');
    if (mentettAdat) {
        kosar = JSON.parse(mentettAdat);
    }

    // Töröljük a táblázatot, hogy tisztán induljunk
    tabla.innerHTML = '';

    // Ebben számoljuk az összes árat
    let vegosszeg = 0;

    // Végigmegyünk a kosár elemein egy sima ciklussal
    for (let i = 0; i < kosar.length; i++) {
        // Létrehozunk egy sort (tr)
        const sor = document.createElement('tr');

        // 1. oszlop: Név
        const nevCella = document.createElement('td');
        nevCella.innerText = kosar[i].nev;

        // 2. oszlop: Mennyiség
        const dbCella = document.createElement('td');
        dbCella.innerText = kosar[i].db + ' db';

        // 3. oszlop: Ár (darabár szorozva mennyiséggel)
        const arCella = document.createElement('td');
        const tetelAra = kosar[i].ar * kosar[i].db; // Matek
        arCella.innerText = tetelAra + ' Ft';

        // Hozzáadjuk a cellákat a sorhoz
        sor.appendChild(nevCella);
        sor.appendChild(dbCella);
        sor.appendChild(arCella);

        // Hozzáadjuk a sort a táblázathoz
        tabla.appendChild(sor);

        // Hozzáadjuk ezt az árat a végösszeghez
        vegosszeg = vegosszeg + tetelAra;
    }

    // Kiírjuk a végösszeget
    vegosszegKiiras.innerText = vegosszeg + ' Ft';
}

// Kosár ürítése gomb
function kosarUritese() {
    // Töröljük a memóriából
    localStorage.removeItem('foodgo_kosar');
    // Újra kirajzoljuk (így üres lesz)
    kosarMegjelenites();
    alert('A kosár kiürítve!');
}

// Fizetés gomb (egyelőre csak kiírja)
function fizetesInditasa() {
    const mentettAdat = localStorage.getItem('foodgo_kosar');

    // Ha üres a kosár, nem engedünk fizetni
    if (!mentettAdat || mentettAdat === '[]') {
        alert('A kosarad üres! Előbb válassz valamit.');
        return; // Kilépünk, nem fut tovább
    }

    // Itt lesz majd a szerver kommunikáció később
    alert('Rendelés leadása folyamatban... (Ez a rész később jön)');
}

// Indításkor lefutó dolgok
document.addEventListener('DOMContentLoaded', function () {
    adminFeluletGombFrissitese();

    // Azonnal kirajzoljuk a kosarat
    kosarMegjelenites();

    // Gombok bekötése
    const uresitGomb = document.getElementById('uresitKosar');
    if (uresitGomb) {
        uresitGomb.addEventListener('click', kosarUritese);
    }

    const fizetGomb = document.getElementById('fizetesGomb');
    if (fizetGomb) {
        fizetGomb.addEventListener('click', fizetesInditasa);
    }

    // Kijelentkezés
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
