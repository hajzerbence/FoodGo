//Megfogjuk a szűrő gombjait Id alapján
const gombAmerikai = document.getElementById('gombAmerikai');
const gombAzsiai = document.getElementById('gombAzsiai');
const gombTorok = document.getElementById('gombTorok');
const gombOsszes = document.getElementById('gombOsszes');

// Megfogjuk a kártyákat class alapján
const amerikaiKartya = document.getElementsByClassName('amerikaiKartya');
const azsiaiKartya = document.getElementsByClassName('azsiaiKartya');
const torokKartya = document.getElementsByClassName('torokKartya');

// Ez a függvény megmutat minden kártyát. Leveszi róluk a 'display: none' stílust, ha van rajtuk, így újra láthatóvá teszi őket.
function mindentMutat() {
    for (var i = 0; i < amerikaiKartya.length; i++) {
        amerikaiKartya[i].style.display = '';
    }
    for (var i = 0; i < azsiaiKartya.length; i++) {
        azsiaiKartya[i].style.display = '';
    }
    for (var i = 0; i < torokKartya.length; i++) {
        torokKartya[i].style.display = '';
    }
}

// Ez a függvény csak a megadott kategóriájú kártyákat mutatja meg. Az összes kártyára 'display: none' stílust állít be, majd a megadott kategóriájú kártyákból leveszi ezt a stílust, így csak azok lesznek láthatóak.
function csakEztMutat(kartya) {
    for (var i = 0; i < amerikaiKartya.length; i++) {
        amerikaiKartya[i].style.display = 'none';
    }
    for (var i = 0; i < azsiaiKartya.length; i++) {
        azsiaiKartya[i].style.display = 'none';
    }
    for (var i = 0; i < torokKartya.length; i++) {
        torokKartya[i].style.display = 'none';
    }
    for (var i = 0; i < kartya.length; i++) {
        kartya[i].style.display = '';
    }
}

// Függvények meghívása a megfelelő gombok kattintására
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
