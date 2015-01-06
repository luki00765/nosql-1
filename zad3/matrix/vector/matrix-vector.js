var mongo       = new Mongo();
var db          = mongo.getDB("nosql");

var map = function() {
  emit(this.x, this.v * vector.v[this.x]);
};

var reduce = function (key, values) {
  return Array.sum(values);
};

db.matrix1.mapReduce( map, reduce, { out : { inline : 1 }, scope : { vector : { type : "vector" } }, query : { type : "matrix"  } } );
