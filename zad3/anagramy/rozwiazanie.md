Import
``mongoimport --db nosql --collection words2 --type csv --file word_list.txt --fields word``

Map reduce
``time mongo < zad3_1.js``

Wyniki
``db.result.find({ value : { $type : 3 } });``
