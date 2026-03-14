// Kijelentkezés gomb megragadása
const kijelentkezesGomb = document.getElementById('kijelentkezesGomb');
const adminFeluletGomb = document.getElementById('adminFeluletGomb');
let aktualisFelhasznaloId = null; //globális változó a bejelentkezett felhasználó ID-jának tárolására

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

//?Admin felület

const felhasznalokKirajzolasa = async function () {
    const tabla = document.getElementById('felhasznaloTabla');
    try {
        const valasz = await getMethodFetch('/api/admin');
        console.log('Fetch eredménye: ', valasz);
        const felhasznalok = valasz.felhasznalok;
        tabla.innerHTML = '';

        for (let i = 0; i < felhasznalok.length; i++) {
            const felhasznalo = felhasznalok[i];

            const sor = document.createElement('tr');
            const idTd = document.createElement('td');
            idTd.innerHTML = felhasznalo.id;

            const nevTd = document.createElement('td');
            const nevInput = document.createElement('input');
            nevInput.className = 'form-control form-control-sm';
            nevInput.value = felhasznalo.nev;
            nevTd.appendChild(nevInput);

            const emailTd = document.createElement('td');
            const emailInput = document.createElement('input');
            emailInput.className = 'form-control form-control-sm';
            emailInput.value = felhasznalo.email;
            emailTd.appendChild(emailInput);

            const telefonTd = document.createElement('td');
            const telefonInput = document.createElement('input');
            telefonInput.className = 'form-control form-control-sm';
            telefonInput.value = felhasznalo.telefonszam;
            telefonTd.appendChild(telefonInput);

            const adminTd = document.createElement('td');
            adminTd.innerHTML = felhasznalo.admine ? 'Igen' : 'Nem'; //ez a sor dinamikusan állítja be a "Admin" oszlop értékét a felhasználó admin státuszától függően. Ha a felhasználó admin (felhasznalo.admine értéke true), akkor az oszlopban "Igen" jelenik meg, jelezve, hogy a felhasználó admin jogokkal rendelkezik. Ha a felhasználó nem admin (felhasznalo.admine értéke false), akkor az oszlopban "Nem" jelenik meg, jelezve, hogy a felhasználó nem rendelkezik admin jogokkal.

            const muveletTd = document.createElement('td');
            const gombDiv = document.createElement('div');
            gombDiv.className = 'muveletGombok';

            const mentesGomb = document.createElement('button');
            mentesGomb.type = 'button';
            mentesGomb.className = 'btn btn-sm btn-success';
            mentesGomb.innerHTML = 'Mentés';

            mentesGomb.addEventListener('click', async function () {
                try {
                    await PostMethodFetch('/api/admin', {
                        muvelet: 'felhasznaloModositas',
                        id: felhasznalo.id,
                        nev: nevInput.value,
                        email: emailInput.value,
                        telefonszam: telefonInput.value
                    });
                    await felhasznalokKirajzolasa();
                } catch (error) {
                    alert(error.message);
                }
            });

            gombDiv.appendChild(mentesGomb);

            const sajatFiok = String(felhasznalo.id) === String(aktualisFelhasznaloId); //ez a sor ellenőrzi, hogy a jelenlegi sorban lévő felhasználó megegyezik-e a bejelentkezett felhasználóval, és ennek megfelelően true vagy false értéket ad vissza. Ez azért fontos, mert a saját fiók esetében nem szeretnénk megjeleníteni az admin jogok módosítására és a törlésre szolgáló gombokat, hogy elkerüljük a véletlen önmagunk admin jogának elvételét vagy a saját fiók törlését.

            if (sajatFiok !== true) {
                const adminGomb = document.createElement('button');
                adminGomb.type = 'button';
                adminGomb.className = 'btn btn-sm btn-primary';
                adminGomb.innerHTML = felhasznalo.admine ? 'Admin elvétel' : 'Admin adás'; //ez a sor dinamikusan állítja be a gomb szövegét a felhasználó admin státuszától függően. Ha a felhasználó jelenleg admin (felhasznalo.admine értéke true), akkor a gomb szövege "Admin elvétel" lesz, jelezve, hogy a gomb megnyomásával el lehet venni az admin jogot. Ha a felhasználó nem admin (felhasznalo.admine értéke false), akkor a gomb szövege "Admin adás" lesz, jelezve, hogy a gomb megnyomásával admin jogot lehet adni a felhasználónak.

                adminGomb.addEventListener('click', async function () {
                    try {
                        await PostMethodFetch('/api/admin', {
                            muvelet: 'felhasznaloAdminAllitas',
                            id: felhasznalo.id,
                            admine: !felhasznalo.admine
                        });
                        await felhasznalokKirajzolasa();
                    } catch (error) {
                        alert(error.message);
                    }
                });

                const torlesGomb = document.createElement('button');
                torlesGomb.type = 'button';
                torlesGomb.className = 'btn btn-sm btn-danger';
                torlesGomb.innerHTML = 'Törlés';

                torlesGomb.addEventListener('click', async function () {
                    try {
                        await PostMethodFetch('/api/admin', {
                            muvelet: 'felhasznaloTorles',
                            id: felhasznalo.id
                        });
                        await felhasznalokKirajzolasa();
                    } catch (error) {
                        alert(error.message);
                    }
                });
                gombDiv.appendChild(adminGomb);
                gombDiv.appendChild(torlesGomb);
            }

            muveletTd.appendChild(gombDiv);

            sor.appendChild(idTd);
            sor.appendChild(nevTd);
            sor.appendChild(emailTd);
            sor.appendChild(telefonTd);
            sor.appendChild(adminTd);
            sor.appendChild(muveletTd);
            tabla.appendChild(sor);
        }

        const rendelesTabla = document.getElementById('rendelesTabla');
        rendelesTabla.innerHTML = ''; // Előző adatokat töröljük, mielőtt újat rajzolunk
        const rendelesek = valasz.rendelesek;

        if (rendelesek && rendelesek.length > 0) {
            for (let i = 0; i < rendelesek.length; i++) {
                const rendel = rendelesek[i];

                const tr = document.createElement('tr');
                const tDatum = new Date(rendel.datum).toLocaleString('hu-HU');

                // Még a megjegyzést is belerakjuk a cím alá
                let cimExtra = rendel.szallitasi_cim;
                if (rendel.megjegyzes && rendel.megjegyzes !== '') {
                    // Egyszerű szétszedés a '|' mentén, ahogy a pénztár elküldi
                    const reszek = rendel.megjegyzes.split(' | ');

                    if (reszek.length >= 2) {
                        // Név + Telefon és a Fizetésmód, ez tiszta adat:
                        cimExtra += `<br><small class="text-muted">${reszek[0]}<br>${reszek[1]}</small>`;

                        // Ha írt igazi megjegyzést is, az a 3. elemben van
                        if (reszek[2] && reszek[2].trim() !== '') {
                            cimExtra += `<br><br><small class="text-danger">A vásárló megjegyzése: ${reszek[2]}</small>`;
                        }
                    } else {
                        // Ha valamiért mégis régi fajta vagy sima szöveg lenne
                        cimExtra += `<br><small class="text-danger">A vásárló megjegyzése: ${rendel.megjegyzes}</small>`;
                    }
                }

                // Gombok a státusz módosításhoz (attól függően, hogy áll a rendelés)
                let gombokHTML = '';
                if (rendel.statusz !== 'Kiszállítva' && rendel.statusz !== 'Törölve') {
                    gombokHTML = `
                        <button class="btn btn-sm btn-success me-1 szallitvaGomb" data-id="${rendel.id}">✓ Kiszállítva</button>
                        <button class="btn btn-sm btn-danger torolveGomb" data-id="${rendel.id}">X Törlés</button>
                    `;
                }

                tr.innerHTML = `
                    <td>#${rendel.id}</td>
                    <td>${tDatum}</td>
                    <td class="fw-bold">${rendel.megrendelo_neve}</td>
                    <td>${cimExtra}</td>
                    <td>${rendel.teljes_osszeg} Ft</td>
                    <td><span class="badge ${rendel.statusz === 'Feldolgozás alatt' ? 'bg-warning text-dark' : 'bg-success'}">${rendel.statusz}</span></td>
                    <td>${gombokHTML}</td>
                    <td><button class="btn btn-sm btn-info" id="adminMutatGomb_${rendel.id}">Mutat</button></td>
                `;

                rendelesTabla.appendChild(tr);

                // Készítünk egy rejtett sort a részleteknek rögtön a normál sor alá
                const reszletSor = document.createElement('tr');
                reszletSor.id = 'adminReszletSor_' + rendel.id;
                reszletSor.style.display = 'none'; // Alapból rejtett
                reszletSor.className = 'table-light';

                // 8 oszlop van összesen
                reszletSor.innerHTML = `<td colspan="8" id="adminReszletTartalom_${rendel.id}">Betöltés...</td>`;
                rendelesTabla.appendChild(reszletSor);

                // Gomb eseménykezelő az egyszerű amatőr szinttel
                const mutatGomb = document.getElementById('adminMutatGomb_' + rendel.id);
                mutatGomb.onclick = async function () {
                    const jelenlegiSzoveg = mutatGomb.innerText;

                    if (jelenlegiSzoveg === 'Elrejt') {
                        // Ha épp látszik, akkor rejtse el
                        reszletSor.style.display = 'none';
                        mutatGomb.innerText = 'Mutat';
                    } else {
                        // Ha nem látszik, jelenítse meg
                        reszletSor.style.display = 'table-row';
                        mutatGomb.innerText = 'Betöltés...';

                        try {
                            const response = await getMethodFetch('/api/rendeles_tetelek/' + rendel.id);

                            // Itt jön egy kis for ciklus az elemek kiválogatására
                            let htmlSzoveg = '<strong>Rendelt tételek:</strong><ul>';
                            for (let j = 0; j < response.tetelek.length; j++) {
                                const t = response.tetelek[j];
                                htmlSzoveg += '<li>' + t.termek_nev + ' - ' + t.darab + ' db - ' + t.egyseg_ar + ' Ft/db</li>';
                            }
                            htmlSzoveg += '</ul>';

                            document.getElementById('adminReszletTartalom_' + rendel.id).innerHTML = htmlSzoveg;
                            mutatGomb.innerText = 'Elrejt';
                        } catch (err) {
                            document.getElementById('adminReszletTartalom_' + rendel.id).innerHTML = 'Hiba történt a letöltéskor.';
                            mutatGomb.innerText = 'Hiba';
                        }
                    }
                };
            }

            // Az összes 'Kiszállítva' és 'Törlés' gombnak eseményfigyelőt adunk
            const szallitvaGombok = document.getElementsByClassName('szallitvaGomb');
            const torolveGombok = document.getElementsByClassName('torolveGomb');

            for (let i = 0; i < szallitvaGombok.length; i++) {
                szallitvaGombok[i].onclick = function () {
                    const id = this.getAttribute('data-id');
                    statuszModositasa(id, 'Kiszállítva');
                };
            }

            for (let i = 0; i < torolveGombok.length; i++) {
                torolveGombok[i].onclick = function () {
                    const id = this.getAttribute('data-id');
                    statuszModositasa(id, 'Törölve');
                };
            }
        } else {
            rendelesTabla.innerHTML = '<tr><td colspan="8" class="text-center">Nincs még egy rendelés sem a rendszerben.</td></tr>';
        }
    } catch (error) {
        console.error('Hiba történt: ', error);
        alert('Nem sikerült betölteni az adatokat.');
    }
};

