# *Marcin Horoszko, Piotr Kulas, Łukasz Ekiert*

* [Opis projektu](#opis-projektu)
* [Zadanie 3a - Anagramy](#zadanie-3a)
* [Zadanie 3b - Matrix x Vector](#zadanie-3b)
* [Zadanie 3c - Liczby całkowite](#zadanie-3c)
* [Zadanie 3d - Stack Overflow](#zadanie-3d)
* [Zadanie 3e - Get Glue](#zadanie-3e)
* [Zadanie 3f - Lastfm](#zadanie-3f)

---

## Opis projektu

Nasza grupa skupiła się na różnych przykładach wykorzystania Map-Reduce ( tych zalecanych przez wykładowcę oraz własnych ). Podzieliliśmy nasze zadania na 3 grupy.

Zadania 3a - 3c to problemy Map-Reduce polecane przez prowadzącego.
Zadanie 3d - 3f to obszerniejsze przykłady Map-Reduce korzystające z prawdziwych danych.

---

## Zadanie 3a

[Opis rozwiązania](https://github.com/cinkonaap/nosql/blob/master/zad3/anagramy/rozwiazanie.md)

---

## Zadanie 3b

[Opis rozwiązania](https://github.com/cinkonaap/nosql/tree/master/zad3/matrix/vector)

---

## Zadanie 3c

Zadanie polega na wykonaniu czterech operacji Map-Reduce na zbiorze liczb całkowitych.

Na wstępie korzystając z własnego [skryptu](https://github.com/cinkonaap/nosql/blob/master/zad3/liczby_calkowite/generator.pl) napisanego w PERL, wygenerowałem zbiór liczb całkowitych.

```sh
$ time perl generator.pl

real 0m1.329s
user 0m1.252s
sys	0m0.072s

```

Kolejnym krokiem było wczytanie danych w formacie .csv do bazy Mongo.

```sh
$ time mongoimport -d ug -c calkowite --type csv --headerline --file liczby.csv

real 1m7.738s
user 0m7.172s
sys	0m1.299s
```

Dla sprawdzenia czy wszystko poszło zgodnie z planem, sprawdziłem liczbę zimportowanych rekordów.

```sh
$ mongo ug
> db.calkowite.count()

5000000
```

Następnie robiłem kolejne operację Map-Reduce:

#### Przykład A - Największą liczbę występujaca w tym zbiorze

[max.js](https://github.com/cinkonaap/nosql/blob/master/zad3/liczby_calkowite/max.js)

```sh
$ time mongo < max.js

real 0m44.402s
user 0m0.145s
sys	0m0.145s
```

Wynik:

```sh
{
	"_id" : "values",
	"value" : 999999944
}
```

#### Przykład B - Średnią z liczb z tego zbioru

[average.js](https://github.com/cinkonaap/nosql/blob/master/zad3/liczby_calkowite/average.js)

```sh
$ time mongo < average.js

real 0m46.928s
user 0m0.190s
sys	0m0.137s
```

Wynik:

```sh
{
	"_id" : "values",
	"value" : 507171968.9323953
}
```

#### Przykład C - Liczby które występują najczęściej w tym zbiorze

Dla tego i następnego przykładu skorzystałem z mniejszego zbioru i mniejszą rozbieżnością wartości.

```sh
$ time mongoimport -d ug -c calkowite2 --type csv --headerline --file liczby2.csv

imported 50000 objects

real 0m16.440s
user 0m0.112s
sys	0m0.020s
```

[most.js](https://github.com/cinkonaap/nosql/blob/master/zad3/liczby_calkowite/most.js)

```sh
$ time mongo < most.js

real	0m0.422s
user	0m0.030s
sys	0m0.013s

$ mongo ug
> db.tempResults.find().sort( { value : -1 } ) );
```

10 Najczęściej występujących rekordów

```sh
{ "_id" : 85, "value" : 17 }
{ "_id" : 53, "value" : 16 }
{ "_id" : 141, "value" : 16 }
{ "_id" : 173, "value" : 16 }
{ "_id" : 33, "value" : 15 }
{ "_id" : 483, "value" : 15 }
{ "_id" : 3, "value" : 14 }
{ "_id" : 29, "value" : 14 }
{ "_id" : 57, "value" : 14 }
{ "_id" : 127, "value" : 14 }
```

#### Przykład D - Liczbę różnych liczb z tego zbioru

[diff.js](https://github.com/cinkonaap/nosql/blob/master/zad3/liczby_calkowite/diff.js)

```sh
$ time mongo < diff.js

real	0m0.354s
user	0m0.039s
sys	0m0.004s

$ mongo ug
> db.tempResults.count()
500
```

Wynik:

Liczba 500, widać że przy większym zbiore niż zasięg wartości wszystkie zostały wykorzystane.

---

## Zadanie 3d

W tym zadaniu wykorzystujemy dane z Zadania 1 Train.csv, które obrazują przechowują treść i tagi pytań serwisu Stack Overflow.

Zaczynamy od przygotowania danych, i importu do Mongo.

```sh
$ time bash 2unix.sh Train.csv Train_clear.csv

real 15m39.636s
user 0m24.448s
sys 0m52.715s
```

```sh
$ time mongoimport -d ug -c train --type csv --headerline --file Train_clear.csv

real 9m47.314s
user 1m11.007s
sys 0m7.734s
```
I sprawdzamy czy liczba zimportowanych rekordów się zgadza

```sh
$ mongo ug
$ db.train.count()
6034195
```
#### Przykład A - Średnia długość nazwy tematu

[average_title.js](https://github.com/cinkonaap/nosql/blob/master/zad3/stack_overflow/average_title.js)

```sh
$ time mongo < average_title.js

real 4m16.239s
user 0m1.450s
sys	0m1.497s
```
Wynik:

```sh
{
	"_id" : "dlugosc",
	"value" : 53.72121388547266
}
```

Co oznacza że średnia długość nazwy tematu to niedużo mniej niż 54 znaków.

#### Przykład B - Najczęstsza ilość tagów przypisana dla tematu

[most_tags.js](https://github.com/cinkonaap/nosql/blob/master/zad3/stack_overflow/most_tags.js)

```sh
$ time mongo ug < most_tags.js

real	5m54.075s
user	0m1.710s
sys	0m2.035s

$ mongo ug
> db.tempResults.find().sort( { value : -1 } );
```
Wynik:

```sh
{ "_id" : 62, "value" : 2802 }
{ "_id" : 60, "value" : 2797 }
{ "_id" : 61, "value" : 2780 }
{ "_id" : 63, "value" : 2741 }
{ "_id" : 59, "value" : 2577 }
{ "_id" : 58, "value" : 2564 }
{ "_id" : 64, "value" : 2559 }
{ "_id" : 65, "value" : 2413 }
{ "_id" : 57, "value" : 2402 }
{ "_id" : 66, "value" : 2245 }
```
Jak widać w 10 pierwszych wynikach, średnia wartość najczęstszej ilości tagów w temacie to ok. 60.

---

## Zadanie 3e

W tym zadaniu wykorzystujemy bazę IMDB Get Glue która także była dostępna w Zadaniu 1.

Na początku przygotowujemy dane i importujemy do Mongo.

```sh
$ time mongoimport --db ug --collection getglue --type json --file getglue_sample.json

real 15m7.825s
user 3m42.567s
sys 0m12.626s
```

I sprawdzamy poprawność importu

```sh
$ mongo ug
> db.getglue.count()
19831300
```

#### Przykład A - Ilość użytkowników wykonujących akcję

[user_actions.js](https://github.com/cinkonaap/nosql/blob/master/zad3/get_glue/user_actions.js)

```sh
$ time mongo ug < user_actions.js

real 9m45.786s
user 0m3.243s
sys	0m2.728s

$ mongo ug
> db.tempResults.count();
173242
```

Jest takich użytkowników 173242

#### Przykład B - Użytkownicy z największą ilością akcji

[user_actions.js](https://github.com/cinkonaap/nosql/blob/master/zad3/get_glue/user_actions.js)

```sh
$ time mongo ug < user_actions.js

real 8m25.234s
user 0m3.187s
sys	0m1.925s

$ mongo ug
> db.tempResults.find().sort( { 'value' : -1 } )
```

Wynik :

```sh
{ "_id" : "michaela_behrens", "value" : 1540 }
{ "_id" : "colleen_presser", "value" : 1113 }
{ "_id" : "resev1010", "value" : 1108 }
{ "_id" : "moviesrgood", "value" : 1094 }
{ "_id" : "archerfamilyrpg", "value" : 914 }
{ "_id" : "sunuwiratsongko", "value" : 886 }
{ "_id" : "todd_mckellar", "value" : 817 }
{ "_id" : "jerrod_chekal", "value" : 798 }
{ "_id" : "jose_g_nieves", "value" : 797 }
{ "_id" : "mnium", "value" : 785 }
{ "_id" : "Lutz59", "value" : 784 }
{ "_id" : "emelie_ljungberg", "value" : 774 }
{ "_id" : "alexandre_campana", "value" : 725 }
{ "_id" : "sheila_jones", "value" : 724 }
{ "_id" : "stephanie_duncan1", "value" : 706 }
```
Jest to lista 15 użytkowników z największą ilością akcji

---

## Zadanie 3f

Wykorzystałem bazę [last.fm](http://labrosa.ee.columbia.edu/millionsong/lastfm). Baza była pocięta w 839122 plików JSON. Każdy plik reprezentował 1 rekord zawierający tytuł piosenki, wykonawcę, tagi przypisane do piosenki oraz referencje do podobnych utworów. Przy próbie importu tylu plików metodą 1 po 2, Mongo wyrabiało z prędkością około 30 rekordów na sekund. Trzeba było więc scalić wszystkie pliki w 1.
Napisałem do tego prosty skrypt bash.
```sh
for col in $(find -follow | grep .json)
do
	cat $col >> output.json
done
```
Gdy już zrobiło merge wszystkich plików do output.json. Zaimportowałem do wszystko do bazy danych.
```sh
time mongoimport -d egzamin -c lastfm --file output.json
imported 839122 objects
real	1m42.850s
```
### Przykład A - Wystąpienia słów w tytule piosenek
[wystapieniaslow.js](lastfm/wystapieniaslow.js)

Zrobiłem map / reduce tak jak w poleceniu, wyszukujące najczęściej występujące słowa, tylko wykorzystałem do tego bazę last.fm oraz tytuły piosenek.
```sh
mongo < skrypt.js
MongoDB shell version: 2.6.6
connecting to: test
{
	"result" : "wystapieniaslow",
	"timeMillis" : 47001,
	"counts" : {
		"input" : 839122,
		"emit" : 2795793,
		"reduce" : 451501,
		"output" : 210987
	},
	"ok" : 1
}

db.wystapieniaslow.find().sort({value:-1}).limit(10);
```
Wynik :
```js
{ "_id" : "the", "value" : 100162 }
{ "_id" : "version)", "value" : 38780 }
{ "_id" : "of", "value" : 37999 }
{ "_id" : "you", "value" : 36851 }
{ "_id" : "a", "value" : 35243 }
{ "_id" : "i", "value" : 31267 }
{ "_id" : "in", "value" : 30811 }
{ "_id" : "me", "value" : 26833 }
{ "_id" : "to", "value" : 26700 }
{ "_id" : "love", "value" : 23142 }
```
Jest to 10 najczęściej występujących słów w tytułach piosenek.

#### Przykład B - najczęściej przypisywane tagi do piosenek.
[najczestszetagi.js](lastfm/najczestszetagi)

```bash
mongo < nosql/zad3/lastfm/najczestszetagi.js
MongoDB shell version: 2.6.6
connecting to: test
{
	"result" : "najczestszetagi",
	"timeMillis" : 170994,
	"counts" : {
		"input" : 839122,
		"emit" : 7671122,
		"reduce" : 1219807,
		"output" : 484364
	},
	"ok" : 1
}

db.najczestszetagi.find().sort({value:-1}).limit(20);
```

Wynik :
```js


{ "_id" : "rock", "value" : 91199 }
{ "_id" : "pop", "value" : 61766 }
{ "_id" : "alternative", "value" : 50567 }
{ "_id" : "indie", "value" : 43036 }
{ "_id" : "electronic", "value" : 40326 }
{ "_id" : "female vocalists", "value" : 37796 }
{ "_id" : "favorites", "value" : 36185 }
{ "_id" : "Love", "value" : 31473 }
{ "_id" : "dance", "value" : 29495 }
{ "_id" : "00s", "value" : 28189 }
{ "_id" : "alternative rock", "value" : 27609 }
{ "_id" : "beautiful", "value" : 26528 }
{ "_id" : "jazz", "value" : 25943 }
{ "_id" : "singer-songwriter", "value" : 25626 }
{ "_id" : "male vocalists", "value" : 24438 }
{ "_id" : "metal", "value" : 24264 }
{ "_id" : "chillout", "value" : 24227 }
{ "_id" : "Awesome", "value" : 23793 }
{ "_id" : "classic rock", "value" : 23777 }
{ "_id" : "indie rock", "value" : 22125 }
```
![tagi.png](lastfm/tagi.png)
Na 900 tys. rekordów rock najczęściej występujący tag ma pokrywa 10% rekordów, mało, ale po prostu wina jest taka, że duży % piosenek nie ma przypisane żadnych tagów.

---
