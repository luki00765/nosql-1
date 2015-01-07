var mongo       = new Mongo();
var db          = mongo.getDB("egzamin");
var collection  = db.ufo;

var map = function () {
      var sighted_at = this.sighted_at;
      var okflag = true;
      if(sighted_at.length!=8) okflag = false;
      var yearmonth = sighted_at.substring(0,(sighted_at.length-2));
      var month = yearmonth % 100;
      var year = yearmonth.substring(0,(yearmonth.length-2));
      var months = [ 'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
      'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
      var monthString = function (year, month) {
        return year + ' ' + months[month];
      };
      if(okflag)emit(monthString(year,month-1) ,1);

};
var reduce = function(key, values){
    var count = 0;
    values.forEach(function(v){
      count +=v;
    });
    return count;
};

collection.mapReduce( map, reduce, { out: "ufodata" } );
