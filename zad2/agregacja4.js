/**
  * Agregacja - 10 najpopularniejszych filmów, czyli takich które są lubiane i komentowane zarazem
 **/

var res = db.getglue.aggregate( 
	{ $match: { "action": "Liked" } },
	{ $match: { "comment": { $ne: "" } } }, 
	{ $group: { _id: "$title", count: { $sum: 1 } } }, 
	{ $sort: { count: -1 } }, { $limit: 10 } 
);

printjson(res);