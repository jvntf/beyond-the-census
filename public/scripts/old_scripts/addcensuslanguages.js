var fs = require('fs');
var csv = require('csv');
var async = require('async');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert')
  , ObjectId = require('mongodb').ObjectID;

// Connection URL
// var url = 'mongodb://localhost:27017/ELAdata';
var url = 'mongodb://c4sr:languages@ds227555.mlab.com:27555/heroku_wpb27xt2';
var csvPath = '../../data/glottoQueens_reExport.csv';  // path to file with utf8 encoding

// var csvPath = '../data/170807_censuslanguages.csv';


MongoClient.connect(url, function(err, db) {
  fs.readFile(csvPath, {encoding: 'utf8'}, (err, data) => {
    csv.parse(data, {columns: true, auto_parse:true}, (err, data) => {

      async.each(data,

        (item, callback) => {
          // do to each...
          if (item.iscensus = 'true') item.iscensus = true;
          console.log(item)
          // search for existing by
          //db.collection('languages').findOne({language: item.linguafranca}, (err, result) => {
          //  if (result) console.log(result.language)
          //  else console.log(`!!!: ${item.linguafranca}`)
           callback();
          //});
        },

        (err, result) => {
          // when done...
          db.close();
        });

      /*var length = data.length;
      var randIndex = parseInt(Math.random() * data.length - 1);
      var datum = data[randIndex];
      fs.readFile(placeBorn, {encoding: 'utf8'}, (err, data) => {
          //console.log(data)
        csv.parse(data, {columns: ['key', 'value']}, (err, data) => {
          if (err) throw err;
          //console.log(data)
          switch (datum.nativity) {
            case '2':
                var thisCountry = data.find( (item) => {
                  return item.key == datum.place_born;
                }).value;

                //console.log(thisCountry)
                console.log('\n')
                console.log('---')
                console.log(`I am ${datum.age} years old, and I came to the US in ${datum.year_entry} from ${thisCountry}`);
                tellLanguageStory(datum, (story) => {console.log(story)
                  console.log('---')
                  console.log('\n')
                });
                break;

            case '1':
                console.log('\n')
                console.log('---')
                console.log(`I am ${datum.age} years old, and I was born in the US.`);
                tellLanguageStory(datum, (story) => {console.log(story)
                  console.log('---')
                  console.log('\n')
                });
                break;
          }
        })
      });*/


    });
  });
});
