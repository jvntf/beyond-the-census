var fs = require('fs');
var csv = require('csv');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// var sourcePath = '../resources/QueensLanguages.csv';  // path to file with utf8 encoding
// var sourcePath = '../../data/glottoQueens_reExport.csv';  // path to file with utf8 encoding
var sourcePath = 'newEntries.csv';  // path to file with utf8 encoding

// Connection URL
// var url = 'mongodb://localhost:27017/leaflet_test'; // change last part of path to db name

var url = 'mongodb://c4sr:languages@ds149974.mlab.com:49974/heroku_bz30p5qb'
var targetcollection = 'languages'; // name of collection to add to witin the database


// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  fs.readFile(sourcePath, 'utf8', (err, data) => {
    if (err) throw err;
    csv.parse(data, {columns: true}, (err, data) => {
      if (err) throw err;
      reformatted = JSON.stringify(data, null, '  ');
      console.log(reformatted);
      insertDocuments( db, data, logresults );
      db.close();
    });
    //console.log(data);
  });
});

var insertDocuments = function(db, data, callback) {
  // Get the documents collection
  var collection = db.collection( targetcollection );
  // Insert some documents
  collection.insertMany(data, function(err, result) {
    if (err) throw err;
    //assert.equal(err, null);
    //assert.equal(3, result.result.n);
    //assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

function logresults( string ) {
  console.log(string);
}

/*var findDocuments = function(db, field, value, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({'a': 3}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });
}*/
