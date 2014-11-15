var connection = new Mongo();
var database = connection.getDB('ug');

var objects = database.uscan.find();
var records = 0;
var recordsUpdated = 0;

print( 'Script started' );

var morphToGeo = function (element) {
	records++;

	if(!element.hasOwnProperty('loc')) {
		var newRecord = {
			"_id": element._id,
			"city": element.city,
			"loc": {
				"type": "Point",
				"coordinates": [-1 * element.y, element.x]
			}
		}

		database.uscan.remove({"_id": element._id});
		database.uscan.insert(newRecord);

		recordsUpdated++;	
	}
	
};

objects.forEach(morphToGeo);

print('Script executed, updated ' + recordsUpdated + ' of ' + records);