// Segéd függvény ami az API felé kommunikál a státusz cseréről
async function statuszModositasa(rendelesId, ujStatusz) {
    if (!confirm(`Biztosan átállítod a #${rendelesId} rendelést '${ujStatusz}' státuszra?`)) return;

    try {
        await PostMethodFetch('/api/admin', {
            muvelet: 'rendelesStatuszValtas',
            id: rendelesId,
            ujStatusz: ujStatusz
        });

        // Frissítjük újra az oldalt (felhasználók + rendelések újra kigenerálódnak)
        await felhasznalokKirajzolasa();
    } catch (error) {
        alert(error.message);
    }
}

const adminOldalInditasa = async function () {
    try {
        const data = await getMethodFetch('/api/bejelentkezettFelhasznalo');
        console.log('Fetch eredménye: ', data);
        if (!data) {
            window.location.href = '/';
            return;
        }

        if (!data.userId) {
            window.location.href = '/';
            return;
        }

        if (data.admine !== true) {
            window.location.href = '/fooldal';
            return;
        }

        aktualisFelhasznaloId = data.userId; //ez a sor elmenti a bejelentkezett felhasználó ID-ját egy globális változóba, hogy később a felhasznalokKirajzolasa függvényben össze tudja hasonlítani a listázott felhasználók ID-ját a bejelentkezett felhasználó ID-jával, és ennek alapján megjelenítse vagy elrejtse az admin jogok módosítására és a törlésre szolgáló gombokat.

        felhasznalokKirajzolasa();
    } catch (error) {
        console.error('Hiba történt: ', error);
        window.location.href = '/';
    }
};

// Függvények meghívása a megfelelő gombok kattintására
document.addEventListener('DOMContentLoaded', function () {
    adminFeluletGombFrissitese();

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

    adminOldalInditasa();
});
