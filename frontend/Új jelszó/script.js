const postMethodFetch = async function (url, adat) {
    try {
        const valasz = await fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(adat)
        });

        const kapottAdat = await valasz.json();

        if (!valasz.ok) {
            throw new Error(kapottAdat.message);
        }

        return kapottAdat;
    } catch (error) {
        throw new Error(error.message);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const jelszoMentesGomb = document.getElementById('jelszoMentesGomb');
    const ujJelszoInput = document.getElementById('ujJelszo');

    const urlParameterek = new URLSearchParams(window.location.search);
    const token = urlParameterek.get('token');

    jelszoMentesGomb.addEventListener('click', async function () {
        const ujJelszo = ujJelszoInput.value;

        if (!token) {
            alert('Hiányzik vagy hibás a jelszó-visszaállító token.');
            return;
        }

        if (!ujJelszo) {
            alert('Kérlek, add meg az új jelszót!');
            return;
        }

        try {
            const valasz = await postMethodFetch('/api/ujJelszoElfelejtve', {
                token: token,
                ujJelszo: ujJelszo
            });

            alert(valasz.message);

            if (valasz.success) {
                window.location.href = '/';
            }
        } catch (error) {
            alert(error.message);
        }
    });
});
