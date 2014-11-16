# *Marcin Horoszko*

* [Dane techniczne](#dane-techniczne)
* [Zadanie 2a - Pobranie pliku z danymi](#zadanie-2a)
* [Zadanie 2b - Import danych do Mongo](#zadanie-2b)
* [Zadanie 2c - Agregacje JS](#zadanie-2c)
* [Zadanie 2d - Agregacje PyMongo](#zadanie-2d)

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
$ mongo ug
> db.getglue.count()
19831300
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

[wynik agregacji](https://github.com/cinkonaap/nosql/blob/master/zad2/agregacja1_result.json)

![1](https://github.com/cinkonaap/nosql/blob/master/zad2/aggregacja1_chart.png)

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

[wynik agregacji](https://github.com/cinkonaap/nosql/blob/master/zad2/agregacja2_result.json)

![2](https://github.com/cinkonaap/nosql/blob/master/zad2/aggregacja2_chart.png)

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

[wynik agregacji](https://github.com/cinkonaap/nosql/blob/master/zad2/agregacja3_result.json)

![3](https://github.com/cinkonaap/nosql/blob/master/zad2/aggregacja3_chart.png)

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

[wynik agregacji](https://github.com/cinkonaap/nosql/blob/master/zad2/agregacja4_result.json)

![4](https://github.com/cinkonaap/nosql/blob/master/zad2/aggregacja4_chart.png)

---

## Zadanie 2d

Zanim zabrałem się za robienie agregacji, musiałem przygotować narzędzia pracy z PyMongo

```sh
$ sudo apt-get install build-essential python-dev
$ sudo pip install pymongo
$ python
> import pymongo
> from pymongo import MongoClient
> database = MongoClient().ug
```

Trzeba także mieć na uwadze, że agregacja PyMongo przyjmuję 1-2 argumenty ( gdzie w JS sam sobie parsował ), dlatego też wszystie opcje trzeba osadzić w tablicy.

#### Agregacja I - 5 najbardziej nie lubianych filmów

```sh
database.getglue.aggregate([ 
	{ "$match": { "modelName": "movies" } },
	{ "$match": { "action": "Disliked" } }, 
	{ "$group": { "_id": "$title", "count": {"$sum": 1} } }, 
	{ "$sort": { "count": -1 } }, { "$limit": 10 } 
]);
```

#### Agregacja II - 8 reżyserów z największą liczbą filmów

```sh
database.getglue.aggregate([
	{ "$match": { "modelName": "movies" } },
    { "$group": { "_id": { "dir": "$director", "id": "$title" }, "count": { "$sum": 1 } } },
    { "$group": { "_id": "$_id.dir" , "count": { "$sum": 1 } } },
    { "$sort": { "count": -1 } },"
    { "$limit": 8 } 
]); 
```

#### Agregacja III - 10 najaktywniejszych użytkowników

```sh
database.getglue.aggregate([
	{ "$group": { "_id": "$userId", "count":{ "$sum": 1 } } },
	{ "$sort": { "count": -1 } }, { "$limit": 10 }
]);
```

#### Agregacja IV - 10 najpopularniejszych filmów, czyli takich które są lubiane i komentowane zarazem

```sh
database.getglue.aggregate([ 
	{ "$match": { "action": "Liked" } },
	{ "$match": { "comment": { "$ne": "" } } }, 
	{ "$group": { "_id": "$title", count: { "$sum": 1 } } }, 
	{ "$sort": { "count": -1 } }, { "$limit": 10 } 
]);
```