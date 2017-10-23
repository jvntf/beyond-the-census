var MongoClient = require('mongodb').MongoClient
  , assert = require('assert')
  ObjectId = require('mongodb').ObjectId;

// Connection URL
var url = 'mongodb://localhost:27017/ELAdata';
//var oldID = '594ae579992b890a98e5b8fd';
var newID = '597799bf309fa6b22ee11a3f';


// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
    console.log("Connected successfully to server");

    // add to country
    db.collection('countries').update(
      { "properties.ISO_A3": "USA" },
      { $push: { "properties.languages": ObjectId(newID) } },
      (err, count, status) => {
        console.log('updated country')
        console.log(status)
      }
    );

    // add to neighborhood
    db.collection('neighborhoods').update(
      { "properties.NTAName": "Hollis" },
      { $push: { "properties.languages": ObjectId(newID) } },
      (err, count, status) => {
        console.log('updated neighborhood')
        console.log(status)
      }
    );

    // continent doesn't have embedded languages

  db.close();
});
