var fs = require('fs');
var csv = require('csv');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// var sourcePath = '../resources/QueensLanguages.csv';  // path to file with utf8 encoding
// var sourcePath = '../../data/glottoQueens_reExport.csv';  // path to file with utf8 encoding
var sourcePath = '../../data/old_data/alt_scripts.csv';  // path to file with utf8 encoding

// Connection URL
// var url = 'mongodb://localhost:27017/leaflet_test'; // change last part of path to db name

// var url = 'mongodb://c4sr:languages@ds227555.mlab.com:27555/heroku_wpb27xt2'
var url = 'mongodb://c4sr:lang2018@ds151530.mlab.com:51530/heroku_n7xsssc4'
var targetcollection = 'languages'; // name of collection to add to witin the database


// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  // fs.readFile(sourcePath, 'utf8', (err, data) => {
  //   if (err) throw err;
  //   csv.parse(data, {columns: true}, (err, data) => {
  //     if (err) throw err;
  //     reformatted = JSON.stringify(data, null, '  ');
  //     console.log(reformatted);
  //     insertDocuments( db, data, logresults );
  //     db.close();
  //   });
  //   //console.log(data);
  // });


  fs.readFile(sourcePath, 'utf8', (err, data) => {
    if (err) throw err;
    data = data.split('\n')
    data.forEach( (line) =>{
      line = line.split(',');

      var id = line[0];
      var en;
      var es;
      var script;
      var country;

      for (var i = 1; i < line.length; i++) {
        if (line[i].includes('[en]')){
          en = line[i];
        }else if (line[i].includes('[es]')){
          es = line[i];
        }else if (line[i].includes('[sc]')){
          script = line[i];
        }else{
          country = line[i];
        }
      }

    // if(typeof en !== 'undefined') {
    //   var update = { $set: {['en_name'] : en.substring(0, en.length-5)}};
    //   updateDocs(db, targetcollection, id, update )
    // }
    // if(typeof es !== 'undefined') {
    //   var update = { $set: {['es_name'] : es.substring(0, es.length-5)}};
    //   updateDocs(db, targetcollection, id, update )
      
    // }
    if(typeof script !== 'undefined') {
      var update = { $set: {['script'] : script.substring(0, script.length-4)}};
      updateDocs(db, targetcollection, id, update )
      
    }
    else if(typeof country !== 'undefined') {
      var update = { $set: {['script'] : country.substring(0, country.length-5)}};
      updateDocs(db, targetcollection, id, update )
      
    }
    // 
    // 
      // var update = { $unset: {['es_name'] : ""}};
      // updateDocs(db, targetcollection, id, update )

    });

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

function removeDocs(db, collections, id, update) {
  var collection = db.collection(targetcollection);

  var query = {'id':id};
  collection.update(query, update, function(err, result) {
  
    if (err) throw err;
  //   // callback(result);

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
