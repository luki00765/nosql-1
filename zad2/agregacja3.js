/**
  * Agregacja - 5 najaktywniejszych użytkowników
 **/

var res = db.getglue.aggregate(
	{ $group: { _id: "$userId", count:{ $sum: 1 } } },
	{ $sort: { count: -1 } }, { $limit: 10 }
);

printjson(res);