// Globális változók
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

//Admin felület gomb és FELHASZNÁLÓ AZONOSÍTÁS
const adminFeluletGombFrissitese = async function () {
    try {
        const data = await getMethodFetch('/api/bejelentkezettFelhasznalo');

        if (data && data.userId) {
            aktualisUserId = data.userId; // ELMENTJÜK AZ ID-T!
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

// Termékek betöltése (DOM építés)
async function termekekBetoltese() {
    const termekLista = document.getElementById('termekLista');
    termekLista.innerHTML = '';

    try {
        const valasz = await getMethodFetch('/api/termekek/kfc');
        const termekek = valasz.termekek;

        for (let i = 0; i < termekek.length; i++) {
            const aktualisTermek = termekek[i];

            const oszlop = document.createElement('div');
            oszlop.className = 'col-lg-4 col-md-6 col-sm-10 p-5 pt-1';

            const kartya = document.createElement('div');
            kartya.className = 'card termekKartya h-100';

            const sor = document.createElement('div');
            sor.className = 'row g-0 align-items-center h-100';

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

            szovegDoboz.appendChild(cim);
            szovegDoboz.appendChild(leiras);
            szovegOszlop.appendChild(szovegDoboz);

            const kepOszlop = document.createElement('div');
            kepOszlop.className = 'col-5';

            const kep = document.createElement('img');
            kep.className = 'img-fluid w-75 p-2 pb-0 float-end';
            kep.src = aktualisTermek.kep_utvonal;
            kep.alt = aktualisTermek.nev;

            kepOszlop.appendChild(kep);

            const alsoResz = document.createElement('div');
            alsoResz.className = 'd-flex flex-wrap align-items-center justify-content-between px-4 pb-3 gap-2 w-100 mt-auto';

            const gomb = document.createElement('button');
            gomb.className = 'btn btn-success';
            gomb.type = 'button';
            gomb.innerText = 'Hozzáadás a kosárhoz';

            gomb.addEventListener('click', function () {
                kosarbaRak(aktualisTermek.nev, aktualisTermek.ar);
            });

            const arSzoveg = document.createElement('span');
            arSzoveg.className = 'fs-5 fw-bold';
            arSzoveg.innerText = aktualisTermek.ar + ' Ft';

            alsoResz.appendChild(gomb);
            alsoResz.appendChild(arSzoveg);

            sor.appendChild(szovegOszlop);
            sor.appendChild(kepOszlop);
            sor.appendChild(alsoResz);

            kartya.appendChild(sor);
            oszlop.appendChild(kartya);

            termekLista.appendChild(oszlop);
        }
    } catch (error) {
        console.error(error);
        termekLista.innerText = 'Hiba történt a betöltéskor.';
    }
}

// JAVÍTOTT KOSÁRBA RAKÁS (ID ALAPJÁN)
function kosarbaRak(nev, ar) {
    // Ha véletlenül még nem töltődött volna be az ID
    if (!aktualisUserId) {
        alert('Kérlek várj egy picit, vagy jelentkezz be újra!');
        return;
    }

    // A kulcs most már tartalmazza az ID-t! Pl: "foodgo_kosar_12"
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

    // Mentés az EGYEDI kulcs alá
    localStorage.setItem(taroloKulcs, JSON.stringify(kosarLista));

    alert(nev + ' bekerült a kosárba!');
}

document.addEventListener('DOMContentLoaded', async function () {
    // Fontos: megvárjuk (await), amíg lekéri az ID-t, és csak utána töltjük be a termékeket
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
