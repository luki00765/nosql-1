/**
  * Agregacja - 8 reżyserów z największą liczbą filmów
 **/

var res = db.getglue.aggregate( 
	{ $match: { "modelName": "movies" } },
    { $group: {_id: { "dir": "$director", id: "$title" }, count: { $sum: 1 } } },
    { $group: {_id: "$_id.dir" , count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 } 
); 

printjson(res);