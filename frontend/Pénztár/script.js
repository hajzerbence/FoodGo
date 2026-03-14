document.addEventListener('DOMContentLoaded', async () => {
    // 1. Jogosultság ellenőrzése
    let userId = null;
    try {
        const jogosultsagResponse = await fetch('/api/bejelentkezettFelhasznalo');
        if (!jogosultsagResponse.ok) {
            window.location.href = '/';
            return;
        }

        const adatok = await jogosultsagResponse.json();
        if (!adatok || !adatok.userId) {
            window.location.href = '/';
            return;
        }

        userId = adatok.userId;

        const adminGomb = document.getElementById('adminFeluletGomb');
        if (adminGomb) {
            if (adatok.admine === true) {
                adminGomb.style.display = 'block';
            } else {
                adminGomb.style.display = 'none';
            }
        }
    } catch (hiba) {
        console.error('Hiba az ellenőrzésnél:', hiba);
        window.location.href = '/';
        return;
    }

    // Kijelentkezés
    document.getElementById('kijelentkezesGomb').addEventListener('click', async () => {
        try {
            const response = await fetch('/api/kijelentkezes', { method: 'POST' });
            if (response.ok) {
                window.location.href = '/';
            } else {
                alert('Sikertelen kijelentkezés.');
            }
        } catch (error) {
            console.error('Kijelentkezés hiba:', error);
            alert('Hálózati hiba történt a kijelentkezés során.');
        }
    });

    // 2. Kosár betöltése
    const kosarKulcs = `foodgo_kosar_${userId}`;
    const kosarStatusz = localStorage.getItem(kosarKulcs);
    const kosarTetelekLista = document.getElementById('kosarTetelekLista');
    const vegosszegKiiras = document.getElementById('vegosszegKiiras');
    const penztarSzekcio = document.getElementById('penztarSzekcio');
    const uresKosarHiba = document.getElementById('uresKosarHiba');

    if (!kosarStatusz || JSON.parse(kosarStatusz).length === 0) {
        penztarSzekcio.style.display = 'none';
        uresKosarHiba.style.display = 'block';
        return;
    }

    const termekLista = JSON.parse(kosarStatusz);
    let teljesOsszeg = 0;

    for (let i = 0; i < termekLista.length; i++) {
        const termek = termekLista[i];

        const egysegAr = parseInt(termek.ar);
        const darabSzam = parseInt(termek.db);

        teljesOsszeg += egysegAr * darabSzam;

        kosarTetelekLista.innerHTML += `
            <div class="d-flex justify-content-between border-bottom pb-2 pt-2">
                <span>${darabSzam}x ${termek.nev}</span>
                <strong>${egysegAr * darabSzam} Ft</strong>
            </div>
        `;
    }

    vegosszegKiiras.textContent = teljesOsszeg + ' Ft';

    // 3. Rendelés leadása
    const rendelesGomb = document.getElementById('rendelesLeadasGomb');
    if (rendelesGomb) {
        rendelesGomb.addEventListener('click', async function () {
            // Ellenőrizzük, hogy ki lettek-e töltve a kötelező mezők
            const nev = document.getElementById('nev').value;
            const tel = document.getElementById('telefonszam').value;
            const cim = document.getElementById('cim').value;

            if (nev === '' || tel === '' || cim === '') {
                alert('Minden kötelező mezőt ki kell tölteni! (Név, Telefonszám, Cím)');
                return;
            }

            let fizetesiMod = 'Készpénz';
            if (document.getElementById('kártya').checked) {
                fizetesiMod = 'Bankkártya';
            }

            const megjegyzes = `Név: ${nev}, Tel: ${tel} | Fizetés: ${fizetesiMod} | ${document.getElementById('megjegyzes').value}`;

            // Átalakítjuk a kosarat a backend számára (for ciklussal map helyett)
            const atalakitottKosar = [];
            for (let i = 0; i < termekLista.length; i++) {
                atalakitottKosar.push({
                    termekId: parseInt(termekLista[i].id),
                    mennyiseg: parseInt(termekLista[i].db),
                    egysegAr: parseInt(termekLista[i].ar)
                });
            }

            try {
                const response = await fetch('/api/rendeles_leadasa', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        kosarTetelek: atalakitottKosar,
                        szallitasiCim: cim,
                        megjegyzes: megjegyzes,
                        teljesOsszeg: teljesOsszeg
                    })
                });

                if (response.ok) {
                    alert('Sikeres rendelés!');
                    localStorage.removeItem(kosarKulcs);
                    window.location.href = '/profil';
                } else {
                    const data = await response.json();
                    alert(`Hiba a rendelés során: ${data.message || 'Ismeretlen hiba'}`);
                }
            } catch (error) {
                console.error('Hiba a hálózati kérés során:', error);
                alert('Sikertelen rendelés hálózati hiba miatt.');
            }
        });
    }
});
