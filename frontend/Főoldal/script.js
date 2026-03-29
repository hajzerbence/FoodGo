//Megfogjuk a szűrő gombjait Id alapján
const kategoriakGombok = document.getElementById('kategoriakGombok');
const etteremLista = document.getElementById('etteremLista');
let ettermek = [];

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

function ettermekKirajzolasa(lista) {
    etteremLista.innerHTML = '';

    if (!lista || lista.length === 0) {
        const uresDiv = document.createElement('div');
        uresDiv.className = 'col-12 text-center';
        uresDiv.innerHTML = 'Nincs megjeleníthető étterem.';
        etteremLista.appendChild(uresDiv);
        return;
    }

    for (let i = 0; i < lista.length; i++) {
        const etterem = lista[i];

        const oszlop = document.createElement('div');
        oszlop.className = 'col-md-4 p-3';

        const link = document.createElement('a');
        link.href = '/etterem/' + etterem.azonosito;
        link.className = 'kartyaLink';

        const kartya = document.createElement('div');
        kartya.className = 'card';

        const kep = document.createElement('img');
        kep.src = etterem.boritokep_utvonal;
        kep.className = 'card-img-top';
        kep.alt = etterem.nev;

        const kartyaBody = document.createElement('div');
        kartyaBody.className = 'card-body';

        const cim = document.createElement('h5');
        cim.className = 'card-title';
        cim.innerHTML = etterem.nev;

        const leiras = document.createElement('p');
        leiras.className = 'card-text';
        leiras.innerHTML = etterem.leiras;

        kartyaBody.appendChild(cim);
        kartyaBody.appendChild(leiras);

        kartya.appendChild(kep);
        kartya.appendChild(kartyaBody);

        link.appendChild(kartya);
        oszlop.appendChild(link);
        etteremLista.appendChild(oszlop);
    }
}

function mindentMutat() {
    ettermekKirajzolasa(ettermek);
}

function csakKategoriaMutat(kategoria) {
    const szurtEttermek = [];

    for (let i = 0; i < ettermek.length; i++) {
        if (ettermek[i].kategoria === kategoria) {
            szurtEttermek.push(ettermek[i]);
        }
    }

    ettermekKirajzolasa(szurtEttermek);
}

function kategoriakKirajzolasa() {
    kategoriakGombok.innerHTML = '';

    const osszesGomb = document.createElement('button');
    osszesGomb.type = 'button';
    osszesGomb.className = 'btn btn-success';
    osszesGomb.innerHTML = 'Összes';

    osszesGomb.addEventListener('click', function () {
        mindentMutat();
    });

    kategoriakGombok.appendChild(osszesGomb);

    const kategoriak = [];

    for (let i = 0; i < ettermek.length; i++) {
        const kategoria = ettermek[i].kategoria;

        if (kategoria && !kategoriak.includes(kategoria)) {
            kategoriak.push(kategoria);
        }
    }

    for (let i = 0; i < kategoriak.length; i++) {
        const gomb = document.createElement('button');
        gomb.type = 'button';
        gomb.className = 'btn btn-outline-success';
        gomb.innerHTML = kategoriak[i];

        gomb.addEventListener('click', function () {
            csakKategoriaMutat(kategoriak[i]);
        });

        kategoriakGombok.appendChild(gomb);
    }
}

async function ettermekBetoltese() {
    try {
        const valasz = await getMethodFetch('/api/ettermek');

        if (valasz.success) {
            ettermek = valasz.ettermek;
            kategoriakKirajzolasa();
            mindentMutat();
        }
    } catch (error) {
        etteremLista.innerHTML = '<div class="col-12 text-center text-danger">Hiba történt az éttermek betöltésekor.</div>';
    }
}

// Navbar átlátszóság kezelése görgetésre

// NAVBAR ÉS OFFCANVAS ELEMEK ELÉRÉSE ID ALAPJÁN
const navbar = document.getElementById('navbar'); // a navbar elem
const hamburgerMenu = document.getElementById('hamburgerMenu'); // az offcanvas konténer
// NAVBAR ÁLLAPOT FRISSÍTÉSE GÖRGETÉS ALAPJÁN
function frissitNavbar() {
    if (window.scrollY > 1) {
        // 1px-nél nagyobb görgetés esetén
        navbar.classList.add('navbarFeher'); // fehér navbar állapot bekapcsolása, megkapja a navbar a fehér osztályt
    } else {
        // a lap tetejéhez közel
        navbar.classList.remove('navbarFeher'); // fehér navbar állapot kikapcsolása, eltávolítja a fehér osztályt -> átlátszó lesz (alapból az van beállítva)
    }
}

// ESEMÉNYEK: görgetéskor és betöltéskor frissítés
window.addEventListener('scroll', frissitNavbar); // görgetés figyelése
window.addEventListener('load', frissitNavbar); // kezdeti állapot beállítása (amikor betölt az oldal)

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
document.addEventListener('DOMContentLoaded', async function () {
    await ettermekBetoltese();

    adminFeluletGombFrissitese();

    kijelentkezesGomb.addEventListener('click', async () => {
        try {
            await PostMethodFetch('/api/kijelentkezes', {});
            window.location.href = '/';
        } catch (error) {
            window.location.href = '/';
        }
    });
});
