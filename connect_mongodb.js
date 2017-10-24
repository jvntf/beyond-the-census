var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;


var url = 'mongodb://c4sr:languages@ds227555.mlab.com:27555/heroku_wpb27xt2';


MongoClient.connect(url, function (err, db) {
	if (err) {
		console.log('Unables to connect to the mdb server. Error: ', err);
	} else {
		console.log('Connection established to', url);

		db.close();
	}
	
});
