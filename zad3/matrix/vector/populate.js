var size = 1000;

var mongo       = new Mongo();
var db          = mongo.getDB("nosql");
var matrix      = db.matrix1;

matrix.drop();

for (var i = 0; i < size; i++) {
  for(j = 0; j < size; j++) {
    matrix.insert({ type: "matrix", x : i, y : j, v : Math.floor((Math.random() * 10) + 1) });
  }
}

for (var i = 0; i < size; i++) {
  matrix.insert({ type: "vector", x : i, v : Math.floor((Math.random() * 10) + 1) });
}
