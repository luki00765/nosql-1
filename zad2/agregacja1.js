/**
  * Agregacja - 5 najmniej lubianych filmów
 **/

var res = db.getglue.aggregate( 
	{ $match: { "modelName": "movies" } },
	{ $match: { "action": "Disliked" } }, 
	{ $group: { _id: "$title", count: {$sum: 1} } }, 
	{ $sort: { count: -1 } }, { $limit: 10 } 
); 

printjson(res);
