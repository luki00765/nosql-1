var mongo       = new Mongo();
var db          = mongo.getDB("egzamin");
var collection  = db.ufo;

var map = function () {
  var geoloc = this.geoloc;
  if(geoloc){
    var x = Math.round(geoloc[0]/4)*4;
    var y = Math.round(geoloc[1]/4)*4;
    key = { x: x, y: y }

    emit(key,1);
  }
};

var reduce = function(key, values){
  var count = 0;
  values.forEach(function(v){
    count +=v;
  });
  return count;
};

collection.mapReduce( map, reduce, { out: "ufogeo" } );
