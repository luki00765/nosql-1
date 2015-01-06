var mongo       = new Mongo();
var db          = mongo.getDB("ug");
var collection  = db.calkowite2;

// { "_id" : ObjectId("54abc50113796381aca82417"), "v" : 6991 }

var map = function () {
 	emit(this.v, 1);
};

var reduce = function (key, values) {
	return values.length;
};

collection.mapReduce( map, reduce, { out : "tempResults" } );

//db.tempResults.count();