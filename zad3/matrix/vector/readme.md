#Mnożenie macierzy przez wektor

## Generowanie danych
Do zapełnienia bazy testowymi danymi napisałem skrypt w JS, który losuje
matrycę o wielkości 1000x1000 oraz wektor o rozmiarze 1000. Każdy dokument to
położenie jednego elementu w matrycy(x,y)/wektorze(x). Wartość "type" określa
przynależność punktu do matrycy, bądź wektora. Jest ona wykorzystywana przy
filtrowaniu danych w query oraz przygotowywaniu wektora do funkcji map.

### Wywołanie skryptu:
```
time mongo < populate.js
```

### Czas wykonania:
```
real	7m13.107s
user	5m12.133s
sys	0m19.479s
```

### Weryfikacja wyników:
```
> db.matrix1.count()
1001000
```

## Obliczenia
Obliczenia właściwe są wykonywane poprzez skrypt matrix-vector.js. Zgodnie z
rozwiązaniem zaproponowanym w książce, do funkcji map udostępniamy uprzednio
przygotowany wektor poprzez nadanie mu zasięgu globalnego za pomocą scope.
Następnie obliczana i wysyłana dzięki emit do reduce jest para (w, y), gdzie w
to indeks wiersza, a y to element m(w,i) x v(i), gdzie m to matryca, a v to
wektor. W funkcji reduce elementy te są sumowane, a rezultatem jest wektor
wynikowy.

### Rezultat wykonania w konsoli mongo:
```JSON
"timeMillis" : 9430,
"counts" : {
  "input" : 1000000,
  "emit" : 1000000,
  "reduce" : 1456,
  "output" : 1000
  },
  "ok" : 1
```

### Przykładowe wyniki:
```JSON
  {
    "_id" : 994,
    "value" : 31470
  },
  {
    "_id" : 995,
    "value" : 29626
  },
  {
    "_id" : 996,
    "value" : 31331
  },
```

### Czas wykonania:
```
real	0m9.337s
user	0m0.079s
sys	0m0.017s
```
