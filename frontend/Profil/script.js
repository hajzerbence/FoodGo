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

// Korábbi rendelések betöltése (Junior szinten)
async function rendelesekBetoltese() {
    try {
        const valasz = await getMethodFetch('/api/sajat_rendelesek');

        const tabla = document.getElementById('rendelesekTartalom');
        const nincsRendelesUzenet = document.getElementById('nincsRendelesUzenet');

        tabla.innerHTML = '';

        if (valasz.success && valasz.rendelesek.length > 0) {
            nincsRendelesUzenet.style.display = 'none';

            for (let i = 0; i < valasz.rendelesek.length; i++) {
                const rendel = valasz.rendelesek[i];

                const sor = document.createElement('tr');

                const idTd = document.createElement('td');
                idTd.textContent = '#' + rendel.id;

                const datumTd = document.createElement('td');
                datumTd.textContent = new Date(rendel.datum).toLocaleString('hu-HU');

                const cimTd = document.createElement('td');
                cimTd.textContent = rendel.szallitasi_cim;

                const osszegTd = document.createElement('td');
                osszegTd.textContent = rendel.teljes_osszeg + ' Ft';
                osszegTd.classList.add('fw-bold');

                const statuszTd = document.createElement('td');
                const statuszSpan = document.createElement('span');

                statuszSpan.classList.add('badge');

                if (rendel.statusz === 'Feldolgozás alatt') {
                    statuszSpan.classList.add('bg-warning', 'text-dark');
                } else if (rendel.statusz === 'Törölve') {
                    statuszSpan.classList.add('bg-danger');
                } else {
                    statuszSpan.classList.add('bg-success');
                }

                statuszSpan.textContent = rendel.statusz;
                statuszTd.appendChild(statuszSpan);

                const reszletekTd = document.createElement('td');
                const mutatGomb = document.createElement('button');
                mutatGomb.type = 'button';
                mutatGomb.classList.add('btn', 'btn-sm', 'btn-info');
                mutatGomb.textContent = 'Mutat';
                reszletekTd.appendChild(mutatGomb);

                sor.appendChild(idTd);
                sor.appendChild(datumTd);
                sor.appendChild(cimTd);
                sor.appendChild(osszegTd);
                sor.appendChild(statuszTd);
                sor.appendChild(reszletekTd);

                tabla.appendChild(sor);

                const reszletSor = document.createElement('tr');
                reszletSor.style.display = 'none';
                reszletSor.classList.add('table-light');

                const reszletTd = document.createElement('td');
                reszletTd.colSpan = 6;
                reszletTd.textContent = 'Betöltés...';

                reszletSor.appendChild(reszletTd);
                tabla.appendChild(reszletSor);

                mutatGomb.addEventListener('click', async function () {
                    if (reszletSor.style.display === 'table-row') {
                        reszletSor.style.display = 'none';
                        mutatGomb.textContent = 'Mutat';
                        return;
                    }

                    reszletSor.style.display = 'table-row';
                    mutatGomb.textContent = 'Betöltés...';

                    try {
                        const response = await getMethodFetch('/api/rendeles_tetelek/' + rendel.id);

                        reszletTd.textContent = '';

                        const erosSzoveg = document.createElement('strong');
                        erosSzoveg.textContent = 'Rendelt tételek:';
                        reszletTd.appendChild(erosSzoveg);

                        const lista = document.createElement('ul');

                        for (let j = 0; j < response.tetelek.length; j++) {
                            const tetel = response.tetelek[j];
                            const listaElem = document.createElement('li');
                            listaElem.textContent = tetel.termek_nev + ' - ' + tetel.darab + ' db - ' + tetel.egyseg_ar + ' Ft/db';
                            lista.appendChild(listaElem);
                        }

                        reszletTd.appendChild(lista);
                        mutatGomb.textContent = 'Elrejt';
                    } catch (error) {
                        reszletTd.textContent = 'Hiba történt a betöltéskor.';
                        mutatGomb.textContent = 'Mutat';
                    }
                });
            }
        } else {
            nincsRendelesUzenet.style.display = 'block';
        }
    } catch (error) {
        console.error('Hiba a rendelések lekérésekor:', error);
    }
}

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

    // A rendeléseket is meghívjuk, hogy betöltse
    rendelesekBetoltese();
});
