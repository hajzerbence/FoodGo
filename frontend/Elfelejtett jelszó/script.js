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
    const linkKuldesGomb = document.getElementById('linkKuldesGomb');
    const emailInput = document.getElementById('email');

    linkKuldesGomb.addEventListener('click', async function () {
        const email = emailInput.value;

        if (!email) {
            alert('Kérlek, add meg az email címedet!');
            return;
        }

        try {
            const valasz = await postMethodFetch('/api/elfelejtettJelszo', {
                email: email
            });

            alert(valasz.message);
        } catch (error) {
            alert(error.message);
        }
    });
});
