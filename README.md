# Breakout Arcade Game - HTML5 web aplikacija

## Opis projekta
Projekt predstavlja pojednostavljenu, 2D verziju klasične arkadne igre Breakout, izrađenu kao HTML5 web aplikacija. Igra prikazuje Canvas element koji pokriva cijeli prozor preglednika, s vidljivim rubom i pozadinom u boji po izboru radi boljeg kontrasta. Cilj igre je uništiti sve cigle odbijanjem loptice o palicu kojom igrač upravlja. Igra završava kada igrač razbije sve cigle ili izgubi lopticu.

## Glavne funkcionalnosti
- Prikaz igre:
  - Igra se prikazuje u Canvas objektu koji prekriva cijeli zaslon preglednika.
  - Canvas ima vidljiv rub i pozadinsku boju u kontrastu s elementima igre.
- Igranje:
  - Igra počinje automatski nakon učitavanja stranice.
  - Loptica se generira na sredini palice i kreće prema gore pod slučajnim kutem.
  - Igrač upravlja palicom pomoću tipki na tipkovnici (npr. strelice lijevo i desno).
  - Cigle su raspoređene u nekoliko redova pri vrhu ekrana, dok su palica i loptica na dnu.
  - Loptica se odbija od cigli, palice i rubova ekrana pri konstantnoj brzini.
- Uvjeti završetka igre:
  - Poraz: Ako loptica padne ispod palice, igra završava s porukom "GAME OVER" centriranom na sredini ekrana.
  - Pobjeda: Ako igrač razbije sve cigle, prikazuje se čestitka.
- Detekcija kolizije:
  - Svaki sudar loptice s ciglom, palicom ili rubom ekrana detektira se u svakom koraku animacije.
  - Kada loptica pogodi ciglu, cigla nestaje, a igrač dobiva bod (1 bod po cigli).
- Prikaz rezultata:
   - Trenutni rezultat: Prikazuje se u gornjem desnom kutu Canvasa.
   - Najbolji rezultat: Pohranjuje se u local storage i prikazuje pored trenutnog rezultata.
- Opcionalne funkcionalnosti:
  - Postavljanje parametara (broj cigli i početna brzina loptice) igre putem HTML5 forme prije početka igre.
  - Zvukovi za kolizije, početak i kraj igre, te pri dosezanju određenih brojeva bodova.
