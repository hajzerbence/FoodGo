CREATE DATABASE foodgo
DEFAULT CHARACTER SET utf8
COLLATE utf8_hungarian_ci;

USE foodgo;

CREATE TABLE felhasznalo(
	id int AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    telefonszam VARCHAR(20) NOT NULL,
    jelszo VARCHAR(255) NOT NULL,
    admine BOOLEAN NOT NULL DEFAULT FALSE
)

INSERT INTO felhasznalo (nev, email, telefonszam, jelszo, admine) VALUES
('Admin',
'czegledimate06@gmail.com',
'06203735053',
'Admin1234', 
TRUE);

CREATE TABLE termekek (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(100) NOT NULL,
    leiras TEXT,
    ar INT NOT NULL,
    kep_utvonal VARCHAR(255) NOT NULL,
    etterem_azonosito VARCHAR(50) NOT NULL, -- pl. 'kfc', 'mcdonalds'
    kategoria VARCHAR(50) -- pl. 'kosar', 'burger', 'ital'
);

-- KFC Termékek feltöltése
INSERT INTO termekek (nev, leiras, ar, kep_utvonal, etterem_azonosito, kategoria) VALUES
('15 Strips Kosár', 'Ebédet két főre? 15 darab Strips csípős csirkemell csík két adag kis sültburgonyával.', 6690, '/Média/Termékek/15stripsKosar.png', 'kfc', 'kosar'),
('Qurrito Box', 'Qurrito, 5 Hot Wings csípős csirkeszárny és normál sült burgonya.', 4090, '/Média/Termékek/qurritoBox.png', 'kfc', 'doboz'),
('Classic Egyszemélyes Kosár', '1 db Kentucky csirkerész, 2 db Hot Wings csípős csirkeszárny, 2 db Strips pikáns csirkemell-csík, kis sült burgonya.', 1990, '/Média/Termékek/classicEgyszemelyesKosar.png', 'kfc', 'kosar'),
('Hot Wings Egyszemélyes Kosár', '6 Hot Wings csípős csirkeszárny és egy kis adag aranybarna sült burgonya.', 1990, '/Média/Termékek/hotWingsEgyszemelyesKosar.png', 'kfc', 'kosar'),
('Twister Classic', '2 darab csípős Strips csirkemell csík, lédús paradicsom, jégsaláta és majonéz. Mindezt egy finom tortillában szolgáljuk fel.', 2090, '/Média/Termékek/twisterClassic.png', 'kfc', 'szendvics'),
('Grander Box', 'Grander, 5 darab Hot Wings csípős csirkeszárny és normál sült burgonya.', 6690, '/Média/Termékek/granderBox.png', 'kfc', 'doboz');