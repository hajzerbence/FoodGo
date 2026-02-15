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
    document.getElementById('bejelentkezesGomb').addEventListener('click', async () => {
        let email = document.getElementById('email').value;
        let jelszo = document.getElementById('jelszo').value;

        if (email && jelszo) {
            try {
                const adatok = await PostMethodFetch('/api/bejelentkezes', {
                    email: email,
                    jelszo: jelszo
                });
                if (adatok && adatok.success === true) {
                    window.location.href = '/fooldal';
                }
            } catch (error) {
                alert('Hibás email vagy jelszó.');
            }
        } else {
            alert('Kérem, töltse ki az összes mezőt!');
        }
    });
});
