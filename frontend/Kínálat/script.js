const gombAmerikai = document.getElementById('gombAmerikai');
const gombAzsiai = document.getElementById('gombAzsiai');
const gombTorok = document.getElementById('gombTorok');
const gombOsszes = document.getElementById('gombOsszes');

const amerikaiKartya = document.getElementById('amerikaiKartya');
const azsiaiKartya = document.getElementById('azsiaiKartya');
const torokKartya = document.getElementById('torokKartya');

function mindentMutat() {
    amerikaiKartya.style.display = '';
    azsiaiKartya.style.display = '';
    torokKartya.style.display = '';
}

function csakEztMutat(kartya) {
    amerikaiKartya.style.display = 'none';
    azsiaiKartya.style.display = 'none';
    torokKartya.style.display = 'none';
    kartya.style.display = '';
}

document.addEventListener('DOMContentLoaded', function () {
    mindentMutat();

    gombAmerikai.addEventListener('click', function () {
        csakEztMutat(amerikaiKartya);
    });
    gombAzsiai.addEventListener('click', function () {
        csakEztMutat(azsiaiKartya);
    });
    gombTorok.addEventListener('click', function () {
        csakEztMutat(torokKartya);
    });

    gombOsszes.addEventListener('click', function () {
        mindentMutat();
    });
});
