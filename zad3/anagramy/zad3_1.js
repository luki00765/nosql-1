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
    if(typeof result[i] == 'undefined') result[i] = "";
    result[i] = result[i] + values[i];
  }

  var i = 0;
  for(var k in result)
  {
    if (result.hasOwnProperty(k)) {
      i++;
    }
  }

  result["count"] = i;

  return result;
};

collection.mapReduce( map, reduce, { out : "result" } );


// WYNIKI
var globalCount = 0;
var groupCount  = 0;
db.result.find({ value : { $type : 3 } }).forEach(function(el) {
  var anagrams = ""

  print();
  print("--- dla " + el._id + " : " + el.value.count + " anagramy ");
  for(key in el.value) {
    if(key != 'count')
    anagrams += el.value[key] + " ";
  }
  print(anagrams);
  globalCount += el.value.count;
  groupCount++;
});
print("Lacznie znaleziono " + globalCount + " anagramow w " + groupCount + " zbiorach");
