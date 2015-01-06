# *Marcin Horoszko*
# *Piotr Kulas*
# *Łukasz Ekiert*

* [Dane techniczne](#dane-techniczne)
* [Zadanie 3a - TBA TBA TBA](#zadanie-3a)
* [Zadanie 3c - Liczby całkowite](#zadanie-3c)

---

## Dane Techniczne

---

## Zadanie 3a

W tym zadaniu korzystam z danych GetGlue IMDb, które sciągnąłem [stąd](http://getglue-data.s3.amazonaws.com/getglue_sample.tar.gz)

---

## Zadanie 3c

```sh
$ time perl generator.pl

real 0m0.580s
user 0m0.556s
sys	0m0.024s
```

```sh
$ time mongoimport -d ug -c calkowite --type csv --headerline --file liczby.csv

real 0m29.145s
user 0m2.704s
sys	0m0.537s

```

```sh
$ mongo ug
> db.calkowite.count()

2000000
```

---