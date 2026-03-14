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
        // Elkérjük a backend-től a JSON adatokat
        const valasz = await getMethodFetch('/api/sajat_rendelesek');

        const tabla = document.getElementById('rendelesekTartalom');
        const nincsRendelesUzenet = document.getElementById('nincsRendelesUzenet');

        // Ha van legalább 1 rendelés
        if (valasz.success && valasz.rendelesek.length > 0) {
            nincsRendelesUzenet.style.display = 'none'; // Elrejtjük az "üres" üzenetet
            tabla.innerHTML = ''; // Biztos ami tuti kitöröljük

            // Végigmegyünk egy for ciklussal a rendeléseken
            for (let i = 0; i < valasz.rendelesek.length; i++) {
                const rendel = valasz.rendelesek[i];

                const sor = document.createElement('tr');

                // Dátum formázása szebbre
                const tisztitottDatum = new Date(rendel.datum).toLocaleString('hu-HU');

                let sJelzo = 'bg-success';
                if (rendel.statusz === 'Feldolgozás alatt') {
                    sJelzo = 'bg-warning text-dark';
                }

                sor.innerHTML = `
                    <td>${tisztitottDatum}</td>
                    <td class="fw-bold">${rendel.teljes_osszeg} Ft</td>
                    <td>${rendel.szallitasi_cim}</td>
                    <td>
                        <span class="badge ${sJelzo}">
                            ${rendel.statusz}
                        </span>
                    </td>
                    <td><button class="btn btn-sm btn-info" id="mutatGomb_${rendel.id}">Mutat</button></td>
                `;

                tabla.appendChild(sor); // Hozzáadjuk a sorokat a táblához

                // Készítünk egy rejtett sort a részleteknek rögtön a normál sor alá
                const reszletSor = document.createElement('tr');
                reszletSor.id = 'reszletSor_' + rendel.id;
                reszletSor.style.display = 'none'; // Alapból rejtett
                reszletSor.className = 'table-light';

                reszletSor.innerHTML = `<td colspan="5" id="reszletTartalom_${rendel.id}">Betöltés...</td>`;
                tabla.appendChild(reszletSor);

                // Gomb eseménykezelő az egyszerű amatőr szinttel
                const gomb = document.getElementById('mutatGomb_' + rendel.id);
                gomb.onclick = async function () {
                    const jelenlegiSzoveg = gomb.innerText;

                    if (jelenlegiSzoveg === 'Elrejt') {
                        // Ha épp látszik, akkor rejtse el
                        reszletSor.style.display = 'none';
                        gomb.innerText = 'Mutat';
                    } else {
                        // Ha nem látszik, jelenítse meg
                        reszletSor.style.display = 'table-row';
                        gomb.innerText = 'Betöltés...';

                        try {
                            const response = await getMethodFetch('/api/rendeles_tetelek/' + rendel.id);

                            // Itt jön egy kis for ciklus az elemek kiválogatására
                            let htmlSzoveg = '<strong>Rendelt tételek:</strong><ul>';
                            for (let j = 0; j < response.tetelek.length; j++) {
                                const t = response.tetelek[j];
                                htmlSzoveg += '<li>' + t.termek_nev + ' - ' + t.darab + ' db - ' + t.egyseg_ar + ' Ft/db</li>';
                            }
                            htmlSzoveg += '</ul>';

                            document.getElementById('reszletTartalom_' + rendel.id).innerHTML = htmlSzoveg;
                            gomb.innerText = 'Elrejt';
                        } catch (err) {
                            document.getElementById('reszletTartalom_' + rendel.id).innerHTML = 'Hiba történt a letöltéskor.';
                            gomb.innerText = 'Hiba';
                        }
                    }
                };
            }
        } else {
            // Ha még nincs rendelés
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
