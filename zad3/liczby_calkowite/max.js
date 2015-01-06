var mongo       = new Mongo();
var db          = mongo.getDB("ug");
var collection  = db.calkowite;

// { "_id" : ObjectId("54abc50113796381aca82417"), "v" : 6991 }

var map = function () {
 	emit('values', this.v);
};

var reduce = function (key, values) {
	return Math.max.apply(null, values);
};

collection.mapReduce( map, reduce, { out : { inline : 1 } } );
