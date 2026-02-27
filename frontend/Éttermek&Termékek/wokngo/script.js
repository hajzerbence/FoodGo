// Globális változók
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

//Admin felület gomb és FELHASZNÁLÓ AZONOSÍTÁS
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

async function termekekBetoltese() {
    const termekLista = document.getElementById('termekLista');
    termekLista.innerHTML = '';

    try {
        const valasz = await getMethodFetch('/api/termekek/wokngo');
        const termekek = valasz.termekek;

        for (let i = 0; i < termekek.length; i++) {
            const aktualisTermek = termekek[i];

            // 1. Oszlop beállítása (Nagy képernyőn 2 db van egymás mellett)
            const oszlop = document.createElement('div');
            oszlop.className = 'col-xl-6 col-lg-6 col-md-12';

            // 2. Kártya konténer
            const kartya = document.createElement('div');
            kartya.className = 'card termekKartya h-100 d-flex flex-row';

            // --- BAL OLDAL: Szöveg, leírás, gomb ---
            // A w-60 kb 60%-ot foglal el. flex-column: fentről lefelé rendezi az elemeket.
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

            // Alsó sor: Ár és Gomb
            const alsoSor = document.createElement('div');
            alsoSor.className = 'd-flex align-items-center gap-3'; // gap-3 ad egy kis helyet az ár és a gomb közé

            const arSzoveg = document.createElement('span');
            arSzoveg.className = 'fs-5 fw-bold text-success mb-0';
            arSzoveg.innerText = aktualisTermek.ar + ' Ft';

            const gomb = document.createElement('button');
            gomb.className = 'btn btn-success btn-sm rounded-pill px-3 fw-bold shadow-sm';
            gomb.type = 'button';
            gomb.innerText = '+ Kosárba';

            gomb.addEventListener('click', function () {
                kosarbaRak(aktualisTermek.nev, aktualisTermek.ar);
            });

            alsoSor.appendChild(gomb);
            alsoSor.appendChild(arSzoveg);

            balOldal.appendChild(szovegResz);
            balOldal.appendChild(alsoSor);

            // --- JOBB OLDAL: Csak a lebegő PNG kép ---
            // A w-40 kb 40%-ot foglal. p-3: kap egy kis margót.
            const jobbOldal = document.createElement('div');
            jobbOldal.className = 'w-40 p-3 d-flex align-items-center justify-content-center';

            const kep = document.createElement('img');
            kep.className = 'termekKep';
            kep.src = aktualisTermek.kep_utvonal;
            kep.alt = aktualisTermek.nev;

            jobbOldal.appendChild(kep);

            // --- Összefűzés ---
            kartya.appendChild(balOldal);
            kartya.appendChild(jobbOldal);
            oszlop.appendChild(kartya);

            termekLista.appendChild(oszlop);
        }
    } catch (error) {
        console.error(error);
        termekLista.innerText = 'Hiba történt a betöltéskor.';
    }
}

// KOSÁRBA RAKÁS (ID ALAPJÁN)
function kosarbaRak(nev, ar) {
    if (!aktualisUserId) {
        alert('Kérlek várj egy picit, vagy jelentkezz be újra!');
        return;
    }

    const taroloKulcs = 'foodgo_kosar_' + aktualisUserId;

    let eddigiKosar = localStorage.getItem(taroloKulcs);
    let kosarLista = [];

    if (eddigiKosar) {
        kosarLista = JSON.parse(eddigiKosar);
    }

    let benneVan = false;

    for (let i = 0; i < kosarLista.length; i++) {
        if (kosarLista[i].nev === nev) {
            kosarLista[i].db = kosarLista[i].db + 1;
            benneVan = true;
            break;
        }
    }

    if (benneVan === false) {
        const ujTermek = {
            nev: nev,
            ar: ar,
            db: 1
        };
        kosarLista.push(ujTermek);
    }

    localStorage.setItem(taroloKulcs, JSON.stringify(kosarLista));
    alert(nev + ' bekerült a kosárba!');
}

document.addEventListener('DOMContentLoaded', async function () {
    await adminFeluletGombFrissitese();
    termekekBetoltese();

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
