var fs = require('fs');
var csv = require('csv');

var main = "../pums/pumsqns.csv";
var placeBorn = "../pums/keys/place_born.csv";
var langSpoken = "../pums/keys/language_home.csv";

fs.readFile(main, {encoding: 'utf8'}, (err, data) => {
  csv.parse(data, {columns: true}, (err, data) => {
    var length = data.length;
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
    });
  });
});

function tellLanguageStory( datum, callback ) {
  fs.readFile(langSpoken, {encoding: 'utf8'}, (err, data) => {
      //console.log(data)
    csv.parse(data, {columns: ['key', 'value']}, (err, data) => {
      if (err) throw err;
      var langCSV = data;
      //console.log(langCSV)

      switch (datum.lang_home_nonenglish) {
        case '2':
          callback('At home, I speak English.');
          break;
        case '1':
          var langSpoken = langCSV.find( (item) => {
            return item.key == datum.lang_spoken_home;
          }).value;
          callback(`At home, I speak ${langSpoken}.`);
          break;
        }

        })
      })
}
