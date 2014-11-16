# *Marcin Horoszko*

* [Dane techniczne](#dane-techniczne)
* [Zadanie 2a - Pobranie pliku z danymi](#zadanie-2a)
* [Zadanie 2b - Import danych do Mongo](#zadanie-2b)
* [Zadanie 2c - Agregacje JS](#zadanie-2c)
* [Zadanie 2d - Agregacje X](#zadanie-2d)

---

## Dane Techniczne

![h](https://github.com/cinkonaap/nosql/blob/master/zad1/hard_info.png)

---

## Zadanie 2a

W tym zadaniu korzystam z danych GetGlue IMDb, które sciągnąłem [stąd](http://getglue-data.s3.amazonaws.com/getglue_sample.tar.gz)

---

## Zadanie 2b

Zaimportowałem dane do Mongo, korzystając z odpowiednich komend

```sh
$ time mongoimport --db ug --collection getglue --type json --file getglue_sample.json 

real 16m21.400s
user 4m20.472s
sys	0m14.946s
```

I sprawdzamy ilość zimportowanych rekordów

```sh

```

---

## Zadanie 2c

#### Agregacja I - 5 najbardziej nie lubianych filmów

```sh
> db.getglue.aggregate( 
	{ $match: { "modelName": "movies" } },
	{ $match: { "action": "Disliked" }}, 
	{ $group: { _id: "$title", count: {$sum: 1} } }, 
	{ $sort: { count: -1 } }, { $limit: 10 } 
);

real 6m8.460s
user 0m0.032s
sys	0m0.008s
```

[wynik agregacji]()

ZDJĘCIE ROZWIĄZANIA!

#### Agregacja II - 8 reżyserów z największą liczbą filmów

```sh
> db.getglue.aggregate( 
	{ $match: { "modelName": "movies" } },
    { $group: {_id: { "dir": "$director", id: "$title" }, count: { $sum: 1 } } },
    { $group: {_id: "$_id.dir" , count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 } 
);

real 8m12.176s
user 0m0.035s
sys	0m0.006s
```

[wynik agregacji]()

ZDJĘCIE ROZWIĄZANIA!

#### Agregacja III - 10 najaktywniejszych użytkowników

```sh
> db.getglue.aggregate(
	{ $group: { _id: "$userId", count:{ $sum: 1 } } },
	{ $sort: { count: -1 } }, { $limit: 10 }
);

real 7m2.432s
user 0m0.049s
sys	0m0.021s
```

[wynik agregacji]()

ZDJĘCIE ROZWIĄZANIA!

#### Agregacja IV - 10 najpopularniejszych filmów, czyli takich które są lubiane i komentowane zarazem

```sh
> db.getglue.aggregate( 
	{ $match: { "action": "Liked" } },
	{ $match: { "comment": { $ne: "" } } }, 
	{ $group: { _id: "$title", count: { $sum: 1 } } }, 
	{ $sort: { count: -1 } }, { $limit: 10 } 
);

real 7m57.261s
user 0m0.047s
sys	0m0.007s
```

[wynik agregacji]()

ZDJĘCIE ROZWIĄZANIA!

---

## Zadanie 2d

#### Agregacja I - 5 najbardziej nie lubianych filmów

#### Agregacja II

#### Agregacja III

#### Agregacja IV