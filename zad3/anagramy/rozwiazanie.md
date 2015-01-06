# Wyszukiwanie anagramów

## Import danych
```sh
mongoimport --db nosql --collection words2 --type csv --file word_list.txt --fields word
```

Weryfikacja importu:
```sh
> db.words.count()
8199
```
## Działanie skryptu
Funkcja mapująca otrzymując wyraz tworzy stringa zawierającego ilość wystąpień
poszczególnych liter w wyrazie. Najpierw rozbija wyraz na litery i umieszcza je
w tablicy i sortuje ją alfabetycznie. Następnie zlicza ilość wystąpień każdej
litery, po czym umieszcza tę informację w obiekcie. Kolejnym krokiem jest
utworzenie stringa, który będzie kluczem dla funkcji reduce. Dla przykładu
wyrazy "aaabbb" oraz "ababab" będą miały klucz "a3b3", a zatem zostaną
zgrupowane jako anagramy.

Kod skryptu znajduje się w pliku [zad3_1.js](zad3_1.js).


## Wykonanie
```sh
time mongo < zad3_1.js
```

Odpowiedź mongo:
```JSON
{
  "result" : "result",
  "timeMillis" : 362,
  "counts" : {
    "input" : 8199,
    "emit" : 8199,
    "reduce" : 914,
    "output" : 7011
  },
  "ok" : 1
}
```

## Czas wykonania
```
real	0m0.511s
user	0m0.086s
sys	0m0.013s
```

## Przykładowe wyniki
```
--- dla e2n1r1t1u1 : 3 anagramy
neuter tenure tureen

--- dla e2n2r1t1 : 2 anagramy
rennet tenner

--- dla e2p1r1s1t1 : 3 anagramy
preset pester peters

--- dla e2p1r1s1u1 : 3 anagramy
peruse purees rupees

--- dla e2r1s1t2 : 4 anagramy
retest setter street tester

--- dla e2r1s2t1 : 4 anagramy
esters resets serest steers
```

## Wyniki
Kompletny plik z wynikami znajduje się w [result](result)
