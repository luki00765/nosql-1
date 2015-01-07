var mongo       = new Mongo();
var db          = mongo.getDB("egzamin");
var collection  = db.lastfm;

var map = function () {
  var tags = this.tags;
  if(tags){
    tags.forEach(function(tag){
      if(tag[0]){
        emit(tag[0],1);
      }
    });
  }
};

var reduce = function(key, values){
  var count = 0;
  values.forEach(function(v){
    count +=v;
  });
  return count;
};

db.lastfm.mapReduce( map, reduce, { out: "najczestszetagi" } );
