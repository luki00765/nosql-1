var mongo       = new Mongo();
var db          = mongo.getDB("nosql");
var collection  = db.words2;

var map = function() {

  var str = this.word;
  var key = "";
  var tab = [];
  var obj = {};

  for(i = 0; i < str.length; i++)
  {
    tab[i] = str[i];
  }

  tab.sort();

  for(i = 0; i < tab.length; i++)
  {
    if(typeof obj[tab[i]] == 'undefined') obj[tab[i]] = 1;
    else obj[tab[i]]++;
  }

  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      key += k+obj[k];
    }
  }

  emit(key, this.word);
};

var reduce  = function(word, values) {
  
  var result = {};

  for(i = 0; i < values.length; i++)
  {
    if(typeof result[word] == 'undefined') result[word] = "";
    result[word] = result[word] + ' ' + values[i];
  }

  return result;
};


collection.mapReduce( map, reduce, { out : { inline : 1 } } );
