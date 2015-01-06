var size = 12;

var mongo       = new Mongo();
var db          = mongo.getDB("nosql");
var matrix      = db.matrix2;

matrix.drop();

var mat = { type : "matrix", rows = [] };
for (var i = 0; i < size; i++) {
  var row = [];
  for(j = 0; j < size; j++) {
    row.push({ y : j, v : Math.floor((Math.random() * 10) + 1) });
  }
  mat.rows.push(row);
}
matrix.insert(mat);

var vec = { type : "vector", v : [] };
for (var i = 0; i < size; i++) {
  vec.v.push(Math.floor((Math.random() * 10) + 1));
}
matrix.insert(vec);
