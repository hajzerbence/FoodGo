
# Hozzájárulás a FoodGo projekthez

Köszönjük, hogy fontolóra vetted a **FoodGo** projekthez való hozzájárulást! 🎉  
Szívesen fogadunk mindenféle hozzájárulást, például hibajavításokat, új funkciókat, dokumentáció fejlesztést vagy javaslatokat.

## Tartalomjegyzék

- Magatartási kódex
- Első lépések
- Fejlesztési folyamat
- Commit irányelvek
- Pull Request folyamat
- Hibák jelentése
- Kódolási irányelvek

---

## Magatartási kódex

Kérjük, hogy a többi közreműködővel való kommunikáció során legyél tiszteletteljes és konstruktív.  
Célunk egy barátságos, befogadó és támogató közösség fenntartása.

---

## Első lépések

1. Forkold a repository-t
2. Klónozd a saját forkodat lokálisan

```bash
git clone https://github.com/YOUR_USERNAME/FoodGo.git
````

3. Lépj be a projekt mappájába

```bash
cd FoodGo
```

4. Add hozzá az eredeti repository-t upstreamként

```bash
git remote add upstream https://github.com/hajzerbence/FoodGo.git
```

---

## Fejlesztési folyamat

1. Hozz létre egy új branchet a funkcióhoz vagy hibajavításhoz:

```bash
git checkout -b feature/your-feature-name
```

vagy

```bash
git checkout -b fix/bug-description
```

2. Végezze el a szükséges módosításokat.

3. Commitold a változtatásokat:

```bash
git commit -m "Add: rövid leírás a változtatásról"
```

4. Pushold a saját forkodba:

```bash
git push origin feature/your-feature-name
```

5. Nyiss egy Pull Requestet.

---

## Commit irányelvek

Kérjük, írj egyértelmű és beszédes commit üzeneteket.

Ajánlott prefixek:

```
feat: új funkció
fix: hibajavítás
docs: dokumentáció frissítés
refactor: kód átszervezése
style: formázási változtatások
test: tesztek hozzáadása vagy frissítése
chore: karbantartási feladatok
```

Példa:

```
feat: éttermek szűrése kategória szerint
```

---

## Pull Request folyamat

Pull Request benyújtásakor:

1. Győződj meg róla, hogy a branched naprakész a `main` branchhez képest.
2. Adj egyértelmű leírást arról, hogy mit csinál a PR.
3. Hivatkozz a kapcsolódó issue-kra.
4. Ellenőrizd, hogy a projekt sikeresen buildel.
5. Ha lehet, a PR legyen kisebb és egy konkrét változtatásra fókuszáljon.

Példa PR cím:

```
feat: felhasználói autentikáció hozzáadása
```

---

## Hibák jelentése

Ha hibát találsz vagy új funkciót szeretnél javasolni:

1. Először ellenőrizd a meglévő issue-kat.
2. Nyiss egy új issue-t egyértelmű címmel és leírással.

Lehetőleg tartalmazza:

* A hiba reprodukálásának lépéseit
* Az elvárt működést
* A tényleges működést
* Képernyőképeket (ha releváns)

---

## Kódolási irányelvek

Kérjük, kövesd az alábbi általános irányelveket:

* Írj tiszta és jól olvasható kódot
* Használj beszédes változóneveket
* Tartsd a függvényeket röviden és egyértelmű céllal
* Kommentáld az összetettebb logikát
* Kövesd a projekt meglévő struktúráját

---

## Kérdések

Ha bármilyen kérdésed van, nyugodtan nyiss egy issue-t vagy indíts egy discussiont.

Köszönjük, hogy hozzájárulsz a **FoodGo** projekthez! 🚀
