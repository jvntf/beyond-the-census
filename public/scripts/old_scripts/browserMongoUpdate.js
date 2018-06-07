window.updateDataBase = function(){
  var fs = require('fs');
  var csv = require('csv');

  var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

  // // var sourcePath = '../resources/QueensLanguages.csv';  // path to file with utf8 encoding
  // // var sourcePath = '../../data/glottoQueens_reExport.csv';  // path to file with utf8 encoding
  // var sourcePath = '../../data/alt_scripts.csv';  // path to file with utf8 encoding

  // Connection URL
  // var url = 'mongodb://localhost:27017/leaflet_test'; // change last part of path to db name

  var url = 'mongodb://c4sr:languages@ds227555.mlab.com:27555/heroku_wpb27xt2'
  var targetcollection = 'test'; // name of collection to add to witin the database


  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    var collection = db.collection(targetcollection);
    var myobj = { name: "Jeevan", address: "test" };
    collection.insertOne(myobj, function(err, result) {
      if (err) throw err;
    });
  });
};

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


function updateDocs(db, collections, id, update) {
  var collection = db.collection(targetcollection);
  var query = { 'id': id }; // document in the collection where _id matches the target id
  // console.log(update);
  console.log(update);
  // console.log(id);
  
  collection.update(query, update, function(err, result) {
  
    if (err) throw err;
  //   // callback(result);

  });
}



function logresults( string ) {
  console.log(string);
}
