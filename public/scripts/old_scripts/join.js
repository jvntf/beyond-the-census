var MongoClient = require('mongodb').MongoClient
  , assert = require('assert')
  , ObjectId = require('mongodb').ObjectId;

// Connection URL
var url = 'mongodb://localhost:27017/ELAdata';

// new language list
var newlangs = [
    'Swahili',
    'Oromo',
    'Somali',
    'Berber',
    'Wolof',
    'Yoruba',
    'Fulani',
    'Akan (Twi)',
    'Hausa',
    'Xhosa'
  ]

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  db.collection('languages').find({language: {$in: newlangs}}).toArray( (err, results) => {
    results.forEach( (result) => {
      // update endangermentNum
      db.collection('languages').update({_id: ObjectId(result._id)}, {$set: {endangermentNum: result.endagerment.charAt(0) }}, (err, result) => {
        console.log(result)
      })

      // update continent
      db.collection('continents').find({"properties.CONTINENT": result.continent_txt}).toArray( (err, contResult) => {
        db.collection('languages').update({_id: ObjectId(result._id)}, {$push: {continents: contResult._id}}, (err, result) => {
          console.log(results)
        })
      })

      // update countries (later)
    })
  })


  db.close();
});
