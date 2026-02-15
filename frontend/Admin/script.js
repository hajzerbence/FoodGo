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
    } catch (error) {
        console.error('Hiba történt: ', error);
        alert('Nem sikerült betölteni a felhasználókat.');
    }
};

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
