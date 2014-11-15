var connection = new Mongo();
var database = connection.getDB('ug');

var objects = database.train.find();
var records = 0;
var recordsUpdated = 0;

print( 'Script started' );

var retagElement = function (element) {

	records++;
	print( 'Evaling record #' + records );

	if( typeof element.tags === 'string' ) {
		var _tags = element.tags.split(' ');

		database.train.update(
			{_id: element._id},
			{$set: {
				tags: _tags
			}}
		);

		recordsUpdated++;
	}
};

objects.forEach(retagElement);

print('Script executed, updated ' + recordsUpdated + ' of ' + records);