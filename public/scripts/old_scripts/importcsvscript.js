// load csv

  var fs = require('fs');
  //var parse = require('csv-parse');
  var parse = require('csv-parse/lib/sync');
  //require('should');

  var csvData=[];

  var csvPath = './lang-continent.csv';

// connect to database

  var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

  var ObjectId = require('mongodb').ObjectID;

  // Connection URL
  var url = 'mongodb://localhost:27017/ELAdata';
  var csvPath = './lang-continent.csv';

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    csv = parse(fs.readFileSync(csvPath), {columns: true});
    csv.forEach( (row) => {
      console.log(row);
      updateDocuments(db, row.language, row.continents, row.endangermentInt, function() {

      })
    })
    //db.close();
  });


  function updateDocuments(db, langname, continentId, endangerment, callback) {
    //console.log(langname);
    var collection = db.collection('languages');
    var query = {language: langname};
    //console.log(query);
    var update = { $set: {continents: [ObjectId(continentId)], endangermentNum: endangerment}};
    console.log(update);
    collection.update(query, update, (err, result) => {
      console.log(result);
      callback(result);
    })
    //collection.find(query).toArray( (err, docs) => {
      //console.log('found the following:')
      //console.log(docs);
    //  callback(docs);
    //})
  }
