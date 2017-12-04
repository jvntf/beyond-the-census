var fs = require('fs');

var input = '../institutions.json';
var output = '../intitutions.geojson';

fs.readFile(input, {encoding: 'utf8'}, (err, data) => {
  var oldArray = JSON.parse(data);

  var newArray = oldArray.map( (institution) => {
    var oldObj = institution;
    var newObj = {}
    newObj._id = oldObj._id;
    delete oldObj._id;
    newObj.type = 'Feature';
    newObj.properties = oldObj;
    newObj.geometry = {
        "type": "Point",
        "coordinates": [0.0, 0.0]
      };
    return newObj;
  })
  fs.writeFile(output, JSON.stringify(newArray), (err, result) => {
    console.log(result);
  })
})

// add type; feature
// move existing fields to properties
// create blank geometry
