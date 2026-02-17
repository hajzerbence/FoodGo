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

// Ez a függvény tölti be a termékeket
async function termekekBetoltese() {
    // Megkeressük a dobozt, ahová a kártyákat rakjuk
    const termekLista = document.getElementById('termekLista');

    // Töröljük a tartalmát, hogy ne duplázódjon, ha többször meghívjuk
    termekLista.innerHTML = '';

    try {
        // Lekérjük az adatokat a szerverről
        const valasz = await getMethodFetch('/api/termekek/kfc');
        // A válaszban lévő termékek listája
        const termekek = valasz.termekek;

        // Végigmegyünk a termékeken egy sima for ciklussal
        for (let i = 0; i < termekek.length; i++) {
            const aktualisTermek = termekek[i];

            // 1. Létrehozzuk a külső oszlopot (col)
            const oszlop = document.createElement('div');
            oszlop.className = 'col-lg-4 col-md-6 col-sm-10 p-5 pt-1';

            // 2. Létrehozzuk a kártyát (card)
            const kartya = document.createElement('div');
            kartya.className = 'card termekKartya h-100';

            // 3. Létrehozzuk a sort a kártyán belül (row)
            const sor = document.createElement('div');
            sor.className = 'row g-0 align-items-center h-100';

            // 4. Bal oldal: Szöveges rész (col-7)
            const szovegOszlop = document.createElement('div');
            szovegOszlop.className = 'col-7';

            const szovegDoboz = document.createElement('div');
            szovegDoboz.className = 'ps-4';

            const cim = document.createElement('h5');
            cim.className = 'card-title pt-3';
            cim.innerText = aktualisTermek.nev;

            const leiras = document.createElement('p');
            leiras.className = 'card-text mb-2';
            leiras.innerText = aktualisTermek.leiras;

            // Összefűzzük a szöveges részt
            szovegDoboz.appendChild(cim);
            szovegDoboz.appendChild(leiras);
            szovegOszlop.appendChild(szovegDoboz);

            // 5. Jobb oldal: Kép rész (col-5)
            const kepOszlop = document.createElement('div');
            kepOszlop.className = 'col-5';

            const kep = document.createElement('img');
            kep.className = 'img-fluid w-75 p-2 pb-0 float-end';
            kep.src = aktualisTermek.kep_utvonal;
            kep.alt = aktualisTermek.nev;

            kepOszlop.appendChild(kep);

            // 6. Alsó rész: Gomb és Ár
            const alsoResz = document.createElement('div');
            alsoResz.className = 'd-flex flex-wrap align-items-center justify-content-between px-4 pb-3 gap-2 w-100 mt-auto';

            const gomb = document.createElement('button');
            gomb.className = 'btn btn-success';
            gomb.type = 'button';
            gomb.innerText = 'Hozzáadás a kosárhoz';

            // Itt adjuk hozzá a gombnyomás eseményt (Kattintáskor mi történjen)
            gomb.addEventListener('click', function () {
                kosarbaRak(aktualisTermek.nev, aktualisTermek.ar);
            });

            const arSzoveg = document.createElement('span');
            arSzoveg.className = 'fs-5 fw-bold';
            arSzoveg.innerText = aktualisTermek.ar + ' Ft';

            alsoResz.appendChild(gomb);
            alsoResz.appendChild(arSzoveg);

            // 7. Mindent összerakunk a megfelelő sorrendben
            sor.appendChild(szovegOszlop);
            sor.appendChild(kepOszlop);
            sor.appendChild(alsoResz);

            kartya.appendChild(sor);
            oszlop.appendChild(kartya);

            // Végül betesszük a kész kártyát az oldalra
            termekLista.appendChild(oszlop);
        }
    } catch (error) {
        console.error(error);
        termekLista.innerText = 'Hiba történt a betöltéskor.';
    }
}

// Kosrba rakó függvény
function kosarbaRak(nev, ar) {
    // 1. Lekérjük, mi van most a kosárban
    let eddigiKosar = localStorage.getItem('foodgo_kosar');
    let kosarLista = [];

    // Ha van már valami, akkor átalakítjuk listává
    if (eddigiKosar) {
        kosarLista = JSON.parse(eddigiKosar);
    }

    // 2. Megnézzük, szerepel-e már ez a termék a listában
    let talalat = false; // alapból nincs találat

    for (let i = 0; i < kosarLista.length; i++) {
        // Ha a név egyezik
        if (kosarLista[i].nev === nev) {
            // Növeljük a darabszámot eggyel
            kosarLista[i].db = kosarLista[i].db + 1;
            talalat = true; // Jelezzük, hogy megtaláltuk
        }
    }

    // 3. Ha a ciklus végére sem találtuk meg (talalat még mindig false)
    if (talalat === false) {
        // Csinálunk egy új terméket
        let ujTermek = {
            nev: nev,
            ar: ar,
            db: 1
        };
        // Hozzáadjuk a lista végére
        kosarLista.push(ujTermek);
    }

    // 4. Visszamentjük az egészet a localStorage-ba
    localStorage.setItem('foodgo_kosar', JSON.stringify(kosarLista));

    // Visszajelzés a felhasználónak
    alert(nev + ' bekerült a kosárba!');
}

// Függvények meghívása a megfelelő gombok kattintására
document.addEventListener('DOMContentLoaded', function () {
    adminFeluletGombFrissitese();

    // Itt hívjuk meg a termékek betöltését
    termekekBetoltese();

    if (kijelentkezesGomb) {
        kijelentkezesGomb.addEventListener('click', async () => {
            try {
                await PostMethodFetch('/api/kijelentkezes', {}); // session törlés
                window.location.href = '/'; // vissza a bejelentkezésre
            } catch (error) {
                // ha valamiért hiba van, akkor is dobjuk vissza loginra
                window.location.href = '/';
            }
        });
    }
});
