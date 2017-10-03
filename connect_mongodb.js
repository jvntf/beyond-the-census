var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;


var url = 'mongodb://c4sr:languages@ds149974.mlab.com:49974/heroku_bz30p5qb';


MongoClient.connect(url, function (err, db) {
	if (err) {
		console.log('Unables to connect to the mdb server. Error: ', err);
	} else {
		console.log('Connection established to', url);

		db.close();
	}
	
});
