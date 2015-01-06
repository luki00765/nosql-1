var mongo       = new Mongo();
var db          = mongo.getDB("ug");
var collection  = db.train;

var map = function () {
 	emit('dlugosc', this.title.length);
};

var reduce = function (key, values) {
	var sum = 0;
	values.forEach(function (v) {
		sum += v;
	});

	return sum / values.length;
};

collection.mapReduce( map, reduce, { out : { inline : 1 } } );