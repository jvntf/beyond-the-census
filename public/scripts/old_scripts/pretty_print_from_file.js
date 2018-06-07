var fs = require('fs');
var path = require('path');

var sourcefolder = "../elamap_170531/elamap/data";
var destinationfolder = "./tmp";

var sourcelist = [
  "citypoints.geojson",
  "corona_jh.geojson",
  "lang.geojson",
  "lang2.geojson",
  "langs.geojson",
  "languages.geojson",
  "qns_kiche.geojson",
  "queens.geojson",
  "refugees_by_state.geojson",
  "ridgewood.geojson",
];

sourcelist.forEach( (item, index ) => {
  var reformatted;
  var sourcepath = `${sourcefolder}/${item}`;
  var destinationpath = `${destinationfolder}/${item}.txt`;

  //console.log(filepath);

  fs.readFile(sourcepath, 'utf8', (err, data) => {
    if (err) throw err;
    reformatted = JSON.stringify(JSON.parse(data), null, '\t');
    fs.writeFile(destinationpath, reformatted, 'utf8', (err, data) => {
      if (err) throw err;
    });
    //console.log(JSON.stringify(JSON.parse(data), null, '\t'));
    console.log("read " + sourcepath);
  });
});
