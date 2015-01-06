var mongo       = new Mongo();
var db          = mongo.getDB("ug");
var collection  = db.train;

var map = function () {
 	emit(this.tags.length, 1);
};

var reduce = function (key, values) {
	return values.length;
};

collection.mapReduce( map, reduce, { out : "tempResults" } );

//db.tempResults.find().sort( { value : -1 } ) );