# *Marcin Horoszko*

* [Dane techniczne](#dane-techniczne)
* [Zadanie 1a - Import CSV](#zadanie-1a)
* [Zadanie 1b - Zliczanie rekordów](#zadanie-1b)
* [Zadanie 1c - Tagi](#zadanie-1c)
* [Zadanie 1d - Geolokacja](#zadanie-1d)

---

## Dane Techniczne

todo

---

## Zadanie 1a

Problem ze złym formatowaniem rozwiązałem korzystając ze [skryptu](https://github.com/nosql/aggregations-2/blob/master/scripts/wbzyl/2unix.sh) udostępnionego przez prowadzącego

```sh
$ time bash 2unix.sh Train.csv Train_clear.csv

real 15m39.636s
user 0m24.448s
sys 0m52.715s
```

Po przygotowaniu poprawnego pliku z danymi, importujemy je do bazy


#### MONGO DB

```sh
$ time mongoimport -d ug -c train --type csv --headerline --file Train_clear.csv

real 9m47.314s
user 1m11.007s
sys 0m7.734s
```



#### POSTGRESQL 

```sh
$ sudo -u postgres psql postgres
> nosql
> CREATE TABLE TRAIN (Id INT PRIMARY KEY NOT NULL, Title TEXT, Body TEXT, Tags TEXT);
> \timing
> COPY TRAIN FROM '/home/Projects/nosql_ug/zad1/Train_clear.csv' DELIMITER ',' CSV HEADER;

Time: 776038,453 ms
```

---																														
## Zadanie 1b

Zliczamy liczbę zimportowanych rekordów

#### MONGO DB

```sh
$ mongo ug
$ db.train.count()
6034195
```

#### POSTGRESQL

Te dane zostały podane od razu po wykonaniu operacji COPY w zadaniu 1a

```sh
COPY 6034195
```

---

## Zadanie 1c

#### MONGO DB

Korzystam z własnego skryptu JavaScript [tags.js](https://github.com/cinkonaap/nosql/blob/master/zad1/tags.js) który pobiera wszystkie rekordy z tabeli Train, i dla każdego z nich jeżeli obiekt tags jest stringiem, zamienia go na tablicę stringów korzystając z metody String.prototype.split.

```sh
$ time mongo tags.js

real 13m30.698s
user 3m42.983s
sys	0m87.246s

$ mongo ug
> db.train.findOne()

{
	"_id" : 4,
	"title" : "How do I replace special characters in a URL?",
	"body" : "<p>This is probably very simple, but I simply cannot find the answer myself :( </p>  <p>Basicaly, what I want is, given this string:</p>  <p>\"http://www.google.com/search?hl=en&amp;q=c# objects\"</p>  <p>I want this output:</p>  <p><a href=\"http://www.google.com/search?hl=en&amp;q=c%23+objects\">http://www.google.com/search?hl=en&amp;q=c%23+objects</a></p>  <p>I'm sure there's some helper class somewhere buried in the Framework that takes care of that for me, but I'm having trouble finding it.</p>  <p>EDIT: I should add, that this is for a Winforms App.</p> ",
	"tags" : [
		"c#",
		"url",
		"encoding"
	]
}
```

#### POSTGRESQL

Próby rozwiązania znajdują się w pliku [tags.py](https://github.com/cinkonaap/nosql/blob/master/zad1/tags.py), niestety nie udało mi się wykonać tej operacji pomyślnie

---

## Zadanie 1d

Lokacje pobralem ze [źródła](http://www.infoplease.com/ipa/A0001796.html#ixzz3JAR1CbKC), i przerobilem korzystając z wyrażen regularnych na format CSV. Zimportowałem go do Mongo

```sh
$ time mongoimport -d ug -c uscan --type csv --headerline --file usa_canada_cities.csv

real 0m0.845s
user 0m0.015s
sys	0m0.019s
```

Następnie przerobiłem strukturę rekordów tak, aby odpowiadała GeoJSON'owi, własnym skryptem [usa_to_geo.js](https://github.com/cinkonaap/nosql/blob/master/zad1/usa_to_geo.js) ( poprawiającym także błędy w csv ), wraz z nałożeniem indexu na loc.

```sh
$ time mongo usa_to_geo.js 
```

Po tym zapytaniu, przykładowy rekord wygląda odpowiednio

```sh
> db.uscan_cities.findOne()

{
	"_id" : ObjectId("5467b3fac706c32a0446b514"),
	"city" : "Albany N.Y.",
	"loc" : {
		"type" : "Point",
		"coordinates" : [
			42.4,
			73.45
		]
	}
}
```

#####Geo Query I - Wszystkie miasta leżące w zachodniej części USA

```sh
var leftUSASide = {
...         "type": "Polygon",
...         "coordinates": [
...           [
...             [
...               -123.3984375,
...               49.095452162534826
...             ],
...             [
...               -100.01953125,
...               49.03786794532641
...             ],
...             [
...               -96.767578125,
...               25.403584973186703
...             ],
...             [
...               -124.8046875,
...               34.08906131584994
...             ],
...             [
...               -126.474609375,
...               49.26780455063753
...             ],
...             [
...               -123.3984375,
...               49.095452162534826
...             ]
...           ]
...         ]
...       }


> db.uscan.find({loc: {$geoWithin: {$geometry: leftUSASide}}}).toArray()
```
Plik GeoJSON : [geoQ1.geojson](https://github.com/cinkonaap/nosql/blob/master/zad1/geoQ1.geojson)

![1](https://github.com/cinkonaap/nosql/blob/master/zad1/geoQ1.png)

#####Geo Query II - 7 najbliższych miast od Chicago

```sh
> var chicago = {
	"type": "Point", 
	"coordinates": [-87.37,41.50] 
}

> db.uscan.find({ loc: {$near: {$geometry: chicago} } }).skip(1).limit(8).toArray()
```

Plik GeoJSON : [geoQ1.geojson](https://github.com/cinkonaap/nosql/blob/master/zad1/geoQ2.geojson)

![2](https://github.com/cinkonaap/nosql/blob/master/zad1/geoQ2.png)

#####Geo Query III - Miasta leżące w promieniu 6.0* od Calgary

```sh
> db.uscan.find({loc: {$geoWithin: {$center: [[-114.1, 51.1], 6.0]}}}).toArray()
```

Plik GeoJSON : [geoQ1.geojson](https://github.com/cinkonaap/nosql/blob/master/zad1/geoQ3.geojson)

![3](https://github.com/cinkonaap/nosql/blob/master/zad1/geoQ3.png)

#####Geo Query IV - 2 najbliższe miasta od New York

```sh
> var newyork = {
	"type": "Point", 
	"coordinates": [-73.58,40.47] 
}

> db.uscan.find({ loc: {$near: {$geometry: newyork} } }).skip(1).limit(3).toArray()
```

{
  "type": "FeatureCollection",
  "features": [
	{
		"type": "Feature",
        "properties": {},
		"geometry" : {
			"type" : "Point",
			"coordinates" : [
				-74.1,
				40.44
			]
		}
	},
	{
		"type": "Feature",
        "properties": {},
		"geometry" : {
			"type" : "Point",
			"coordinates" : [
				-72.55,
				41.19
			]
		}
	},
	{
		"type": "Feature",
        "properties": {},
		"geometry" : {
			"type" : "Point",
			"coordinates" : [
				-75.1,
				39.57
			]
		}
	}
]
}

Plik GeoJSON : [geoQ1.geojson](https://github.com/cinkonaap/nosql/blob/master/zad1/geoQ4.geojson)

![4](https://github.com/cinkonaap/nosql/blob/master/zad1/geoQ4.png)

#####Geo Query V - Miasta leżące na granicy USA z Kanadą

```sh
> var granica = []
> db.uscan.find({loc: {$geoIntersects: {$geometry: granica}}}).toArray().count()
0
```

Pokazuje że 'intersection' liniowy, działa bardzo dokładnie

#####Geo Query VI - Miasta leżące na terytorium Kanady, metodą polygon

```sh
> var granica = {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -123.79394531249999,
              50.28933925329178
            ],
            [
              -123.6181640625,
              47.84265762816535
            ],
            [
              -95.4052734375,
              47.754097979680026
            ],
            [
              -78.5302734375,
              42.00032514831621
            ],
            [
              -70.48828125,
              42.032974332441405
            ],
            [
              -61.34765625,
              46.37725420510028
            ],
            [
              -71.3671875,
              49.35375571830993
            ],
            [
              -76.3330078125,
              46.76996843356982
            ],
            [
              -94.52636718749999,
              51.67255514839676
            ],
            [
              -124.0576171875,
              51.86292391360244
            ],
            [
              -123.79394531249999,
              50.28933925329178
            ]
          ]
        ]
      }

> db.uscan.find({loc: {$geoWithin: {$geometry: granica}}}).toArray()
```

Plik GeoJSON : [geoQ1.geojson](https://github.com/cinkonaap/nosql/blob/master/zad1/geoQ6.geojson)

![6](https://github.com/cinkonaap/nosql/blob/master/zad1/geoQ6.png)

---
