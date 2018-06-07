var fs = require('fs');
var csv = require('csv');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var sourcePath = '../source/neighborhoods.geojson';  // path to file with utf8 encoding

// Connection URL
var url = 'mongodb://localhost:27017/elaData'; // change last part of path to db name
var targetcollection = 'neighborhoods'; // name of collection to add to witin the database


// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  fs.readFile(sourcePath, 'utf8', (err, data) => {
    if (err) throw err;
    var parsed = JSON.parse(data).features;
      insertDocuments( db, parsed, function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
      });
  });
});

var insertDocuments = function(db, data, callback) {
  // Get the documents collection
  var collection = db.collection( targetcollection );
  // Insert some documents
  collection.insertMany(data, function(err, result) {
    if (err) throw err;
    console.log("Inserted 3 documents into the collection");
    callback(err, result);
  });
}

function logresults( string ) {
  console.log(string);
}
