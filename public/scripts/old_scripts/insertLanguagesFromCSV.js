var fs = require('fs');
var csv = require('csv');
var _ = require('lodash');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var sourcePath = '../../data/glottoQueens_reExport.csv';  // path to file with utf8 encoding

// Connection URL
// var url = 'mongodb://localhost:27017/ELAdata'; // change last part of path to db name
var url = 'mongodb://c4sr:languages@ds227555.mlab.com:27555/heroku_wpb27xt2'
var targetcollection = 'new_languages'; // name of collection to add to witin the database

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  fs.readFile(sourcePath, 'utf8', (err, data) => {
    if (err) throw err;
    csv.parse(data, {columns: true}, (err, data) => {
      if (err) throw err;
      let uniqueLangs = [];
      let outputData = [];
      data.forEach( (item) => {
        if ( item.langID.substring(0,1) == "\r" ) {  // strip mystery carriage returns on some lang ids
          item.langID = item.langID.substring(1);
        }
        if ( uniqueLangs.indexOf(item.langID) < 1) { // if language isn't in the list...
          // create new object with selected fields only
          let itemSelectedFields = _.pick(item, ['langID', 'wiki', 'ethno', 'description', 'endagerment']);
          // add renamed fields
          itemSelectedFields.name = item.language;
          uniqueLangs.push(item.langID); // add ID of this language to unique value array
          outputData.push(itemSelectedFields); // add modified item to output data array
        }
      });
      insertDocuments( db, outputData, logresults );
      db.close();
    });
  });
});

var insertDocuments = function(db, data, callback) {
  var collection = db.collection( targetcollection );
  collection.insertMany(data, function(err, result) {
    if (err) throw err;
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

function logresults( string ) {
  console.log(string);
}

// UNUSED:
//reformatted = JSON.stringify(data, null, '  ');  pretty print
//console.log(reformatted);
