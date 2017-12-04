var MongoClient = require('mongodb').MongoClient
  , assert = require('assert')
  ObjectId = require('mongodb').ObjectId;

// Connection URL
var url = 'mongodb://localhost:27017/ELAdata';
var oldID = '594ae579992b890a98e5b8fd';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
    console.log("Connected successfully to server");
  //var languageCollection = db.collection('languages');
  var neighborhoodsCollection = db.collection('neighborhoods');
  var countriesCollection = db.collection('countries');
  var institutionsCollection = db.collection('institutions');

  neighborhoodsCollection.update(
    { "properties.languages": ObjectId(oldID) },
    { $pull: { "properties.languages": ObjectId(oldID) } },
    { multi: true },
    () => {
        console.log('updated neighborhoods')
      })

      countriesCollection.update(
        { "properties.languages": ObjectId(oldID) },
        { $pull: { "properties.languages": ObjectId(oldID) } },
        { multi: true },
        () => {
            console.log('updated countries')
          })

          institutionsCollection.update(
            { "languages": ObjectId(oldID) },
            { $pull: { languages: ObjectId(oldID) } },
            { multi: true },
            () => {
                console.log('updated neighborhoods')
              })



  db.close();
});
