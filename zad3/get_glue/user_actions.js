var mongo       = new Mongo();
var db          = mongo.getDB("ug");
var collection  = db.getglue;

var map = function () {
	if( this.userId && this.userId != '' ) {
		emit(this.userId, 1);
	}
};

var reduce = function (key, values) {
	return values.length;
};

collection.mapReduce( map, reduce, { out : "tempResults" } );