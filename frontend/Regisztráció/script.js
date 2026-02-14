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

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('regisztracioGomb').addEventListener('click', async () => {
        let nev = document.getElementById('nev').value;
        let email = document.getElementById('email').value;
        let telefonszam = document.getElementById('telefonszam').value;
        let jelszo = document.getElementById('jelszo').value;
        let jelszomegerosites = document.getElementById('jelszomegerosites').value;
        let feltetelek = document.getElementById('feltetelek');
        //egyszerű email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //magyar formátum telefon regex (06 vagy +36-tal kezdődik, majd 2 számjegy szolgáltató kód, végül 7 számjegy, összesen max 15 karakter)
        const telefonRegex = /^(?:\+36|06)\d{2}\d{7}$/;
        //jelszó regex: minimum 8 karakter, legalább egy nagybetű, egy kisbetű, egy szám és egy speciális karakter
        //const jelszoRegex =

        if (nev && email && telefonszam && jelszo && jelszomegerosites) {
            if (emailRegex.test(email)) {
                if (telefonRegex.test(telefonszam)) {
                    // if (jelszoRegex.test(jelszo)) {
                    if (jelszo === jelszomegerosites) {
                        if (feltetelek.checked === true) {
                            try {
                                const adatok = await PostMethodFetch('/api/ujFelhasznalo', {
                                    nev: nev,
                                    email: email,
                                    telefonszam: telefonszam,
                                    jelszo: jelszo
                                });
                                alert('Sikeres regisztráció! Köszönjük, hogy csatlakoztál a FoodGo-hoz.');
                                window.location.href = '/';
                            } catch (error) {
                                alert('Ez a email cím már használatban van. Kérem, válasszon másikat vagy jelentkezzen be!');
                            }
                        } else {
                            alert('Kérem, fogadja el az Általános Szerződési Feltételeket!');
                        }
                    } else {
                        alert('A jelszavak nem egyeznek meg!');
                    }
                    // } else {
                    //     alert('A jelszónak minimum 8 karakter hosszúnak kell lennie, tartalmaznia kell legalább egy nagybetűt, egy kisbetűt, egy számot és egy speciális karaktert!');
                    // }
                } else {
                    alert('Kérem, érvényes telefonszámot adjon meg!');
                }
            } else {
                alert('Kérem, érvényes email címet adjon meg!');
            }
        } else {
            alert('Kérem, töltse ki az összes mezőt!');
        }
    });
});
