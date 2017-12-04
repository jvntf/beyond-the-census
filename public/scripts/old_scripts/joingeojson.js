var fs = require('fs');
var csv = require('csv');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var sourcePath = '../resources/QueensLanguages.csv';  // path to file with utf8 encoding
var geoJSONpath = '../resources/neighborhoods.geojson'; // path to file with neighborhood features
var newObj = {};
// Connection URL
var url = 'mongodb://localhost:27017/leaflet_test'; // change last part of path to db name
var sourcecollection = 'languages';
var targetcollection = 'language_neighborhoods'; // name of collection to add to witin the database


// load geoJSON from file
fs.readFile(geoJSONpath, (err, data) => {
  if (err) throw err
  let geoDocs = JSON.parse(data).features;
  //console.log(allFeatures);
  let sourceData = [];
  let neighborhoodsrc = [];
  let neighborhooddest = [];
  var matchCheck = false;

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    // get all records from database
    var source = db.collection( sourcecollection );
    source.find({}).toArray(function(err, docs) {
      //assert.equal(err, null);
      //console.log(docs);
      docs.forEach( (item, index) => {
        neighborhoodsrc.push(item.ntaname);
        delete item._id;
        //console.log(item.ntaname);
        // loop through source documents
          geoDocs.forEach( (geoItem, geoIndex) => {
            neighborhooddest.push(geoItem.properties.NTAName);
            delete geoItem._id;
            if ( item.ntaname == geoItem.properties.NTAName ) {
              matchCheck = true;
              var merged = Object.assign(geoItem.properties, item);
              geoItem.properties = merged;
              //console.log(geoItem);
              var destination = db.collection( targetcollection );
              destination.insert( geoItem, ( err, result ) => {
                if (err) throw err;
                //console.log(result);
                db.close();
              });
            } else {
              //console.log(`no match: ${geoItem.properties.NTAName}`);
            }
          })

          if (matchCheck == true) {
            console.log("match!")
            matchCheck = false;
          } else {
            console.log("no match" + item.ntaname);
          }
      })
    });
  });
});

/*
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  fs.readFile(geoJSONpath, (err, data) => {
    if (err) throw err;

    //reformatted = JSON.stringify(JSON.parse(data), null, '  ');
    //console.log(reformatted);

    console.log(data.features);

    db.close();
  //console.log(data);
  });
});*/

/*var insertDocuments = function(db, data, callback) {
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
}*/

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
