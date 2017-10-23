var MongoClient = require('mongodb').MongoClient
  , ObjectId = require('mongodb').ObjectId
  , assert = require('assert')
  , fs = require('fs')
  , csv = require('csv');

// Connection URL
var url = 'mongodb://localhost:27017/ELAdata';
var keyPath = '../data/pums/keys'
  , keyNames = [  'ancestry',
                  'language_spokenathome',
                  'place_born',
                  'moved_from' ];

                  //'english_ability',
                  //'citizenship',
                  //'english_spokenathome',

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
    console.log("Connected successfully to server");

    keyNames.forEach( (name) => {
      let path = keyPath + '/' + name + '.txt';
      fs.readFile(path, (err, buffer) => {
        csv.parse(buffer, (err, parsed) => {
          console.log(parsed);
        })
      })
    })

    

    /* add to country
    db.collection('countries').update(
      { "properties.ISO_A3": "USA" },
      { $push: { "properties.languages": ObjectId(newID) } },
      (err, count, status) => {
        console.log('updated country')
        console.log(status)
      }
    );

     add to neighborhood
    db.collection('neighborhoods').update(
      { "properties.NTAName": "Hollis" },
      { $push: { "properties.languages": ObjectId(newID) } },
      (err, count, status) => {
        console.log('updated neighborhood')
        console.log(status)
      }
    );  */



  db.close();
});
