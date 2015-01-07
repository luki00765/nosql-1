var mongo       = new Mongo();
var db          = mongo.getDB("egzamin");
var collection  = db.lastfm;

var map = function () {
    var title = this.title;
    if(title){
      title = title.toLowerCase().replace(/\.|!|,|:/g,'').split(" ");
      title.forEach(function(word){
        if(word){
            emit(word,1);
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

db.lastfm.mapReduce( map, reduce, { out: "wystapieniaslow" } );
