var fs = require('fs');
var csv = require('csv');
var _ = require('lodash');
var ids = [];


      var x = 0;
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// var sourcePath = '../source/QueensLanguages.csv';  // path to file with utf8 encoding
// var sourcePath = '../../data/glottoQueens_reExport.csv';  // path to file with utf8 encoding
var sourcePath = '../old_csv/newEntries.csv'

var errorLogPath = '../log.txt';

// Connection URL
// var url = 'mongodb://localhost:27017/ELAdata'; // change last part of path to db name
//beyond-the-census-dev
//
var url = 'mongodb://c4sr:languages@ds227555.mlab.com:27555/heroku_wpb27xt2'

var targetcollection = 'languages'; // name of collection to add to witin the database

var collections = ["countries", "neighborhoods", "continents","endangerment"];


var fields = {
  "countries":'properties.ADMIN',
  "neighborhoods":'properties.NTAName',
  "continents": "properties.CONTINENT",
  "endangerment":"endangerment"
}

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  fs.readFile(sourcePath, 'utf8', (err, data) => {
    if (err) throw err;
    csv.parse(data, {columns: true}, (err, data) => {
      if (err) throw err;

      // for each item in the CSV
      // fs.writeFile('countries.csv',"language, country,", 'utf8');
      var query = {};

      var counter = 1;



      data.forEach( (item) => {
        var arrays = {};
        var countrystring = `${item.iso_country1}; ${item.iso_country2}; ${item.iso_country3}; ${item.iso_country4};
                              ${item.iso_country5}; ${item.iso_country6}; `;  //string of all countries
        var countryArray = countrystring.replace(/;/g, ',').split(',');  //replace semicolon separators and split to array
        countryArray.forEach(function(item, i) { 
          countryArray[i] = _.trim(item) 
          if (countryArray[i]=='NULL' || countryArray[i]==""){
            delete countryArray[i];
          }
        }); //trim  whitespcae
        countryArray = _.uniq(_.compact(countryArray)); //ensure array is unique values only and without nulls


        var neighborhoodArray = [`${item.ntaname}`];

        neighborhoodArray.forEach(function(item, i) {
          neighborhoodArray[i] = _.trim(item);
        })

        neighborhoodArray = _.uniq(_.compact(neighborhoodArray));


        var continentArray = [`${item.continent}`];


        continentArray.forEach(function(item, i) {
          continentArray[i] = _.trim(item);
        })

        continentArray = _.uniq(_.compact(continentArray));

        var endangerment = `${item.endangerment}`;
        endangerment = endangerment.split(' ')[0];
        // console.log(endangerment);



        arrays[collections[0]] = countryArray;
        arrays[collections[1]] = neighborhoodArray;
        arrays[collections[2]] = continentArray;



        collections.forEach(function(curColl){
          // if (curColl == 'countries') {return;}
          // else if (curColl == 'neighborhoods') {return;}
          // else if (curColl == 'continents') {return;}
          if (curColl ==  'endangerment') {


        
            var update = { $set: {[curColl] : Number(endangerment)}};
            updateDocumentPush(db, [targetcollection], item.langID, update, logresults );
            return;


          }

          // console.log(curColl);
          var id = lookupID(item.language, db, curColl, fields[curColl], arrays[curColl], function(ids) {
            //ids are the oIDS to update
            var update = { $set: {[curColl] : ids}};

            // console.log('ids '+ids.length);

            updateDocumentPush(db, [targetcollection], item.langID, update, logresults );
            if (counter == data.length) {
              //console.log(counter);
            } else {
              counter+=1;
            }
          }, item.langID);
        });
    




      });

      
    });
  });
});

function updateDocumentPush(db, collections, id, update, callback) {  // db, array of collections, id, object containing key value pairs to set
  
  collections.forEach( (item) => {  // for each collection passed, do the update
    var targetCollection = db.collection( item );
    var query = { 'langID': id }; // document in the collection where _id matches the target id
    // console.log(update);
    console.log(update);
    // console.log(id);
    
    targetCollection.update(query, update, function(err, result) {
    
      if (err) throw err;
    //   // callback(result);

    });
  })
}

function lookupID( language, db, collection, field, values, callback, id ) {  // where values is array of countries/neighborhoods etc to look up
  //collection to query
  var targetCollection = db.collection (collection);
  var query = {};
  var ids = [];

  //for each country name
  var counter = 1;
  values.forEach( function(value) {
  // for (var i = 0; i < values.length; i++) {
    //dictionary of country names
    query[field] = value;
    // console.log(value);


    targetCollection.findOne(query, function(err, result) {
 
        if (err) throw err;
        if ( result == null ) {
         // console.log(id + ' '+value);
        }
        else {

          ids.push(result._id);
          if (counter == values.length) {
              // console.log(values);
              // console.log(language + ' '+ids);
              callback(ids);
          } else{
            counter+=1;
          }
   
        }
    }); 
    
  });
  // console.log(ids); 

  // console.log(ids.size);
  // return ids;
  // callback(ids);
  
}

function logresults( string ) {
  // console.log(string);
}

// UNUSED:
//reformatted = JSON.stringify(data, null, '  ');  pretty print
//console.log(reformatted);
