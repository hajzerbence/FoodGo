// Globális változók
const kijelentkezesGomb = document.getElementById('kijelentkezesGomb');
const adminFeluletGomb = document.getElementById('adminFeluletGomb');
let aktualisUserId = null; // A bejelentkezett felhasználó ID-ja

//! POST kérés segédfüggvény
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

//! GET kérés segédfüggvény
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

//! Admin gomb + userId lekérése
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
        console.error('Hiba az admin gomb frissítésekor:', error);
        adminFeluletGomb.style.display = 'none';
    }
};

//! Az URL-ből kinyeri az étterem azonosítóját
// Pl. "/etterem/kfc" -> "kfc"
function getEtteremAzonosito() {
    const urlReszek = window.location.pathname.split('/'); // ['', 'etterem', 'kfc']
    return urlReszek[urlReszek.length - 1]; // az utolsó rész: 'kfc'
}

//! Étterem adatainak betöltése és megjelenítése
async function etteremBetoltese(azonosito) {
    try {
        const valasz = await getMethodFetch('/api/ettermek/' + azonosito);
        const etterem = valasz.etterem;

        // Oldal title frissítése
        document.title = etterem.nev + ' – FoodGo';

        // Breadcrumb frissítése
        document.getElementById('breadcrumbNev').innerText = etterem.nev;

        // Logo és név frissítése
        document.getElementById('etteremLogo').src = etterem.logo_utvonal;
        document.getElementById('etteremLogo').alt = etterem.nev + ' logo';
        document.getElementById('etteremNev').innerText = etterem.nev;
        document.getElementById('etteremLeiras').innerText = etterem.leiras;
    } catch (error) {
        console.error('Hiba az étterem betöltésekor:', error);
        document.getElementById('etteremNev').innerText = 'Étterem nem található.';
    }
}

//! Termékek betöltése és kártyák felépítése
async function termekekBetoltese(azonosito) {
    const termekLista = document.getElementById('termekLista');
    termekLista.innerHTML = '';

    try {
        const valasz = await getMethodFetch('/api/termekek/' + azonosito);
        const termekek = valasz.termekek;

        for (let i = 0; i < termekek.length; i++) {
            const aktualisTermek = termekek[i];

            // Oszlop
            const oszlop = document.createElement('div');
            oszlop.className = 'col-xl-6 col-lg-6 col-md-12';

            // Kártya konténer
            const kartya = document.createElement('div');
            kartya.className = 'card termekKartya h-100 d-flex flex-row';

            // --- BAL OLDAL: szöveg, ár, gomb ---
            const balOldal = document.createElement('div');
            balOldal.className = 'w-60 p-4 d-flex flex-column justify-content-between';

            const szovegResz = document.createElement('div');

            const cim = document.createElement('h5');
            cim.className = 'termekCim mb-2';
            cim.innerText = aktualisTermek.nev;

            const leiras = document.createElement('p');
            leiras.className = 'termekLeiras mb-3';
            leiras.innerText = aktualisTermek.leiras;

            szovegResz.appendChild(cim);
            szovegResz.appendChild(leiras);

            // Alsó sor: gomb + ár
            const alsoSor = document.createElement('div');
            alsoSor.className = 'd-flex align-items-center gap-3';

            const gomb = document.createElement('button');
            gomb.className = 'btn btn-success btn-sm rounded-pill px-3 fw-bold shadow-sm';
            gomb.type = 'button';
            gomb.innerText = '+ Kosárba';

            gomb.addEventListener('click', function () {
                kosarbaRak(aktualisTermek.id, aktualisTermek.nev, aktualisTermek.ar);
            });

            const arSzoveg = document.createElement('span');
            arSzoveg.className = 'fs-5 fw-bold text-success mb-0';
            arSzoveg.innerText = aktualisTermek.ar + ' Ft';

            alsoSor.appendChild(gomb);
            alsoSor.appendChild(arSzoveg);

            balOldal.appendChild(szovegResz);
            balOldal.appendChild(alsoSor);

            // --- JOBB OLDAL: termék kép ---
            const jobbOldal = document.createElement('div');
            jobbOldal.className = 'w-40 p-3 d-flex align-items-center justify-content-center';

            const kep = document.createElement('img');
            kep.className = 'termekKep';
            kep.src = aktualisTermek.kep_utvonal;
            kep.alt = aktualisTermek.nev;

            jobbOldal.appendChild(kep);

            // Összefűzés
            kartya.appendChild(balOldal);
            kartya.appendChild(jobbOldal);
            oszlop.appendChild(kartya);
            termekLista.appendChild(oszlop);
        }
    } catch (error) {
        console.error('Hiba a termékek betöltésekor:', error);
        termekLista.innerHTML = '<p class="text-danger">Hiba történt a termékek betöltésekor.</p>';
    }
}

//! Kosárba rakás (localStorage, userId alapján)
function kosarbaRak(id, nev, ar) {
    if (!aktualisUserId) {
        alert('Kérlek várj egy picit, vagy jelentkezz be újra!');
        return;
    }

    const taroloKulcs = 'foodgo_kosar_' + aktualisUserId;

    let kosarLista = [];
    const eddigiKosar = localStorage.getItem(taroloKulcs);

    if (eddigiKosar) {
        kosarLista = JSON.parse(eddigiKosar);
    }

    let benneVan = false;

    for (let i = 0; i < kosarLista.length; i++) {
        if (kosarLista[i].id === id) {
            // Név helyett most már azonosító (ID) alapján ellenőrizzük, ez sokkal biztosabb a vizsgára!
            kosarLista[i].db = kosarLista[i].db + 1;
            benneVan = true;
            break;
        }
    }

    if (benneVan === false) {
        const ujTermek = { id: id, nev: nev, ar: ar, db: 1 }; // Bekerült az ID mentése
        kosarLista.push(ujTermek);
    }

    localStorage.setItem(taroloKulcs, JSON.stringify(kosarLista));
    alert(nev + ' bekerült a kosárba!');
}

//! Oldal betöltésekor fut le
document.addEventListener('DOMContentLoaded', async function () {
    // 1. Lekérjük a bejelentkezett user ID-ját
    await adminFeluletGombFrissitese();

    // 2. Kinyerjük az URL-ből az étterem azonosítóját
    const azonosito = getEtteremAzonosito();

    // 3. Betöltjük az étterem adatait és a termékeit egyszerre
    await etteremBetoltese(azonosito);
    await termekekBetoltese(azonosito);

    // 4. Kijelentkezés gomb
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
