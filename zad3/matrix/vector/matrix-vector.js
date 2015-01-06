var mongo       = new Mongo();
var db          = mongo.getDB("nosql");

var vec = { v : db.matrix1.find({ type : "vector" }) };
var scope_v = [];
for(i = 0; i < vec.v.count(); i++) {
  scope_v[i] = vec.v[i].v;
}

var map = function() {
  emit(this.x, this.v * vector[this.y]);
};

var reduce = function (key, values) {
  return Array.sum(values);
};

db.matrix1.mapReduce( map, reduce, { out : { inline : 1 }, scope : { vector : scope_v }, query : { type : "matrix"  } } );
