CREATE DATABASE foodgo
DEFAULT CHARACTER SET utf8
DEFAULT COLLATE utf8_hungarian_ci;

USE foodgo;

CREATE TABLE felhasznalo(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    telefonszam VARCHAR(20) NOT NULL,
    jelszo VARCHAR(255) NOT NULL,
    admine BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO felhasznalo (nev, email, telefonszam, jelszo, admine) VALUES
('Admin',
'czegledimate06@gmail.com',
'06203735053',
'$2b$10$JiTIQWDKi/BpFzAeAQbP9uWBGMYsaMGhdmJ/Qb5bf/bfHprYIsbPa', /* A titkosított 'Admin1234' */
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

-- McDonald's Termékek feltöltése
INSERT INTO termekek (nev, leiras, ar, kep_utvonal, etterem_azonosito, kategoria) VALUES
('Big Mac menü', 'Két marhahúspogácsa, különleges szósz, sajt, saláta, hagyma és uborka szezámmagos zsemlében, közepes burgonyával és itallal.', 2690, '/Média/Termékek/bigMacMenu.png', 'mcdonalds', 'menu'),
('McChicken menü', 'Ropogós csirkemell filé, friss saláta és majonéz szezámmagos zsemlében, közepes burgonyával és itallal.', 2590, '/Média/Termékek/mcChickenMenu.png', 'mcdonalds', 'menu'),
('Sajtburger', 'Szaftos marhahús, egy szelet sajt, hagyma, uborka, ketchup és mustár egy puha zsemlében.', 850, '/Média/Termékek/sajtburger.png', 'mcdonalds', 'szendvics'),
('9 db Chicken McNuggets', 'Kilenc darab aranybarna, ropogós csirkefalatka választható szósszal.', 1890, '/Média/Termékek/mcnuggets9.png', 'mcdonalds', 'csirke'),
('Dupla Sajtburger menü', 'Két szaftos marhahúspogácsa, két szelet sajt, hagyma, uborka, ketchup és mustár, közepes burgonyával és itallal.', 2890, '/Média/Termékek/duplaSajtburgerMenu.png', 'mcdonalds', 'menu'),
('Oreo McFlurry', 'Krémes vaníliaízű fagylalt ropogós Oreo kekszdarabokkal összekeverve.', 1190, '/Média/Termékek/oreoMcFlurry.png', 'mcdonalds', 'desszert');

-- Buddha Original Termékek feltöltése
INSERT INTO termekek (nev, leiras, ar, kep_utvonal, etterem_azonosito, kategoria) VALUES
('Pad Thai Csirke', 'Klasszikus thai pirított rizstészta csirkemellel, tojással, földimogyoróval, babcsírával és friss lime-mal.', 3290, '/Média/Termékek/padThaiCsirke.png', 'buddhaoriginal', 'teszta'),
('Tom Yum Leves', 'Autentikus csípős-savanyú thai leves rákokkal, gombával, citromfűvel és korianderrel.', 2490, '/Média/Termékek/tomYumLeves.png', 'buddhaoriginal', 'leves'),
('Szecsuáni Marha', 'Csípős szecsuáni szószban pirított marhahúscsíkok roppanós zöldségekkel, jázminrizzsel.', 3890, '/Média/Termékek/szecsuaniMarha.png', 'buddhaoriginal', 'foetel'),
('Tavaszi Tekercs (3 db)', 'Ropogósra sült zöldséges tavaszi tekercsek édes-savanyú mártogatóssal.', 1490, '/Média/Termékek/tavasziTekercs.png', 'buddhaoriginal', 'elotel'),
('Zöldséges Pirított Tészta', 'Wok-ban pirított búzateszta friss, roppanós ázsiai zöldségekkel és szójaszósszal.', 2690, '/Média/Termékek/zoldsegesTeszta.png', 'buddhaoriginal', 'teszta'),
('Sushi Válogatás (12 db)', 'Válogatott maki és nigiri falatok lazaccal, tonhallal és zöldségekkel, szójaszósszal, wasabival és gyömbérrel.', 4590, '/Média/Termékek/sushiValogatas.png', 'buddhaoriginal', 'sushi');


-- Ibrahim Török Büfé Termékek feltöltése
INSERT INTO termekek (nev, leiras, ar, kep_utvonal, etterem_azonosito, kategoria) VALUES
('Döner Box-nagy', 'Készültünk kicsit nagyobb mérettel is azoknak akik nagyobb étvággyal rendelkeznek, de mégse ennének olyan sokat.', 2000, '/Média/Termékek/donerBoxNagy.png', 'ibrahimtorokbufe', 'gyros'),
('Döner Box-kicsi', 'Éhes vagy de csak egy kicsit? Akkor válaszd a kis méretű döner boxunkat.', 1500, '/Média/Termékek/donerBoxKicsi.png', 'ibrahimtorokbufe', 'gyros'),
('Döner pita', 'Klasszikus pita dönerhússal', 2000, '/Média/Termékek/donerPita.png', 'ibrahimtorokbufe', 'gyros'),
('Extra húsos döner pita', 'Pita dupla adag dönerhússal', 2900, '/Média/Termékek/extraHusosDonerPita.png', 'ibrahimtorokbufe', 'gyros'),
('Csak húsos döner pita', 'Pita nélkül, csak dönerhús', 2600, '/Média/Termékek/csakHusosDonerPita.png', 'ibrahimtorokbufe', 'gyros'),
('Dürüm', 'Töltött tortilla dönerhússal', 2200, '/Média/Termékek/durum.png', 'ibrahimtorokbufe', 'durum');

-- Wok'n Go Török Büfé Termékek feltöltése
INSERT INTO termekek (nev, leiras, ar, kep_utvonal, etterem_azonosito, kategoria) VALUES
('Pirított rizstészta', 'Kényeztesd ízlelőbimbóidat a pirított rizstésztánkkal! Hagyd, hogy ízlelőbimbóid megtapasztalják a zamatos ízeket!', 1600, '/Média/Termékek/piritottRizsteszta.png', 'wokngo', 'teszta'),
('Szezámmagos csirke', 'Édes, picit csípős', 2600, '/Média/Termékek/szezammagosCsirke.png', 'wokngo', 'csirke'),
('Pirított Zöldségtészta', 'Kényeztesd ízlelőbimbóidat a pirított rizstésztánkkal! Hagyd, hogy ízlelőbimbóid megtapasztalják a zamatos ízeket!', 1600, '/Média/Termékek/piritottZoldsegteszta.png', 'wokngo', 'teszta'),
('Csipős leves', 'Csípős, erős szószú leves', 1000, '/Média/Termékek/csiposLeves.png', 'wokngo', 'leves'),
('Hagymás csirke', 'Nincs is jobb a hagymás csirkénél, amikor megéhezel.', 2600, '/Média/Termékek/hagymasCsirke.png', 'wokngo', 'csirke'),
('Amerikai csirke', 'Csípős amerikai wok csirke', 2900, '/Média/Termékek/amerikaiCsirke.png', 'wokngo', 'csirke');

-- Star kebab Török Büfé Termékek feltöltése
INSERT INTO termekek (nev, leiras, ar, kep_utvonal, etterem_azonosito, kategoria) VALUES
('Gyros tál csirkehússal', 'csirke gyros hús, zöld salátával, paradicsommal, helyben készült török pita', 5250, '/Média/Termékek/gyrosTalCsirkehussal.png', 'starkebab', 'gyros'),
('Gyros tál borjúhússal', 'borjú gyros hús, zöld salátával, paradicsommal, helyben készült török pita', 5850, '/Média/Termékek/gyrosTalBorjuhussal.png', 'starkebab', 'gyros'),
('Gyros szendvics borjúhússal', 'borjú gyros hús, friss paradicsommal, salátával, joghurtos öntettel, választható csípős öntet, lavasba', 3225, '/Média/Termékek/gyrosSzendvicsBorjuhussal.png', 'starkebab', 'gyros'),
('Gyros szendvics csirkehússal', 'csirke gyros hús, friss paradicsommal, salátával, joghurtos öntettel, választható csípős öntet, lavasba', 3225, '/Média/Termékek/gyrosSzendvicsCsirkehussal.png', 'starkebab', 'gyros'),
('Lencseleves pitával', 'Lencse leves pitával', 2026, '/Média/Termékek/lencselevesPitaval.png', 'starkebab', 'leves'),
('Gyros tál vegyes hússal', 'csirke és borjú gyros hús, zöld salátával, paradicsommal, helyben készült török pita', 5850, '/Média/Termékek/gyrosTalVegyesHussal.png', 'starkebab', 'gyros');

-- Sofra étterem Termékek feltöltése
INSERT INTO termekek (nev, leiras, ar, kep_utvonal, etterem_azonosito, kategoria) VALUES
('Gyros tál', 'Fűszeres hús, pita, friss zöldségek és ízletes szószok tálban tálalva, És krumpli, rizs, bulgur vagy joghurtos tészta választható köretként.”', 3200, '/Média/Termékek/gyrosTal.png', 'sofraetterem', 'gyros'),
('Gyros tortillában', 'saláták = hagyma, paradicsom, saláta, vörös káposzta, csípős szósz, joghurtos szósz', 2480, '/Média/Termékek/gyrosTortillaban.png', 'sofraetterem', 'gyros'),
('Gyros házi pita', 'Fűszeres hús, friss zöldségek, pita kenyérben, ízletes szószokkal tálalva.', 2480, '/Média/Termékek/gyrosHaziPita.png', 'sofraetterem', 'gyros'),
('Pisztácia baklava', 'Ropogós leveles tészta rétegei, gazdag pisztáciás töltelékkel, melyet édes sziruppal öntöttünk le. A pisztácia jellegzetes íze és a tészta finom roppanó textúrája tökéletes harmóniát alkot, így egy igazán különleges desszert élményt nyújt.', 1440, '/Média/Termékek/pisztaciaBaklava.png', 'sofraetterem', 'desszert'),
('Csoki kakaó marlenka', 'Édes, réteges sütemény, csokoládéval és kakaóval, gazdag ízekkel és krémes állaggal.', 1440, '/Média/Termékek/csokiKakaoMarlenka.png', 'sofraetterem', 'desszert'),
('Marlenka dióval', 'Diós sütemény, mézes rétegekkel, krémes töltelékkel, édes és ízletes élvezet minden falatban.', 1440, '/Média/Termékek/marlenkaDioval.png', 'sofraetterem', 'desszert');

-- Kínai Nagyfal Büfé Termékek feltöltése
INSERT INTO termekek (nev, leiras, ar, kep_utvonal, etterem_azonosito, kategoria) VALUES
('Egyszemélyes tál', 'Tökéletes egy fő számára!', 2990, '/Média/Termékek/egyszemelyesTal.png', 'kinainagyfalbufe', 'foetel'),
('Pirított tészta', 'Kényeztesd ízlelőbimbóidat a pirított tésztánkkal! Hagyd, hogy ízlelőbimbóid megtapasztalják a zamatos ízeket!', 1290, '/Média/Termékek/piritottTeszta.png', 'kinainagyfalbufe', 'teszta'),
('Csípős-savanyú leves', 'Csípős-savanyú leves', 1200, '/Média/Termékek/csiposSavanyuLeves.png', 'kinainagyfalbufe', 'leves'),
('Gung Bao csirke', 'csirke, burgonya, bambusz, sárgarépa, uborka, mogyoró, chili', 2690, '/Média/Termékek/gungBaoCsirke.png', 'kinainagyfalbufe', 'csirke'),
('Mini Tavaszi tekercs (6db)', 'Tavaszi tekercs', 1000, '/Média/Termékek/miniTavasziTekercs.png', 'kinainagyfalbufe', 'tavaszitekercs'),
('Tojásos rizs', 'Puha, szaftos és ízletes. Próbáld ki te is ezt a könnyű köretet!', 1290, '/Média/Termékek/tojasosRizs.png', 'kinainagyfalbufe', 'rizs');

CREATE TABLE kategoriak (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO kategoriak (nev) VALUES
('amerikai'),
('ázsiai'),
('török');

-- Éttermek tábla
CREATE TABLE ettermek (
    id INT AUTO_INCREMENT PRIMARY KEY,
    azonosito VARCHAR(50) NOT NULL UNIQUE,
    nev VARCHAR(100) NOT NULL,
    leiras TEXT,
    kategoria_id INT NOT NULL,
    logo_utvonal VARCHAR(255) NOT NULL,
    boritokep_utvonal VARCHAR(255) NOT NULL,
    FOREIGN KEY (kategoria_id) REFERENCES kategoriak(id)
);

-- Éttermek feltöltése
INSERT INTO ettermek (azonosito, nev, leiras, kategoria_id, logo_utvonal, boritokep_utvonal) VALUES
('kfc', 'KFC', 'Ropogós, fűszeres csirke minden mennyiségben, mellé krémes szószok és bőséges köretek. Kedvencek: csirkeszárnyak, csirkecsíkok, sült krumpli és sajtos falatok.', 1, '/Média/Étterem logók/KFClogo.png', '/Média/Amerikai/kfc.png'),
('mcdonalds', 'McDonald''s', 'Gyors, ismerős ízek nagy választékkal, mindig hozza a klasszikus mekis hangulatot. Kedvencek: Big Mac jellegű burgerek, nuggets, sült krumpli és shake, desszertnek pedig fagyi.', 1, '/Média/Étterem logók/McDonaldsLogo.png', '/Média/Amerikai/mcdonalds.png'),
('simonsburger', 'Simon''s Burger', 'Laktató, karakteres burgerélmény szaftos húspogácsával és rengeteg feltéttel, igazi comfort food. Kedvencek: signature burgerek, cheddarban úszó opciók, ropogós sült krumpli és házi szószok.', 1, '/Média/Étterem logók/simonsburger.png', '/Média/Amerikai/simonsburger.png'),
('buddhaoriginal', 'Buddha Original', 'Friss, illatos fogások sok zöldséggel, aromás fűszerekkel és könnyed, mégis tartalmas ízekkel. Kedvencek: wok tálak, pho vagy ramen jellegű levesek, rizses ételek és csípős szószos variációk.', 2, '/Média/Étterem logók/BuddhaOriginal.png', '/Média/Ázsiai/buddhaOriginal.png'),
('wokngo', 'Wok''n Go', 'Pörgős, frissen dobott wok ételek, ahol te állítod össze a kedvenc kombinációdat. Kedvencek: pirított tészták, csirkés vagy zöldséges wok tálak, teriyaki jellegű szószok és csípős ráadások.', 2, '/Média/Étterem logók/wokngo.png', '/Média/Ázsiai/wok''nGo.png'),
('kinainagyfalbufe', 'Kínai Nagyfal Büfé', 'Klasszikus kínai büfés kedvencek bőséges adagokkal, gyorsan tálalva és erős, sós édes fűszerezéssel. Kedvencek: édes savanyú csirke, pirított tészta, sült rizs és ropogós tavaszi tekercs.', 2, '/Média/Étterem logók/KinaiNagyfalBufe.png', '/Média/Ázsiai/kinaiNagyFalBufe.png'),
('ibrahimtorokbufe', 'Ibrahim Török Büfé', 'Szaftos, fűszeres húsok és friss zöldségek, a gyors török büfé hangulata igazi laktató választásokkal. Kedvencek: kebab tál, dürüm, pitában kért húsok és fokhagymás csípős szószok.', 3, '/Média/Étterem logók/ibrahimTorokBufe.png', '/Média/Török/ibrahimtorokbufe.png'),
('starkebab', 'Star Kebab', 'Klasszikus kebabos ízek nagy adagban, gyorsan és tele friss salátával. Kedvencek: dürüm, kebab tál, ropogós sült krumpli és extra szószos, csípős változatok.', 3, '/Média/Étterem logók/starkebab.png', '/Média/Török/starkebab.png'),
('sofraetterem', 'Sofra Étterem', 'Gazdag török konyha grillezett fogásokkal, illatos fűszerekkel és többféle friss körettel. Kedvencek: adana jellegű grill, kebabok, pide és desszertnek baklava, mellé ayran vagy tea.', 3, '/Média/Étterem logók/sofraetterem.png', '/Média/Török/sofraetterem.png');

-- Simon's Burger Termékek feltöltése
INSERT INTO termekek (nev, leiras, ar, kep_utvonal, etterem_azonosito, kategoria) VALUES
('Cheeseburger', 'Sosem fagyasztott, 100% természetes dupla smashed marhahúspogácsából készítjük. Az Oklahoma stílusban sütött húsunkat mindig friss hagymával készítjük dupla sajttal. A Simon’s szószunk 17 különleges összetevőt tartalmaz. Az alap burger Simon’s szószt, paradicsomot, hagymát, uborkát és salátát tartalmaz.', 3690, '/Média/Termékek/cheeseburger.png', 'simonsburger', 'hamburger'),
('Simons special burger', 'Simon kedvenc hamburgere: friss, fagyasztásmentes 100% természetes dupla smashed marhahúspogácsából, áfonya lekvárral, cheddar sajttal és a titkos szósszal. A titkos szószunk 17 összetevőt tartalmaz.', 3390, '/Média/Termékek/simonsSpecialBurger.png', 'simonsburger', 'hamburger'),
('Small Cheeseburger', 'Sosem fagyasztott, 100% természetes smashed marhahúspogácsából készítjük sajttal. Az Oklahoma stílusban sütött húsunkat mindig friss hagymával készítjük. A Simon’s szószunk 17 különleges összetevőt tartalmaz. Az alap burger Simon’s szószt, paradicsomot, hagymát, uborkát és salátát tartalmaz.', 2900, '/Média/Termékek/smallCheeseburger.png', 'simonsburger', 'hamburger'),
('Normál sült burgonya', 'A sült krumplival sosem lehet melléfogni!', 890, '/Média/Termékek/normalSultburgonya.png', 'simonsburger', 'burgonya'),
('Simons cheese fries', 'sült krumpli, Simons secret szósz, sajtszósz, karamellizált hagyma', 1550, '/Média/Termékek/simonsCheeseFries.png', 'simonsburger', 'burgonya'),
('Hamburger', 'Sosem fagyasztott, 100% természetes dupla smashed marhahúspogácsából készítjük. Az Oklahoma stílusban sütött húsunkat mindig friss hagymával készítjük. A Simon’s szószunk 17 különleges összetevőt tartalmaz. Az alap burger Simon’s szószt, paradicsomot, hagymát, uborkát és salátát tartalmaz.', 3490, '/Média/Termékek/hamburger.png', 'simonsburger', 'hamburger');


CREATE TABLE rendelesek (
    id INT AUTO_INCREMENT PRIMARY KEY,
    felhasznalo_id INT NOT NULL,
    datum DATETIME DEFAULT CURRENT_TIMESTAMP, 
    teljes_osszeg INT NOT NULL, 
    statusz VARCHAR(50) DEFAULT 'Feldolgozás alatt', 
    szallitasi_cim VARCHAR(255) NOT NULL, 
    megjegyzes TEXT 
);

CREATE TABLE rendeles_tetelek (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rendeles_id INT NOT NULL,
    termek_id INT NOT NULL,
    mennyiseg INT NOT NULL, 
    egyseg_ar INT NOT NULL 
);