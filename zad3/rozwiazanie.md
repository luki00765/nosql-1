# *Marcin Horoszko, Piotr Kulas, Łukasz Ekiert*

* [Opis projektu](#opis-projektu)
* [Zadanie 3a - TBA TBA TBA](#zadanie-3a)
* [Zadanie 3c - Liczby całkowite](#zadanie-3c)

---

## Opis projektu

Do zrobienia...

---

## Zadanie 3a

W tym zadaniu korzystam z danych GetGlue IMDb, które sciągnąłem [stąd](http://getglue-data.s3.amazonaws.com/getglue_sample.tar.gz)

---

## Zadanie 3c

Zadanie polega na wykonaniu czterech operacji Map-Reduce na zbiorze liczb całkowitych.

Na wstępie korzystając z własnego [skryptu](LINK) napisanego w PERL, wygenerowałem zbiór liczb całkowitych.

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

[max.js]()

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

[average.js]()

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

[most.js]()

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

#### Przykład D- Liczbę różnych liczb z tego zbioru

[diff.js]()

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